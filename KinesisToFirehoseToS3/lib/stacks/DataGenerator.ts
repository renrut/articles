
import { 
    aws_kinesis as kinesis,
    aws_lambda as lambda,
    aws_iam as iam,
    aws_events as events,
    aws_events_targets as targets, // Import the 'aws_events_targets' module
    Stack,
    Duration
} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export interface DataGeneratorConstructProps {
    kinesisStreamInput: kinesis.IStream;
}

export class DataGeneratorConstruct extends Construct {

    constructor(scope: Construct, id: string, props: DataGeneratorConstructProps) {
        super(scope, id);
        
        // create the lambda function to generate data to send to the kinesis stream
        const lambdaFunction = new lambda.Function(this, 'DataGeneratorFunction', {
            runtime: lambda.Runtime.PYTHON_3_12,
            description: 'Generates random data to send to the kinesis stream. Created on ' + new Date().toISOString(),
            handler: 'generator.handle',
            code: lambda.Code.fromAsset('lambda'),
            environment: {
                STREAM_NAME: props.kinesisStreamInput.streamName
            }
        });

        // grant the lambda function the ability to write to the kinesis stream
        props.kinesisStreamInput.grantWrite(lambdaFunction.grantPrincipal);


        //schedule the lambda function to run every minute
        const rule = new events.Rule(this, 'DataGenerator', {
            schedule: events.Schedule.rate(Duration.minutes(1)),
        });

        //add permission to the lambda function to allow the rule to invoke it
        lambdaFunction.addPermission('InvokePermission', {
            principal: new iam.ServicePrincipal('events.amazonaws.com'),
            sourceArn: rule.ruleArn
        });

        //add the lambda function as a target of the rule
        rule.addTarget(new targets.LambdaFunction(lambdaFunction));
    }


}