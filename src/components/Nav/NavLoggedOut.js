import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { navWithTheme } from '../styles/styles';
import HomeIcon from '@material-ui/icons/Home';
import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#fff",
        color: "#000",
        alignItems: "center",
        boxShadow: "none"
    },
    content: {
        ...navWithTheme(theme)
    },
    navleft: {
        flex: "1",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    navright: {
        flex: "1",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        "& *": {
            marginLeft: "4px"
        }
    },
    titlecard: {
        width: "100%",
        ...theme.typography.h5
    },
    titlecardbar: props => ({
        width: `${props.width}px`,
        height: "2px",
        background: "#000",
        borderRadius: "1px",
        marginTop: "2px"
    }),
}));

function NavLoggedOut(props) {
    const classes = useStyles(props);

    const home = () => {
        props.history.push("/");
    }

    const login = () => {
        props.history.push("/login");
    }

    const signup = () => {
        props.history.push("/register");
    }

    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar className={classes.content}>
                <div className={classes.navleft}>
                    {
                        props.displayLogo ? (
                                <IconButton onClick={home}
                                >
                                    <HomeIcon/>
                                </IconButton>

                        ) : (null)
                    }
                </div>
                <div className={classes.navright}>
                    {
                        props.displayLogin ? (
                            <Button onClick={login} disableElevation={true}
                            >
                                login
                            </Button>
                        ) : (
                            null
                        )
                    }

                    {
                        props.displayLogin ? (
                            <Button variant="outlined"
                                    color="primary"
                                    onClick={signup}
                            >
                                sign up
                            </Button>
                        ) : (
                            null
                        )
                    }

                </div>
            </Toolbar>
        </AppBar>
    );
}

export default NavLoggedOut;