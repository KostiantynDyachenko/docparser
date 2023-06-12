const rootContainerWithTheme = (theme) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    [theme.breakpoints.up("xl")]: {
        maxWidth: theme.breakpoints.values.xl
    }
});

const rootContainerFullWithTheme = (theme) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden"
});

const navWithTheme = (theme) => ({
    width: "100%",
    flex: "0 0 64px",
    boxSizing: "border-box",
    padding: "0 32px",
    [theme.breakpoints.up("lg")]: {
        maxWidth: theme.breakpoints.values.lg
    }
});

const navFullWithTheme = (theme) => ({
    width: "100%",
    flex: "0 0 64px",
    boxSizing: "border-box",
    padding: "0 32px"
});

const modalWithTheme = (theme) => ({
    width: "100%",
    margin: theme.spacing(0, 3),
    maxHeight: "calc(100% - 128px)",
    boxSizing: "border-box",
    [theme.breakpoints.up("lg")]: {
        maxWidth: theme.breakpoints.values.lg
    }
});

export { rootContainerWithTheme, rootContainerFullWithTheme, navWithTheme, navFullWithTheme, modalWithTheme };
