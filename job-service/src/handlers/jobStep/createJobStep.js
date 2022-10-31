import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import validator from "@middy/validator";
import createError from "http-errors";
import createJobStepSchema from "../../lib/schemas/jobStep/createJobStepSchema";
import { getJobById } from "../job/getJob";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const createJobStep = async (event) => {
  const { jobId, title, description, documents } = event.body;
  const job = await getJobById(jobId);
  const jobSteps = job.steps;
  let updatedJob;

  const jobStep = {
    id: uuid(),
    title,
    description,
    documents,
    status: "IN_PROGRESS",
    createdAt: new Date().toISOString(),
  };

  jobSteps.push(jobStep);

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
    Key: { id: job.id },
    UpdateExpression: "set steps = :jobSteps",
    ExpressionAttributeValues: {
      ":jobSteps": jobSteps,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();
    updatedJob = result.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(updatedJob),
  };
};

export const handler = middleware(createJobStep).use(
  validator({ inputSchema: createJobStepSchema, useDefaults: true })
);
