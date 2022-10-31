import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getFeedbacks = async (event) => {
  let feedbacks;

  const params = {
    TableName: process.env.FEEDBACKS_TABLE_NAME,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    feedbacks = result.Items;
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify(feedbacks),
  };
};

export const handler = middleware(getFeedbacks);
