function sendMail(apiKey, secretKey, senderAddress, senderName, recipientAddress, subject, htmlBody){

  const mailjet = require ('node-mailjet')
  .connect(apiKey, secretKey)
  const request = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": senderAddress,
          "Name": senderName
        },
        "To": [
          {
            "Email": recipientAddress
          }
        ],
        "Subject": subject,
        "HTMLPart": htmlBody
      }
    ]
  })
  request
    .then((result) => {
      console.log(result.body)
    })
    .catch((err) => {
      console.log(err.statusCode)
    })

}

module.exports = sendMail;