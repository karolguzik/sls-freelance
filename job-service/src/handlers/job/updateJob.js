import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import validator from "@middy/validator";
import createError from "http-errors";
import updateJobSchema from "../../lib/schemas/job/updateJobSchema";
import { getJobById } from "./getJob";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const updateJob = async (event) => {
  const { title, description } = event.body;
  const { id } = event.pathParameters;
  const job = await getJobById(id);
  let updatedJob;

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
    Key: { id: job.id },
    UpdateExpression: "set title = :title, description = :description",
    ExpressionAttributeValues: {
      ":title": title,
      ":description": description,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();
    updatedJob = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(updatedJob),
  };
};

export const handler = middleware(updateJob).use(
  validator({ inputSchema: updateJobSchema })
);
