import AWS from "aws-sdk";

const sqs = new AWS.SQS();

const sendRequestConfirmJobStepMail = async (client, freelancer, link) => {
  await sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Freelancero.com - Job step is done!`,
        recipient: client,
        body: `Hello ${client}! \n
             I have a great news! The job step is done. \n
             Please sign in the platform and check the results. I hope that the process will be satisfied for you. \n
             Here are the link to platform ${link}. \n 
             Have a good time, ${freelancer}!`,
      }),
    })
    .promise();
};

export default sendRequestConfirmJobStepMail;
