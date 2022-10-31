import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";
import { getClientById } from "./getClient";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const deleteClient = async (event) => {
  const { id } = event.pathParameters;
  const client = await getClientById(id);

  const params = {
    TableName: process.env.CLIENTS_TABLE_NAME,
    Key: { id: client.id },
  };

  try {
    await dynamodb.delete(params).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Client successfully deleted." }),
  };
};

export const handler = middleware(deleteClient);
