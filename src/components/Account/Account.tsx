import { Box, Button } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Account() {
    const { data: session } = useSession();

    const handleClick = () => {
        session?.user ? signOut() : signIn("google");
    };

    return (
        <Box>
            <Button onClick={handleClick}>
                {session?.user ? "Sign Out" : "Sign In"}
            </Button>
        </Box>
    );
}
