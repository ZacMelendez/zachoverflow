import { useState, useMemo, useContext } from "react";
import RichTextEditor from "./mantineRTE";
import { useSession } from "next-auth/react";
import { Box, Button } from "@mantine/core";
import { BlogEntry, CommentEntry } from "../../types";
import styles from "./CommentEditor.module.scss";
import CommentsContext from "../../context/CommentsContext";

export default function CommentEditor({
    blog,
    replyTo,
}: {
    blog: BlogEntry;
    replyTo?: CommentEntry;
}) {
    const { data: session } = useSession();
    const [value, setValue] = useState("");

    const { addComment } = useContext(CommentsContext);

    const handleSubmit = async () => {
        try {
            const reply = await fetch("/api/comments", {
                method: "PUT",
                body: JSON.stringify({
                    author: session?.user?.name,
                    authorId: session?.user?.id,
                    content: value,
                    blog: blog,
                    replyTo: replyTo?.id || undefined,
                }),
            });
            const response = (await reply.json()) as CommentEntry;

            addComment(response);
            setValue("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box className={styles.editor}>
            <RichTextEditor
                id="rte"
                value={value}
                onChange={setValue}
                placeholder="Add a comment"
                className={styles.rte}
                controls={[
                    ["bold", "italic", "underline", "clean"],
                    ["code", "codeBlock"],
                ]}
            />
            <Box className={styles.actions}>
                <Button className={styles.button} onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}
