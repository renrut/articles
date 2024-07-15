## What?
This is a small example for CDK deployment for using AWS firehose to write JSON data from Kinesis to S3 as parquet. It contains a lambda that generates new json data and puts it on the Kinesis stream and an example of a firehose transform lambda to unnest the json into a flattened parquet format.

## Get Started

### Prerequisites
Make sure you have an AWS account

Make sure you have a newer version of node.js installed. I used version 20 for this.

If you haven't already, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

Run `aws configure` to setup your aws environment configuration. You will also need to set up [credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

Globally install cdk with `npm install -g aws-cdk`

### Deploy to CDK

Navigate to the `/app` directory. Install dependencies with `npm install`

Run `npm run build` to compile the typescript.

Create a CDK bootstrap by running `cdk bootstrap` You only need to run this once.

Wait for the bootstrap stack to deploy.

Finally, deploy the code to CDK using `cdk deploy` it will prompt you to approve permission changes. Review them and select `y` to continue.

## Making Changes

### CDK Changes
To make changes to the cdk, modify the constructs in [Appstack](Appstack.ts) or `/lib/stacks`, then re-run `npm run build` before calling `cdk deploy` again.

### Lambda Code Changes

To make changes to the lambda flattener code, navigate to the `/lambda` directory and make any necessary changes. You can then run `cdk deploy --hotswap` to update the lambda code.

## Cleaning Up

Don't leave this up and get charged!

To clean up, head to cloudformation and delete the stack or call `aws cloudformation delete-stack --stack-name FirehoseStack`. 
You may need to navigate to s3 and kinesis and manually delete the bucket and stream as well.

`aws kinesis list-streams` to list the stream name
`aws kinesis delete-stream --stream-name FirehoseStack-DataStream<id>`

`aws s3 ls`
`aws s3 rm s3://firehosestack-destinationbucket<id> --recursive` to empty the bucket
`aws s3api delete-bucket --bucket firehosestack-destinationbucket<id> --region us-west-2`

## Useful commands

The `cdk.json` file tells the CDK Toolkit how to execute your app.


* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
