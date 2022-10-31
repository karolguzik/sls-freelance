import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getJobs = async (event) => {
  let jobs;

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    jobs = result.Items;
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify(jobs),
  };
};

export const handler = middleware(getJobs);
