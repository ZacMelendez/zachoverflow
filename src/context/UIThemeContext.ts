import { createContext, Dispatch, SetStateAction } from "react";

declare global {
    interface UIThemeContextProps {
        setTheme: Dispatch<SetStateAction<string>>;
        theme: string;
        setMenuOpen: Dispatch<SetStateAction<boolean>>;
        menuOpen: boolean;
    }
}

const UIThemeContext = createContext<UIThemeContextProps>({
    setTheme: () => {},
    theme: "light",
    setMenuOpen: () => {},
    menuOpen: false,
});

export default UIThemeContext;
