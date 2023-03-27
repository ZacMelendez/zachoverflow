import { ActionIcon, Box, Text } from "@mantine/core";
import moment from "moment";
import { CommentEntry } from "../../types";
import styles from "./Comment.module.scss";
import DOMPurify from "dompurify";
import { useContext } from "react";
import CommentsContext from "../../context/CommentsContext";
import { IconTrash } from "@tabler/icons";
import { useSession } from "next-auth/react";

export default function Comment({
    comment,
    ...props
}: {
    comment: CommentEntry;
}) {
    const { removeComment } = useContext(CommentsContext);
    const { data: session } = useSession();

    const handleDelete = () => {
        fetch("/api/comments", {
            method: "DELETE",
            body: JSON.stringify({ id: comment.id }),
        });
        removeComment(comment);
    };

    return (
        <Box className={styles.comment}>
            <Box className={styles.header}>
                <Box>
                    <Text className={styles.author}>{comment.author}</Text>
                    <Text className={styles.date}>
                        {moment(comment.date).format("MMMM DD, YYYY")}
                    </Text>
                </Box>
                {(session?.user?.id === comment.authorId ||
                    session?.user?.email === "zacmelendez@gmail.com") && (
                    <ActionIcon
                        onClick={() => {
                            handleDelete();
                        }}
                        color={"primary"}
                    >
                        <IconTrash size={24} />
                    </ActionIcon>
                )}
            </Box>
            <Text
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(comment.content),
                }}
                className={styles.content}
            />
        </Box>
    );
}
