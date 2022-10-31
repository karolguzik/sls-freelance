import { v4 as uuid } from "uuid";
import middleware from "../../lib/middleware";
import validator from "@middy/validator";
import createError from "http-errors";
import uploadDocumentToS3 from "../../lib/utils/document/uploadDocumentToS3";
import setDocumentUrlToJobStep from "../../lib/utils/document/setDocumentUrlToJobStep";
import uploadJobStepDocumentSchema from "../../lib/schemas/jobStep/uploadJobStepDocumentSchema";
import { getJobById } from "../job/getJob";

const uploadJobStepDocument = async (event) => {
  const { jobId, stepId, title, documentBase64 } = event.body;
  const job = await getJobById(jobId);
  let updatedJob;

  const base64 = documentBase64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  try {
    const documentUrl = await uploadDocumentToS3(job.id + ".jpg", buffer);

    const documentData = {
      id: uuid(),
      title,
      document: documentUrl,
    };

    updatedJob = await setDocumentUrlToJobStep(documentData, job, stepId);
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedJob),
  };
};

export const handler = middleware(uploadJobStepDocument).use(
  validator({ inputSchema: uploadJobStepDocumentSchema })
);
