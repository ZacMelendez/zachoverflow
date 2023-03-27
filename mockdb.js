const AWS = require('aws-sdk');
const { createServer } = require('dynamodb-admin');

const clientConfig = {
    region: 'us-fake-1',
    endpoint: 'http://localhost:8000',
    credentials: new AWS.Credentials({
        accessKeyId: 'fake',
        secretAccessKey: 'fake'
    })
};

const dynamodb = new AWS.DynamoDB(clientConfig);

const dynClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

const app = createServer(dynamodb, dynClient);

const host = 'localhost';
const port = 8001;
const server = app.listen(port, host);
server.on('listening', () => {
    const address = server.address();
    console.log(`  listening on http://${address.address}:${address.port}`);
});
