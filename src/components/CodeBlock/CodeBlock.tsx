import { useContext, ReactNode } from "react";
import UIThemeContext from "../../context/UIThemeContext";
import { CopyButton, ActionIcon, Tooltip } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons";
import {
    nightOwl as dark,
    duotoneLight as light,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styles from "./CodeBlock.module.scss";

export default function CodeBlock({
    language,
    children,
    props,
}: {
    language: string;
    children: ReactNode | ReactNode[];
    props?: any;
}) {
    const { theme } = useContext(UIThemeContext);

    return (
        <>
            <CopyButton value={String(children).replace(/\n$/, "")}>
                {({ copied, copy }) => (
                    <Tooltip
                        label={copied ? "Copied" : "Copy"}
                        withArrow
                        position="right"
                    >
                        <ActionIcon
                            color={copied ? "teal" : "gray"}
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
                language={language}
                PreTag="div"
                {...props}
            >
                {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
        </>
    );
}
