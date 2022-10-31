import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";
import validator from "@middy/validator";
import createFeedbackSchema from "../../lib/schemas/feedback/createFeedbackSchema";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const createFeedback = async (event) => {
  const { client, description } = event.body;

  const feedback = {
    id: uuid(),
    client,
    description,
  };

  const params = {
    TableName: process.env.FEEDBACKS_TABLE_NAME,
    Item: feedback,
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
    body: JSON.stringify(feedback),
  };
};

export const handler = middleware(createFeedback).use(
  validator({ inputSchema: createFeedbackSchema })
);
