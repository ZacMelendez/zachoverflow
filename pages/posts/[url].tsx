import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { Header } from "../../src/components";
import { BlogPost } from "../../src/containers";
import { getPost } from "../../src/helpers/PostsDatabase";
import { BlogEntry } from "../../src/types";
import styles from "../../styles/Home.module.scss";

export default function Home({
    blog,
}: // comments,
{
    blog: BlogEntry;
    // comments?: CommentEntry[];
}) {
    // const { setComments } = useContext(CommentsContext);

    // useEffect(() => {
    //     if (!comments) return;
    //     setComments(comments);
    // }, []);

    return (
        <>
            <NextSeo
                title={`${blog.title}`}
                description={`${blog.description}`}
                defaultTitle="zachOverflow - Dev Blog"
                openGraph={{
                    url: `https://zmelen.dev/posts/${blog.url}`,
                    title: `${blog.title}`,
                    description: `${blog.description}`,
                    images: [
                        {
                            url: `https://zachoverflow.s3.amazonaws.com/images/${blog.id}/splash.png`,
                        },
                    ],
                    site_name: "zachOverflow",
                }}
            />
            <main className={styles.main}>
                <Header />
                <div className={styles.body}>
                    <BlogPost blog={blog} />
                    {/* <CommentContainer blog={blog} /> */}
                </div>
            </main>
        </>
    );
}

export async function getServerSideProps(context: any) {
    context.res.setHeader(
        "Cache-Control",
        "public, s-maxxwage=1800, stale-while-revalidate=86400"
    );
    const { params } = context;
    const post = await getPost(params.url);

    return {
        props: {
            blog: post,
            // comments: comments,
        },
    };
}
