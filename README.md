# Serverless Lambda Functions for Email Verification

This repository contains Lambda functions that integrate with AWS SNS to send email verification links to users. The Lambda function is invoked whenever a new user account is created and handles the following tasks:

1. Sends an email to the user with a verification link.
2. The verification link expires after 2 minutes.

## Prerequisites

- **AWS CLI**: Ensure that AWS CLI is configured with the necessary credentials to interact with your AWS services.
- **Terraform**: Terraform will be used to create infrastructure and Lambda function resources.


### Serverless Function

The Lambda function listens for messages from AWS SNS and performs the following:

- Sends an email with a verification link to the user using the SendGrid API.
- The verification link expires after 2 minutes.


### Email Service Credentials

The email service credentials (e.g., SendGrid API key and email sender address) are stored securely in **AWS Secrets Manager** and encrypted using a **custom KMS key**.

- The Lambda function retrieves these credentials from Secrets Manager on execution.
  
### Setup Instructions

1. Clone the repository
2. Run `npm install` to install all required packages
3. Zip the whole directory and move it to the required path in terraform directory
