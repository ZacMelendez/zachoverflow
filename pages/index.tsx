import { NextSeo } from "next-seo";
import React from "react";
import { Header } from "../src/components";
import { About } from "../src/containers/";
import styles from "../styles/Home.module.scss";

export default function Home() {
    return (
        <>
            <NextSeo
                title="zachOverflow - Dev Blog"
                description="Welcome to my Dev Blog, where I am looking to document my learnings along the way to becoming a Cloud/IoT Engineer!"
                defaultTitle="About"
                openGraph={{
                    url: "https://zmelen.dev/",
                    title: "zachOverflow - Dev Blog",
                    description:
                        "Welcome to my Dev Blog, where I am looking to document my learnings along the way to becoming a Cloud/IoT Engineer!",
                    images: [
                        {
                            url: "https://zachoverflow.s3.amazonaws.com/images/splash.png",
                        },
                    ],
                    site_name: "zachOverflow",
                }}
            />
            <main className={styles.main}>
                <Header />
                <div className={styles.body}>
                    <About />
                </div>
            </main>
        </>
    );
}
