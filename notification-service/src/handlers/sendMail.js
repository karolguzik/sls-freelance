import AWS from "aws-sdk";

const ses = new AWS.SES({ region: "eu-west-1" });

const sendMail = async (event) => {
  const record = event.Records[0];
  console.log("Record processing: ", record);

  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;

  const params = {
    Source: "guzikk.dev@gmail.com",
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handler = sendMail;
