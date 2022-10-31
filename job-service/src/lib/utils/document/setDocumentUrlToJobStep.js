import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function setDocumentUrlToJobStep(documentData, job, stepId) {
  const updatedJobSteps = job.steps.map((step) =>
    step.id === stepId ? step.documents.push(documentData) : step
  );

  const params = {
    TableName: process.env.JOBS_TABLE_NAME,
    Key: { id: job.id },
    UpdateExpression: "set steps = :updatedJobSteps",
    ExpressionAttributeValues: {
      ":updatedJobSteps": updatedJobSteps,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(
      "Server error. Please try again."
    );
  }
}

export default setDocumentUrlToJobStep;
