const rootContainerStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative"
}

const navContainerStyle = {
    width: "100%",
    flex: "0 0 50px"
}

const contentContainerStyle = {
    width: "100%",
    flex: "0 0 calc(100% - 50px)"
}

export { rootContainerStyle, navContainerStyle, contentContainerStyle };