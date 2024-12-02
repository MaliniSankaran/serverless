// index.js

import sendgrid from '@sendgrid/mail';
import AWS from 'aws-sdk';

// Create an instance of the Secrets Manager client
const secretsManager = new AWS.SecretsManager();
const secretName = process.env.SECRET_NAME;

// Lambda handler function
export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
  
    // Parse the SNS message, expecting JSON structure with email and token
    const message = JSON.parse(event.Records[0].Sns.Message);
    const { email, first_name, last_name, verification_link, expiry_time} = message;  // Get the email and token from the message
  
    console.log("Verification link:", verification_link);
  
    let sendgridApiKey;
    let emailSender;
    try {
        const secretValue = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        if (secretValue.SecretString) {
            const secret = JSON.parse(secretValue.SecretString);
            sendgridApiKey = secret.sendgrid_api_key;  // Extract SendGrid API key
            emailSender    = secret.email_sender;      // Extract email sender
        } else {
            console.error('Secret string is empty or does not exist');
            throw new Error('Secret string not found');
        }
    } catch (err) {
        console.error('Error retrieving secret:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving SendGrid API key', error: err.message })
        };
    }

    // Set SendGrid API key
    sendgrid.setApiKey(sendgridApiKey);
    // Set the expiration time for the token (2 minutes from now)
    const expiryTime = expiry_time || new Date(Date.now() + 2 * 60 * 1000).toISOString();  // 2 minutes expiration
  
    // Set up the email content using SendGrid
    const emailContent = {
      to: email,
      from: emailSender,
      subject: 'Email Verification',
      text: `
      Hello ${first_name} ${last_name}!\n\n
      Welcome!
      Thank you for registering with us. Please click on the following link to verify your email address:
      ${verification_link}\n\n
      The link will expire in 2 minutes. If you did not request this email, kindly ignore .\n\n
      Best regards,\n
      Skydev Team
    `,
      
      html: `
      <p>Hello ${first_name} ${last_name}!</p>
      <p>Welcome!</p>
      <p>Thank you for registering with us. Please click on the following link to verify your email address:</p>
      <p><a href="${verification_link}">Verify Your Email</a></p>
      <p>The link will expire in 2 minutes. If you did not request this email, kindly ignore.</p>
      <p>Best regards,<br>Skydev Team</p>
      `,
    };
  
    try {
      // Send the verification email via SendGrid
      await sendgrid.send(emailContent);
      console.log('Verification email sent successfully.');
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Verification email sent.', expiry: expiryTime }),
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error sending verification email.', error: error.message }),
      };
    }
  };