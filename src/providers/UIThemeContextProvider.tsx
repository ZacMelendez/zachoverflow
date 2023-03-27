import React, { useEffect, useState } from "react";
import UIThemeContext from "../context/UIThemeContext";

function UIThemeContextProvider({ children }: { children: any }) {
    const [theme, setTheme] = useState<string>("light");
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!window) return;
        if (
            (window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches) ||
            window.localStorage.getItem("theme") === "dark"
        ) {
            setTheme("dark");
        }

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (event) => {
                setTheme(event.matches ? "dark" : "light");
                window.localStorage.setItem("theme", theme);
            });
    }, []);

    useEffect(() => {
        if (!document) return;
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <UIThemeContext.Provider
            value={{
                theme,
                setTheme,
                menuOpen,
                setMenuOpen,
            }}
        >
            {children}
        </UIThemeContext.Provider>
    );
}

export default UIThemeContextProvider;
