import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { navWithTheme, navFullWithTheme } from '../styles/styles';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ChatIcon from '@material-ui/icons/Chat';
import React, {useEffect, useRef, useState} from "react";
import UserDialog from "../Modal/UserDialog";
import { connect } from "react-redux";
import { userLogout } from "../../modules/sessionManager/sessionManager";
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Fade from "@material-ui/core/Fade";
import SvgFLRDAI from "../Svg/SvgFLRDAI";
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from "react-router-dom";

const mapDispatchToProps = (dispatch) => {
    return {
        userLogout: () => dispatch(userLogout())
    }
}

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings,
        loader: state.fileManager.loader
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#fff",
        color: "#000",
        alignItems: "center",
        boxShadow: "none",
        display: "flex"
    },
    content: props => (
        props.full ? ({ ...navFullWithTheme(theme) }) : ({ ...navWithTheme(theme) })
    ),
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
        justifyContent: "flex-end"
    },
    titlecard: {
        width: "100%",
        ...theme.typography.h5
    },
    navDrawer: {
        "& .MuiListItem-gutters": {
            padding: "16px 48px"
        }
    },
    titleName: {
        height: "36px",
        display: "flex",
    },
    titlecardbar: props => ({
        height: "2px",
        background: "#000",
        borderRadius: "1px",
        marginTop: "2px"
    }),
    hambutton: {
        position: "absolute",
        left: "4px",
        top: "calc(50% - 15px)",
        width: "20px",
        height: "20px",
        "& .MuiIconButton-root": {
            padding: "0"
        }
    },
    radar: {
        position: "absolute",
        left: 0,
        top: "calc(50% - 20px)",
        width: "40px",
        height: "40px",
    }
}));

function Nav(props) {
    const classes = useStyles(props);
    const titleName = useRef(null);
    const [width, setWidth] = useState(0);
    const userAnchorEl = useRef(null);
    const [userDialog, setUserDialog] = useState(false);
    const [displayHamBtn, setDisplayHamBtn] = useState(false);
    const [displayHam, setDisplayHam] = useState(false);

    useEffect(() => {
        setWidth(titleName.current?.offsetWidth ?? 0);
    },[]);

    const onUserClick = () => {
        setUserDialog(true);
    }

    const onUserClose = () => {
        setUserDialog(false);
    }

    const titleClick = () => {
        props.history.push("/");
    }

    const onLogout = () => {
        if (props.userLogout) props.userLogout();
        else props.history.push("/");
    }

    const onHamClick = () => {
        setDisplayHamBtn(false);
        setDisplayHam(true);
    }

    const onRadarMouseEnter = () => {
        setDisplayHamBtn(true);
    }

    const onRadarMouseLeave = () => {
        setDisplayHamBtn(false);
    }

    const renderDrawer = (classes) => {
        return (
            <div className={classes.navDrawer} role="presentation" onClick={() => setDisplayHam(false)} onKeyDown={() => setDisplayHam(false)}>
                <Link to="/">
                    <SvgFLRDAI height="24px" width="164px" style={{marginTop: "16px"}}/>
                </Link>

                <List>
                    {
                        // <>
                        //     <ListItem button onClick={() => props.history.push("/portfolio")} divider>
                        //         <ListItemText primary={"All Files"} />
                        //     </ListItem>
                        //     <ListItem button onClick={() => props.history.push(`/portfolio?fuser=${props.userSettings.id}`)} divider={props.userSettings.groups.length > 0}>
                        //         <ListItemText primary={"My Files"} />
                        //     </ListItem>
                        // </>
                    }
                    {
                        props.userSettings.groups.map((group, index) => {
                            return (
                                <ListItem button onClick={() => props.history.push(`/portfolio?fgroup=${group.id}`)} key={group.id} divider={index < props.userSettings.groups.length - 1}>
                                    <ListItemText primary={group.name} />
                                </ListItem>
                            );
                        })
                    }
                </List>
            </div>
        );
    }

    return (
        <>
            <AppBar position="static" className={classes.root}>
                <Toolbar className={classes.content}>
                    <div className={classes.navleft}>
                        <div className={classes.titlecard}>
                            <span className={classes.titleName}
                                  ref={titleName}
                            >
                                <Link to="/">
                                    <SvgFLRDAI height="36px" width="160px"/>
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className={classes.navright}>
                        <IconButton>
                            <HelpOutlineIcon />
                        </IconButton>
                        <IconButton>
                            <ChatIcon />
                        </IconButton>
                        <IconButton>
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton onClick={onUserClick}
                                    ref={userAnchorEl}
                        >
                            <PersonIcon />
                        </IconButton>
                    </div>
                    <div className={classes.radar} onMouseEnter={onRadarMouseEnter} onMouseLeave={onRadarMouseLeave}>
                        <Fade in={displayHamBtn}>
                            <div className={classes.hambutton}>
                                <IconButton onClick={onHamClick}>
                                    <MenuIcon />
                                </IconButton>
                            </div>
                        </Fade>
                    </div>
                </Toolbar>
                {
                    props.loader ? (
                        <LinearProgress variant="indeterminate" style={{position: "absolute", width: "100%", top: "0"}} />
                    ) : (null)
                }
            </AppBar>
            { userAnchorEl.current ? (
                <UserDialog anchorEl={userAnchorEl.current}
                            open={userDialog}
                            handleClose={onUserClose}
                            handleLogout={onLogout}
                />
                ) : (null)}
            <Drawer anchor="left" open={displayHam} onClose={() => setDisplayHam(false)}>
                {renderDrawer(classes)}
            </Drawer>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
