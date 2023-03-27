import {
    ActionIcon,
    Box,
    CopyButton,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import { IconArrowLeft, IconCheck, IconCopy } from "@tabler/icons";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    duotoneLight as light,
    nightOwl as dark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import unwrapImages from "remark-unwrap-images";
import { PostMenu } from "../../components";
import UIThemeContext from "../../context/UIThemeContext";
import { BlogEntry } from "../../types";
import styles from "./BlogPost.module.scss";

export default function BlogPost({ blog }: { blog: BlogEntry }) {
    const { data: session } = useSession();

    const { theme } = useContext(UIThemeContext);

    const tableOfContents = blog.content.match(/^##.*\n$/gm);

    return (
        <Box className={styles.container}>
            <Box className={styles.postHead}>
                <Link href="/posts" className={styles.back}>
                    <IconArrowLeft size={24} />
                    <Text>back to all posts</Text>
                </Link>
                {session?.user?.email === "zacmelendez@gmail.com" && (
                    <PostMenu blog={blog} />
                )}
            </Box>
            <Box className={styles.head}>
                <Title order={1} className={styles.title}>
                    {blog.title}
                </Title>
                <Text className={styles.date}>
                    {moment(blog.date).format("MMMM DD, YYYY")}
                </Text>
            </Box>
            <article>
                <ReactMarkdown
                    // children={content}
                    className={styles.markdown}
                    remarkPlugins={[unwrapImages]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                                className || ""
                            );
                            return !inline && match ? (
                                <Box className={styles.codeDiv}>
                                    <CopyButton
                                        value={String(children).replace(
                                            /\n$/,
                                            ""
                                        )}
                                    >
                                        {({ copied, copy }) => (
                                            <Tooltip
                                                label={
                                                    copied ? "Copied" : "Copy"
                                                }
                                                withArrow
                                                position="right"
                                                color={
                                                    theme !== "dark"
                                                        ? "bg.7"
                                                        : "textSecondary.7"
                                                }
                                            >
                                                <ActionIcon
                                                    color={
                                                        copied ? "teal" : "gray"
                                                    }
                                                    onClick={copy}
                                                    className={styles.button}
                                                >
                                                    {copied ? (
                                                        <IconCheck size={16} />
                                                    ) : (
                                                        <IconCopy size={16} />
                                                    )}
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                    <SyntaxHighlighter
                                        // @ts-ignore
                                        style={theme !== "dark" ? dark : light}
                                        language={match[1]}
                                        PreTag="div"
                                        className={styles.codeBlock}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                </Box>
                            ) : (
                                <code className={styles.codeLine} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        h2({ node, className, children, ...props }) {
                            return (
                                <h2
                                    id={String(children)
                                        .replace(
                                            /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
                                            ""
                                        )
                                        .trim()
                                        .replace(/\s+/g, "-")
                                        .toLowerCase()}
                                >
                                    {children}
                                </h2>
                            );
                        },
                        img({ node, className, children, ...props }) {
                            return (
                                <Box
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={
                                            (node?.properties?.src as string) ||
                                            ""
                                        }
                                        alt={
                                            (node?.properties?.alt as string) ||
                                            ""
                                        }
                                        style={{
                                            maxHeight: "500px",
                                            maxWidth: "70%",
                                        }}
                                        className={styles.image}
                                        {...props}
                                    />
                                </Box>
                            );
                        },
                    }}
                >
                    {blog.content}
                </ReactMarkdown>
            </article>
            {tableOfContents?.length && tableOfContents?.length >= 0 && (
                <Box className={styles.contentsTable}>
                    {tableOfContents?.map((id) => {
                        const text = id
                            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                            .trim()
                            .replace(/\s+/g, "-")
                            .toLowerCase();
                        return (
                            <Link href={`#${text}`} key={text}>
                                <Text>
                                    {id.replace("##", "").replace("\n", "")}
                                </Text>
                            </Link>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}
