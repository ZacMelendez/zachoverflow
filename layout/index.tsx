import { Box, BoxProps } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";

const Sidebar = ({ children }: BoxProps) => {
    return (
        <Box
            sx={{
                gridArea: "sidebar",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                top: 0,
                left: 0,
            }}
        >
            {children}
        </Box>
    );
};

const Main = ({ paid = false, ...rest }: BoxProps & { paid?: boolean }) => {
    const router = useRouter();
    const isNewsletter = router.pathname.includes("newsletter");
    const isSettings = router.pathname.includes("settings");

    const children = () => {
        if (isSettings) return rest.children;
        return rest.children;
    };

    return (
        <Box
            sx={{
                gridArea: "main",
                minHeight: "100vh",
                position: "relative",
            }}
            {...rest}
        >
            {children()}
        </Box>
    );
};

Main.defaultProps = {
    component: "main",
};

const Body = ({ children, ...rest }: BoxProps) => {
    const [openUserDialog, setOpenUserDialog] = useState(false);

    return (
        <Box py={3} px={6} {...rest}>
            {children}
        </Box>
    );
};

const Paywall = ({}) => {};

const Layout = ({ children }: BoxProps) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: `${"250px"} 3fr`,
                gridTemplateAreas: `"sidebar main main main"`,
            }}
        >
            {children}
        </Box>
    );
};

const Layouts = {
    Layout,
    Sidebar,
    Main,
    Body,
};

export default Layouts;
