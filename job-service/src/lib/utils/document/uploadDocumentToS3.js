import AWS from "aws-sdk";

const s3 = new AWS.S3();

const uploadDocumentToS3 = async (key, body) => {
  const result = await s3
    .upload({
      Bucket: process.env.JOBS_DOCUMENTS_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    })
    .promise();

  return result.Location;
};

export default uploadDocumentToS3;
