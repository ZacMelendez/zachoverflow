import { Box, Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useContext, useState } from "react";
import PostsContext from "../../context/PostsContext";
import { BlogEntry } from "../../types";
import styles from "./PostMenu.module.scss";
import { useRouter } from "next/router";

export default function PostMenu({ blog }: { blog: BlogEntry }) {
    const router = useRouter();
    const { removePost, setActiveDraft } = useContext(PostsContext);

    const [opened, setOpened] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");

    const editPost = () => {
        setActiveDraft({
            ...blog,
            editing: true,
            images: blog.images,
        });
        router.push("/create");
    };

    const deletePost = async () => {
        try {
            await fetch(
                process.env.NODE_ENV == "production"
                    ? `https://crgdo5agb5.execute-api.us-east-1.amazonaws.com/Prod/posts`
                    : "http://localhost:3001/posts",
                {
                    method: "DELETE",
                    body: JSON.stringify({
                        url: blog.url,
                    }),
                }
            );

            removePost(blog);

            showNotification({
                title: "Post Deletion Success",
                message: "Your post was successfully deleted",
            });
            router.push("/posts");
        } catch (err) {
            showNotification({
                title: "Post Deletion Error",
                message:
                    "There was an error deleting your post. Please check the console.",
            });
        }
    };

    return (
        <Box className={styles.actions}>
            <Button onClick={editPost} color={"primart"}>
                Edit
            </Button>
            <Button
                onClick={() => {
                    setOpened(true);
                }}
                color={"red"}
            >
                Delete
            </Button>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Delete Post?"
            >
                <Text>
                    If you would like to delete the post, please enter the name
                    of the blog: <strong>{blog.title}</strong>
                </Text>

                <TextInput
                    placeholder={blog.title}
                    value={input}
                    onChange={(event) => setInput(event.currentTarget.value)}
                />
                <Group mt="xl" position="apart">
                    <Button variant="outline" onClick={() => setOpened(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={input !== blog.title}
                        color={"red"}
                        onClick={deletePost}
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>
        </Box>
    );
}
