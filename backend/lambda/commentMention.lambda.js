const SNS = require('@aws-sdk/client-sns');

const sns = new SNS.SNS();

exports.handler = async (event) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    const { userWhoMentioned, username, phoneNumber } = message;

   const notificationMessage = `User ${userWhoMentioned} was mentioned you in his comment.`;

    await sns.publish({
      Message: notificationMessage,
      Subject: `You were mentioned in a comment by ${userWhoMentioned}`,
      PhoneNumber: phoneNumber,
    })

    console.log(`Notification sent for ${username} activity`);
  }
};
