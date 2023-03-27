import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { deleteComment, putComment } from "../../src/helpers/CommentDatabase";
// import { updateComments } from "../../src/helpers/PostsDatabase";
import { BlogEntry } from "../../src/types";

import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) return res.status(401).json({ error: "unauthorized" });

    try {
        switch (req.method) {
            case "PUT":
                const data = JSON.parse(req.body);

                const {
                    content,
                    blog,
                    author,
                    authorId,
                    replyTo,
                }: {
                    content: string;
                    blog: BlogEntry;
                    author: string;
                    authorId: string;
                    replyTo: string;
                } = data;

                const putCommentInput = {
                    content,
                    blog,
                    author,
                    authorId,
                    replyTo,
                };

                const result = await putComment(putCommentInput);
                // await updateComments(
                //     blog.url,
                //     [...blog.comments.split(" "), result.id].join(" ")
                // );

                return res.status(201).json(result);
            case "DELETE":
                return res
                    .status(201)
                    .json(await deleteComment(JSON.parse(req.body).id));
            default:
                return res.status(400).json({ body: "invalid request" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: JSON.stringify(err) });
    }
}
