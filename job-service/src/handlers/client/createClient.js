/* eslint-disable new-cap */
import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import middleware from "../../lib/middleware";
import createError from "http-errors";
import validator from "@middy/validator";
import createClientSchema from "../../lib/schemas/client/createClientSchema";
import { getClientByEmail } from "./getClient";
import sendCreatedAccountMail from "../../lib/utils/notification/sendCreatedAccountMail";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const createClient = async (event) => {
  const { email } = event.body;
  const { email: freelancerEmail } = event.requestContext.authorizer;

  const isClientExists = await getClientByEmail(email);

  if (isClientExists) {
    throw new createError.NotAcceptable(
      `Client with email ${email} already exists.`
    );
  }

  const client = {
    id: uuid(),
    email,
  };

  const params = {
    TableName: process.env.CLIENTS_TABLE_NAME,
    Item: client,
  };

  try {
    await dynamodb.put(params).promise();
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }

  await sendCreatedAccountMail(
    "guzikk.dev@gmail.com",
    freelancerEmail,
    "https://examplelink.com"
  );

  return {
    statusCode: 201,
    body: JSON.stringify(client),
  };
};

export const handler = middleware(createClient).use(
  validator({ inputSchema: createClientSchema })
);
