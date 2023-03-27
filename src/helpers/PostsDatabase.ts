import {
    DynamoDBClient,
    GetItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import fetch from "node-fetch";
import { BlogEntry } from "../types";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const clientOptions = {
    region: process.env.NODE_ENV !== "production" ? "localhost" : "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET || "",
    },
    ...(process.env.NODE_ENV !== "production" && {
        endpoint: "http://172.18.0.2:8000",
    }),
};

const client = new DynamoDBClient(clientOptions);

const imageCreator = async ({ title, id }: { title: string; id: string }) => {
    await fetch(
        "https://km9zsdl2nk.execute-api.us-east-1.amazonaws.com/Prod/api",
        {
            method: "POST",
            body: JSON.stringify({
                id,
                title,
            }),
        }
    );
};

export const getPosts = async () => {
    const Items = await client.send(
        new ScanCommand({
            TableName: process.env.POST_TABLE,
        })
    );

    const posts = Items?.Items?.map((item) => unmarshall(item));
    console.log(posts);
    return posts as BlogEntry[];
};

export const getPost = async (url: string) => {
    const { Item } = await client.send(
        new GetItemCommand({
            TableName: process.env.POST_TABLE,
            Key: {
                url: { S: url },
            },
        })
    );
    return Item ? unmarshall(Item) : {};
};

export const deletePost = async (url: string) => {
    const result = await fetch(
        process.env.NODE_ENV == "production"
            ? `https://crgdo5agb5.execute-api.us-east-1.amazonaws.com/Prod/posts`
            : "http://localhost:3001/posts",
        {
            method: "DELETE",
            body: JSON.stringify({
                url,
            }),
        }
    );

    const content = (await result.json()) as any;

    const posts = content.content as BlogEntry[];

    return posts;
};
