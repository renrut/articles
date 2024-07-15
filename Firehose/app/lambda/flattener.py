import json
import base64

# take in a firehose event record and pull json out and flatten it
def handle(event, context):
    records = []
    for record in event['records']:
        # decode the record
        payload = base64.b64decode(record['data'])
        # load the json
        data = json.loads(payload)
        # flatten the json
        flat = flatten(data)
        # encode the flat json
        flat_payload = json.dumps(flat)
        # encode the flat json
        flat_payload_encoded = base64.b64encode(flat_payload.encode('utf-8'))
        # append the flat json
        records.append( {
            'recordId': record['recordId'],
            'result': 'Ok',
            'data': flat_payload_encoded
        })
    return { 'records': records }

def flatten(data, parent_key='', sep='.'):
    items = {}
    for k, v in data.items():
        new_key = parent_key + sep + k if parent_key else k
        if isinstance(v, dict):
            items.update(flatten(v, new_key, sep=sep).items())
        else:
            items[new_key] = v
    return items
