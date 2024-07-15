import {
  aws_kinesis as kinesis,
  aws_s3 as s3, 
  aws_iam as iam,
  Stack,
  StackProps
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FirehoseConstruct } from './stacks/Firehose';
import { DataGeneratorConstruct } from './stacks/DataGenerator';
import exp = require('constants');

export interface AppStackProps extends StackProps {
  account: string | undefined;
  region: string | undefined;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: AppStackProps) {

    if (!props?.account || !props?.region) {
      throw new Error('Account ID and Region is required. Please run aws configure to set your account ID and region');
    }

    super(scope, id, props);
    
    // create a kinesis data stream. We'll use this to send data to the firehose delivery stream.
    const stream = new kinesis.Stream(this, 'DataStream', {
      shardCount: 1,
    });

    // create the data generator construct to generate random data to send to the kinesis stream
    new DataGeneratorConstruct(this, 'DataGenerator', {
      kinesisStreamInput: stream
    });

    // create a destination s3 bucket. We'll go ahead and enable encryption since it's a best practice.
    const bucket = new s3.Bucket(this, 'DestinationBucket', {
      encryption: s3.BucketEncryption.KMS,
    });

    // add the bucket policy to allow firehose to write to the bucket
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [`${bucket.bucketArn}/*`],
      principals: [new iam.ServicePrincipal('firehose.amazonaws.com')]
  }));

    const firehoseConstruct = new FirehoseConstruct(this, 'FirehoseConstruct', {
      bucket: bucket,
      account: props.account,
      region: props.region,
      inputStream: stream
    });
    
  }
}
