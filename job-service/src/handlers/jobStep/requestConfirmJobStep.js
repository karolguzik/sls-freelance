import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import validator from "@middy/validator";
import createError from "http-errors";
import requestConfirmJobStepSchema from "../../lib/schemas/jobStep/requestConfirmJobStepSchema";
import { getJobById } from "../job/getJob";
import sendRequestConfirmJobStepMail from "../../lib/utils/notification/sendRequestConfirmJobStepMail";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const requestConfirmJobStep = async (event) => {
  const { email: freelancerEmail } = event.requestContext.authorizer;
  const { jobId, stepId } = event.body;
  const job = await getJobById(jobId);
  let updatedJob;

  const updatedJobSteps = job.steps.map((step) =>
    step.id === stepId ? { ...step, status: "WAITING_FOR_CONFIRM" } : step
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

  await sendRequestConfirmJobStepMail(
    "guzikk.dev@gmail.com",
    freelancerEmail,
    "https://examplelink.com"
  );

  return {
    statusCode: 201,
    body: JSON.stringify(updatedJob),
  };
};

export const handler = middleware(requestConfirmJobStep).use(
  validator({ inputSchema: requestConfirmJobStepSchema })
);
