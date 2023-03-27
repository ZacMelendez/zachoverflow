import moment from "moment";
import Head from "next/head";
import { useContext, useEffect } from "react";
import { Header } from "../../src/components";
import { PostList } from "../../src/containers";
import PostsContext from "../../src/context/PostsContext";
import { getPosts } from "../../src/helpers/PostsDatabase";
import { BlogEntry } from "../../src/types";
import styles from "../../styles/Home.module.scss";

export default function CreatePage({ data }: { data: BlogEntry[] }) {
    const { setPosts } = useContext(PostsContext);

    useEffect(() => {
        if (!data) return;
        setPosts(
            data.sort(
                (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
            )
        );
    }, [data]);

    return (
        <>
            <Head>
                <title>zachOverflow - Dev Blog</title>
                <meta
                    name="description"
                    content="Zachary Melendez' Blog Site"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Header />
                <div className={styles.body}>
                    <PostList />
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
    const data = (await getPosts()).filter((blog) => !blog.isDraft);
    return {
        props: {
            data,
        },
    };
}
