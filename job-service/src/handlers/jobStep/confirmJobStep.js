import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import validator from "@middy/validator";
import createError from "http-errors";
import confirmJobStepSchema from "../../lib/schemas/jobStep/confirmJobStepSchema";
import { getJobById } from "../job/getJob";
import sendAcceptedJobStepMail from "../../lib/utils/notification/sendAcceptedJobStepMail";
import sendRejectedJobStepMail from "../../lib/utils/notification/sendRejectedJobStepMail";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const confirmJobStep = async (event) => {
  const { jobId, stepId, status } = event.body;
  const job = await getJobById(jobId);
  let updatedJob;

  const updatedJobSteps = job.steps.map((step) =>
    step.id === stepId ? { ...step, status } : step
  );

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
    Key: { id: job.id },
    UpdateExpression: "set steps = :updatedJobSteps",
    ExpressionAttributeValues: {
      ":updatedJobSteps": updatedJobSteps,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();
    updatedJob = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  status === "ACCEPTED"
    ? await sendAcceptedJobStepMail(
        "guzikk.dev@gmail.com",
        "guzikk.dev@gmail.com"
      )
    : await sendRejectedJobStepMail(
        "guzikk.dev@gmail.com",
        "guzikk.dev@gmail.com"
      );

  return {
    statusCode: 201,
    body: JSON.stringify(updatedJob),
  };
};

export const handler = middleware(confirmJobStep).use(
  validator({ inputSchema: confirmJobStepSchema })
);
