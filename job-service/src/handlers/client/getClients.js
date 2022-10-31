import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getClients = async (event) => {
  let clients;

  const params = {
    TableName: process.env.CLIENTS_TABLE_NAME,
  };

  try {
    const result = await dynamodb.scan(params).promise();

    clients = result.Items;
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify(clients),
  };
};

export const handler = middleware(getClients);
