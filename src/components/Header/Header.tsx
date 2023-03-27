import Link from "next/link";
import styles from "./Header.module.scss";
import classnames from "classnames";
import { ActionIcon, Box, Text } from "@mantine/core";
import ZachOverflow from "../../icons/ZachOverflow";
import React, { useContext, useEffect, useState } from "react";
import UIThemeContext from "../../context/UIThemeContext";
import { IconMoon, IconSunHigh } from "@tabler/icons";
import Hamburger from "./Hamburger";
import { useSession } from "next-auth/react";
import Account from "../Account/Account";

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme, menuOpen, setMenuOpen } = useContext(UIThemeContext);
  const [screenSize, setScreenSize] = useState<number>(1200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenSize(window.innerWidth);
    }
  }, []);

  const updateMedia = () => {
    setScreenSize(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className={styles.header}>
      {screenSize > 576 ? (
        <Box className={styles.div}>
          <Box className={styles.title}>
            <ZachOverflow primary={theme === "dark" ? "#e5e5e3" : "#454545"} />
            <Text>zach</Text>
            <Text style={{ fontWeight: 500 }}>overflow</Text>
          </Box>
          <ul className={styles.nav}>
            <li>
              <Link className="nav-link" href="/">
                About
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/posts">
                Posts
              </Link>
            </li>
            {session?.user?.email === "zacmelendez@gmail.com" && (
              <li>
                <Link className="nav-link" href="/create">
                  Create
                </Link>
              </li>
            )}
            <li>
              <Account />
            </li>
            <li>
              <ActionIcon
                sx={{
                  color: `${theme === "dark" ? "#e5e5e3" : "#454545"}`,
                }}
                variant="transparent"
                onClick={handleClick}
              >
                {theme === "dark" ? (
                  <IconSunHigh size={24} />
                ) : (
                  <IconMoon size={24} />
                )}
              </ActionIcon>
            </li>
          </ul>
        </Box>
      ) : (
        <>
          <Box className={styles.mobile}>
            <Box className={styles.title}>
              <ZachOverflow
                primary={theme === "dark" ? "#e5e5e3" : "#454545"}
              />
              <Text>zach</Text>
              <Text style={{ fontWeight: 500 }}>overflow</Text>
            </Box>
            <Hamburger />
          </Box>
          <ul className={classnames(styles.nav, menuOpen && styles.open)}>
            <li>
              <Link
                onClick={() => setMenuOpen(!menuOpen)}
                className="nav-link"
                href="/"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenuOpen(!menuOpen)}
                className="nav-link"
                href="/posts"
              >
                Posts
              </Link>
            </li>
            <li>
              <Account />
            </li>
            {session?.user?.email === "zacmelendez@gmail.com" && (
              <li>
                <Link
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="nav-link"
                  href="/create"
                >
                  Create
                </Link>
              </li>
            )}
            <li>
              <ActionIcon
                sx={{
                  color: `${theme === "dark" ? "#e5e5e3" : "#454545"}`,
                }}
                variant="transparent"
                onClick={handleClick}
              >
                {theme === "dark" ? (
                  <IconSunHigh size={24} />
                ) : (
                  <IconMoon size={24} />
                )}
              </ActionIcon>
            </li>
          </ul>
        </>
      )}
    </header>
  );
}
