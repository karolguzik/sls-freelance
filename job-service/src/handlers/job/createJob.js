/* eslint-disable new-cap */
import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import validator from "@middy/validator";
import createError from "http-errors";
import createJobSchema from "../../lib/schemas/job/createJobSchema";
import { getClientByEmail } from "../client/getClient";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const createJob = async (event) => {
  const { title, description, client } = event.body;

  const isClientExists = await getClientByEmail(client);

  if (!isClientExists) {
    throw new createError.NotAcceptable(
      `Client with email ${client} does not exists.`
    );
  }

  const job = {
    id: uuid(),
    client,
    title,
    description,
    steps: [],
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
    Item: job,
  };

  try {
    await dynamodb.put(params).promise();
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  return {
    statusCode: 201,
    body: JSON.stringify(job),
  };
};

export const handler = middleware(createJob).use(
  validator({ inputSchema: createJobSchema, useDefaults: true })
);
