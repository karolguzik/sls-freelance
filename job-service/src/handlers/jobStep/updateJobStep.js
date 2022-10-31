import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import validator from "@middy/validator";
import createError from "http-errors";
import updateJobStepSchema from "../../lib/schemas/jobStep/updateJobStepSchema";
import { getJobById } from "../job/getJob";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const updateJobStep = async (event) => {
  const { jobId, stepId, title, description, documents } = event.body;
  const job = await getJobById(jobId);
  let updatedJob;

  const updatedJobSteps = job.steps.map((step) =>
    step.id === stepId ? { ...step, title, description, documents } : step
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

  return {
    statusCode: 201,
    body: JSON.stringify(updatedJob),
  };
};

export const handler = middleware(updateJobStep).use(
  validator({ inputSchema: updateJobStepSchema, useDefaults: true })
);
