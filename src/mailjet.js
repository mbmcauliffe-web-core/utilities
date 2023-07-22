async function sendMail ( apiKey, secretKey, senderAddress, senderName, recipientAddress, subject, htmlBody, attachments=[], carbonCopy ) {

  const Mailjet = require('node-mailjet');
  const mailjet = await Mailjet.apiConnect(
      apiKey,
      secretKey,
  );

  let messageObject = {
    From: {
      Email: senderAddress,
      Name: senderName
    },
    To: [
      {
        Email: recipientAddress//,
        //Name: "passenger 1"
      }
    ],
    Subject: subject,
    HTMLPart: htmlBody,
    Attachments: attachments
  };

  if ( carbonCopy ) {
    if ( carbonCopy != recipientAddress ) {

      messageObject.Cc = {
        Email: carbonCopy
      }

    }
  }

  console.log( "\n\nSending Email:\n" + JSON.stringify( messageObject ) + "\n" );

  const request = await mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [messageObject]
    });

}

module.exports = sendMail;