import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getClientById = async (id) => {
  let client;

  const params = {
    TableName: process.env.CLIENTS_TABLE_NAME,
    Key: { id },
  };

  try {
    const result = await dynamodb.get(params).promise();

    client = result.Item;
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  if (!client) {
    throw new createError.NotFound(`Client with ID ${id} not found.`);
  }

  return client;
};

export const getClientByEmail = async (email) => {
  let client;

  const params = {
    TableName: process.env.CLIENTS_TABLE_NAME,
    IndexName: "emailIndex",
    KeyConditionExpression: "#email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    ExpressionAttributeNames: {
      "#email": "email",
    },
  };

  try {
    const result = await dynamodb.query(params).promise();
    client = result.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return client[0];
};

const getClient = async (event) => {
  const { id } = event.pathParameters;
  const client = await getClientById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(client),
  };
};

export const handler = middleware(getClient);
