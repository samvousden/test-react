# AWS Lambda Deployment Guide

Deploy your Flask Ride the Bus API to AWS Lambda using AWS SAM (Serverless Application Model).

## Prerequisites

1. **AWS Account** - Create one at https://aws.amazon.com
2. **AWS CLI** - https://aws.amazon.com/cli/
3. **AWS SAM CLI** - https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
4. **Docker** - Required for `sam build` (Windows: use WSL2 or Docker Desktop)

### Install SAM CLI (Windows)

```bash
# Using Chocolatey
choco install aws-sam-cli

# Or download installer from:
# https://github.com/aws/aws-sam-cli/releases
```

## Step 1: Configure AWS Credentials

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID** - Get from AWS IAM console
- **AWS Secret Access Key** - Get from AWS IAM console  
- **Default region** - e.g., `us-east-1`
- **Default output format** - Leave blank or use `json`

## Step 2: Build the SAM Application

Navigate to project root and run:

```bash
sam build
```

This compiles your application and dependencies. Output goes to `.aws-sam/build/`.

**Note**: First build may take several minutes as it downloads/compiles dependencies (especially TensorFlow).

## Step 3: Deploy to Lambda

### First-time deployment (guided):

```bash
sam deploy --guided
```

You'll be prompted for:

```
Stack Name [sam-app]: ride-the-bus-api
Region [us-east-1]: <your-region>
Confirm changes before deploy [y/N]: y
Allow SAM CLI IAM role creation [Y/n]: Y
Save parameters to samconfig.toml [Y/n]: Y
```

### Subsequent deployments:

```bash
sam deploy
```

Uses saved configuration from `samconfig.toml`.

## Step 4: Get Your API Endpoint

After successful deployment, you'll see output like:

```
Outputs:
---------------------------------------------------------------------------
Key                 Value
---------------------------------------------------------------------------
ApiEndpoint         https://abcd1234.execute-api.us-east-1.amazonaws.com/prod
FunctionArn         arn:aws:lambda:us-east-1:123456789:function:ride-the-bus-api
---------------------------------------------------------------------------
```

**Save the `ApiEndpoint` - you'll need it for the frontend!**

## Step 5: Update Frontend Configuration

### Update .env.production

Edit `.env.production` in project root:

```env
VITE_API_BASE=https://abcd1234.execute-api.us-east-1.amazonaws.com/prod
```

Replace `abcd1234` and `us-east-1` with your values from Step 4.

### Deploy React to AWS Amplify

1. Push your code to GitHub
2. Go to AWS Amplify console: https://console.aws.amazon.com/amplify
3. Click "New app" → "Host web app"
4. Connect your GitHub repository
5. Add build settings with environment variable:

```yaml
frontend:
  build:
    commands:
      - npm ci
      - npm run build
env:
  variables:
    VITE_API_BASE: 'https://your-api-id.execute-api.region.amazonaws.com/prod'
```

## Testing Your Deployment

### Test Lambda directly:

```bash
curl https://your-api-id.execute-api.region.amazonaws.com/prod/health
```

Expected response:
```json
{"status":"healthy","ai_model_loaded":true}
```

### Test in browser:

Visit your Amplify frontend URL to play the game!

## API Endpoints

All endpoints are available at your Lambda URL:

- `GET /health` - Health check
- `POST /game/new` - Start new game
- `GET /game/state` - Get current state
- `POST /game/move` - Make a move
- `GET /game/ai-move` - Get AI recommendation
- `POST /game/ai-play` - AI makes a move

## Monitoring & Logs

### View Lambda logs:

```bash
sam logs -n RideTheBusApiFunction --stack-name ride-the-bus-api
```

### CloudWatch Dashboard:

1. Go to AWS CloudWatch: https://console.aws.amazon.com/cloudwatch
2. Find "ride-the-bus-api" function
3. View metrics, logs, and errors

## Cost Optimization

### Lambda Pricing Tiers (as of 2026)

- **Free Tier**: 1M requests + 400,000 GB-seconds monthly
- **Beyond**: $0.20 per 1M requests + $0.0000166667 per GB-second

For typical usage (moderate gameplay), monthly cost is minimal or free.

### Cost Reduction Tips

1. **Reduce memory**: Lower MemorySize in `template.yaml` to reduce compute time (min 128MB, default 512MB)
2. **Optimize timeout**: 60s timeout is generous - reduce if needed
3. **Use CloudFront**: Cache static content for your Amplify frontend

## Troubleshooting

### Model loading errors

Error: "Failed to load AI model"

**Solutions**:
1. Verify `.keras` file exists: `ridethebus-react/ridethebus/ridebus_dqn_model.keras`
2. Check Lambda timeout - may need to increase if TensorFlow slow to load
3. Check Lambda memory - TensorFlow needs ~256MB+

### CORS errors in browser

Error: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:
1. Verify Lambda URL in `.env.production` is correct
2. Check `template.yaml` Cors settings
3. Delete `.aws-sam/build` and rebuild: `sam build`

### Deployment timeout

Error: "CloudFormation stack creation timed out"

**Solutions**:
1. Use `sam deploy --no-progressbar --debug` for more info
2. May be first deployment (TensorFlow layer is large)
3. Check AWS CloudFormation console for stuck resources
4. Delete stack and retry: `sam delete`

### Cold start delays

First request after ~15 minutes may take 10-30 seconds (Lambda warm-up).

**Solution**: Use Lambda Provisioned Concurrency (adds cost, but eliminates cold starts).

## Update & Redeploy

To update your code:

1. Edit code locally
2. Rebuild: `sam build`
3. Deploy: `sam deploy`
4. React frontend redeploys automatically via Amplify

## Advanced: Custom Domain

Map your Lambda API to a custom domain (e.g., `api.yoursite.com`):

1. Buy domain and setup in Route 53
2. Request ACM certificate
3. Add to `template.yaml`:

```yaml
  GameApi:
    Type: AWS::Serverless::Api
    Properties:
      Domain:
        DomainName: api.yoursite.com
        CertificateArn: arn:aws:acm:...
```

4. Redeploy: `sam deploy`

## Clean Up

To delete all resources and stop incurring costs:

```bash
sam delete --stack-name ride-the-bus-api
```

Then delete Amplify app from AWS console if desired.

## References

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Lambda Best Practices](https://aws.amazon.com/lambda/best-practices/)
- [Flask on Lambda](https://docs.aws.amazon.com/lambda/latest/dg/python-handler.html)
