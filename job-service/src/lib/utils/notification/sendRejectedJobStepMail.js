import AWS from "aws-sdk";

const sqs = new AWS.SQS();

const sendRejectedJobStepMail = async (client, freelancer) => {
  await sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Requested from ${client} rejected!`,
        recipient: freelancer,
        body: `Your client ${client} unfortunately rejected the job step.`,
      }),
    })
    .promise();
};

export default sendRejectedJobStepMail;
