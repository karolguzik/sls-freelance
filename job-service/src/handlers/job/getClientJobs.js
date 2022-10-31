import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getClientJobs = async (event) => {
  const { email } = event.body;
  let jobs;

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
    IndexName: "clientIndex",
    KeyConditionExpression: "#client = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    ExpressionAttributeNames: {
      "#client": "client",
    },
  };

  try {
    const result = await dynamodb.query(params).promise();
    jobs = result.Items;
  } catch (error) {
    throw createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(jobs),
  };
};

export const handler = middleware(getClientJobs);
