import AWS from "aws-sdk";

const sqs = new AWS.SQS();

const sendAcceptedJobStepMail = async (client, freelancer) => {
  await sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Requested from ${client} accepted!`,
        recipient: freelancer,
        body: `Your client ${client} successfully accepted the job step.`,
      }),
    })
    .promise();
};

export default sendAcceptedJobStepMail;
