import AWS from "aws-sdk";

const sqs = new AWS.SQS();

const sendCreatedAccountMail = async (client, freelancer, link) => {
  await sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Freelancero.com - Welcome on board ${client}!`,
        recipient: client,
        body: `Hello ${client}! Your account has been created. You can sign in and follow process of your jobs. \n
             Please sign in by following link ${link} \n
             I belive that our cooperation will be successfull. 
             Have a good time, ${freelancer}!`,
      }),
    })
    .promise();
};

export default sendCreatedAccountMail;
