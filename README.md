# 📧 Email Verification Lambda

Node.js-based Lambda that sends verification emails for user sign-up via SendGrid, triggered by SNS messages.

## 📚 Table of Contents

- ⚙️ [Functionality](#functionality)
- 🔄 [Workflow](#workflow)
- 🔐 [Security & Secrets](#security--secrets)
- 🚀 [Deployment](#deployment)
- ⚙️ [Setup Instructions](#setup-instructions)
- 🔗 [Cross-Repository Integrations](#cross-repository-integrations)
- ✅ [Best Practices](#best-practices)

## ⚙️ Functionality

- SNS-triggered Lambda function
- Sends user verification emails with expiring links via SendGrid
- Updates user verification status in RDS

## 🔄 Workflow

```
webapp → SNS → Lambda → SendGrid → User
                             ↳ RDS Update
```

1. User registers in [webapp](https://github.com/MaliniSankaran/webapp)
2. SNS message sent with user info + verification link
3. Lambda consumes message, sends email
4. User clicks link within 2 minutes
5. RDS status is updated (verified)

## 🔐 Security & Secrets

- SendGrid API key and sender email stored in AWS Secrets Manager
- Encrypted using a custom KMS key
- Lambda retrieves these credentials securely at runtime (no hardcoded credentials)

## 🚀 Deployment

- Node.js dependencies via `npm install`
- Lambda packaged (zipped) and deployed using Terraform scripts from [tf-aws-infra](https://github.com/MaliniSankaran/tf-aws-infra)

## ⚙️ Setup Instructions

### Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/): Configure with the necessary credentials to access AWS services.
- [Terraform](https://www.terraform.io/): Used to provision infrastructure including Lambda resources.

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone git@github.com:MaliniSankaran/serverless.git
   cd serverless
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Zip the project**
   ```bash
   zip -r lambda.zip .
   ```

4. **Move zip to Terraform path**
   - Place `lambda.zip` in the appropriate directory where Terraform expects the deployment artifact (within the `tf-aws-infra` project).

## 🔗 Cross-Repository Integrations

- SNS Publisher: [webapp](https://github.com/MaliniSankaran/webapp)
- Infrastructure Provisioner: [tf-aws-infra](https://github.com/MaliniSankaran/tf-aws-infra)

## ✅ Best Practices

- No secrets in repo
- All infrastructure and code maintained as IaC
- All updates via pull requests
