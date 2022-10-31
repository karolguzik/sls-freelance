import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";
import { getJobById } from "./getJob";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const deleteJob = async (event) => {
  const { id } = event.pathParameters;
  const job = await getJobById(id);

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
    Key: { id: job.id },
  };

  try {
    await dynamodb.delete(params).promise();
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Job successfully deleted." }),
  };
};

export const handler = middleware(deleteJob);
