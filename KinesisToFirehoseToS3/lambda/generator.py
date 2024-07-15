import boto3
import os
import json
import math
import random

MEASURES = ['measure_0','measure_1','measure_2','measure_3']
CUSTOMERS = [
    {
        "id": '0',
        "zip": "55111"
    }, {
        "id": '1',
        "zip": "59103"
    },{
        "id": '2',
        "zip": "80808"
    },{
        "id": '3',
        "zip": "19022"
    },{
        "id": '4',
        "zip": "49494"
    }
]

# generate json data and write it to kinesis stream
def handle(event, context):
    payload = generate_random_data()
    # get streamname from env STREAM_NAME
    streamName = os.environ['STREAM_NAME']
    kinesis = boto3.client('kinesis')
    kinesis.put_record(
        StreamName=streamName,
        Data=json.dumps(payload),
        PartitionKey='1'
    )
                           

# generate random data
def generate_random_data():
    customer = CUSTOMERS[math.floor(random.random() * len(CUSTOMERS))]
    return {
        'measure_name': MEASURES[math.floor(random.random() * len(MEASURES))],
        'measure_value': random.random() * 100.0,
        'metadata': {
            'customer_id': customer['id'],
            'zip_code': customer['zip'],
            'something_else': 'value'
        }
    }
