import { Box, Loader, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Router } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "../src/components";
import CommentsContextProvider from "../src/providers/CommentsContextProvider";
import PostsContextProvider from "../src/providers/PostsContextProvider";
import UIThemeContextProvider from "../src/providers/UIThemeContextProvider";
import "../styles/globals.scss";
import styles from "../styles/Home.module.scss";

export default function App({ Component, pageProps }: AppProps) {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const start = () => {
            setLoading(true);
        };
        const end = () => {
            setLoading(false);
        };
        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);
        return () => {
            Router.events.off("routeChangeStart", start);
            Router.events.off("routeChangeComplete", end);
            Router.events.off("routeChangeError", end);
        };
    }, []);

    return (
        <SessionProvider>
            <MantineProvider
                theme={{
                    colors: {
                        bg: [
                            "#7A7A7A",
                            "#6F6F6F",
                            "#656565",
                            "#5C5C5C",
                            "#535353",
                            "#4C4C4C",
                            "#454545",
                            "#3E3E3E",
                            "#383838",
                            "#323232",
                        ],
                        textPrimary: [
                            "#F7F4F1",
                            "#E9DDD2",
                            "#E0C7B3",
                            "#DEB391",
                            "#E2A06C",
                            "#EE8E41",
                            "#D88039",
                            "#BC7439",
                            "#9E693F",
                            "#856041",
                        ],
                        textSecondary: [
                            "#FBFBFB",
                            "#E5E5E3",
                            "#CFCFCC",
                            "#BABAB7",
                            "#A8A8A5",
                            "#979794",
                            "#888885",
                            "#7A7A78",
                        ],
                    },
                    primaryColor: "textPrimary",
                }}
            >
                <NotificationsProvider>
                    <UIThemeContextProvider>
                        <PostsContextProvider>
                            <CommentsContextProvider>
                                <>
                                    {loading ? (
                                        <main className={styles.main}>
                                            <Header />
                                            <Box
                                                style={{
                                                    position: "fixed",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform:
                                                        "translate(-50%, -50%)",
                                                }}
                                            >
                                                <Loader
                                                    variant="bars"
                                                    color="textPrimary"
                                                    size={100}
                                                />
                                            </Box>
                                        </main>
                                    ) : (
                                        <Component {...pageProps} />
                                    )}
                                </>
                            </CommentsContextProvider>
                        </PostsContextProvider>
                    </UIThemeContextProvider>
                </NotificationsProvider>
            </MantineProvider>
        </SessionProvider>
    );
}
