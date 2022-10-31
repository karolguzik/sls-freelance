import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getJobById = async (id) => {
  let job;

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
    Key: { id },
  };

  try {
    const result = await dynamodb.get(params).promise();
    job = result.Item;
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  if (!job) {
    throw new createError.NotFound(`Job with ID ${id} not found.`);
  }

  return job;
};

const getJob = async (event) => {
  const { id } = event.pathParameters;
  const job = await getJobById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(job),
  };
};

export const handler = middleware(getJob);
