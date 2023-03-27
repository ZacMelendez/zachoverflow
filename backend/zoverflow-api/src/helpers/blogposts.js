const {
    DeleteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    ScanCommand,
    UpdateItemCommand
} = require('@aws-sdk/client-dynamodb');
const moment = require('moment');
const fetch = require('node-fetch');
const uuid = require('uuid');
require('dotenv').config()


const itemParser = (object) => {
    let obj = {};
    for (const property in object) {
        obj = {
            ...obj,
            [property]: object[property][Object.keys(object[property])[0]]
        };
    }
    return {
        ...obj,
        ...(obj['images'] && { images: JSON.parse(obj['images']) })
    };
};

const imageCreator = async ({ title, id }) => {
    await fetch(
        'https://km9zsdl2nk.execute-api.us-east-1.amazonaws.com/Prod/api',
        {
            method: 'POST',
            body: JSON.stringify({
                id,
                title
            })
        }
    );
};

const clientOptions = {
    region: process.env.NODE_ENV !== 'production' ? 'localhost' : 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET || ''
    },
    ...(process.env.NODE_ENV !== 'production' && {
        endpoint: 'http://172.18.0.2:8000'
    })
};

const client = new DynamoDBClient(clientOptions);

exports.getPost = async (url) => {
    const { Item } = await client.send(
        new GetItemCommand({
            TableName: process.env.POST_TABLE,
            Key: {
                url: { S: url }
            }
        })
    );
    return itemParser(Item);
};

exports.getPosts = async () => {
    const Items = await client.send(
        new ScanCommand({
            TableName: process.env.POST_TABLE
        })
    );
    return Items?.Items?.map((item) => itemParser(item));
};

exports.updateComments = async (url, comments) => {
    const Item = await client.send(
        new UpdateItemCommand({
            TableName: process.env.POST_TABLE,
            Key: {
                url: { S: url }
            },
            UpdateExpression: 'set comments = :s',
            ExpressionAttributeValues: {
                ':s': { S: comments }
            }
        })
    );
    return Item;
};

exports.updatePost = async (post) => {
    const Item = await client.send(
        new UpdateItemCommand({
            TableName: process.env.POST_TABLE,
            Key: {
                url: { S: post.url }
            },
            UpdateExpression: 'set description = :d, images = :i, content = :c, isDraft = :e',
            ExpressionAttributeValues: {
                ':d': { S: post.description },
                ':i': { S: JSON.stringify(post.images) },
                ':c': { S: post.content },
                ':e': { S: post.isDraft }
            }
        })
    );
    return Item;
};

exports.deletePost = async (url) => {
    await client.send(
        new DeleteItemCommand({
            TableName: process.env.POST_TABLE,
            Key: {
                url: { S: url }
            }
        })
    );
};

exports.putPost = async (blog) => {
    const newItem = {
        id: { S: uuid.v4() },
        title: {
            S: blog.title
        },
        content: {
            S: blog.content
        },
        date: {
            S: moment().toISOString()
        },
        isDraft: {
            BOOL: blog?.isDraft || false
        },
        url: {
            S: blog.url
        },
        images: {
            S: JSON.stringify(blog.images)
        },
        description: {
            S: blog.description
        },
        comments: {
            S: ''
        },
        type: {
            S: blog.type
        }
    };

    await imageCreator({ id: newItem.id.S, title: blog.title });

    await client.send(
        new PutItemCommand({
            TableName: process.env.POST_TABLE || '',
            Item: newItem
        })
    );
    return newItem;
};