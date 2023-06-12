import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { rootContainerWithTheme } from "../styles/containerStylesWithTheme";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import CloseIcon from '@material-ui/icons/Close';
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings
    }
}

const useStyles = makeStyles((theme) => ({
    root: () => ({
        ...rootContainerWithTheme(theme),
        background: "#fff",
        width: "100%",
        height: "calc(100% - 64px)",
        marginTop: "64px",
        position: "absolute",
        zIndex: 10,
        display: "flex"
    }),
    view: {
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        [theme.breakpoints.up("lg")]: {
            maxWidth: theme.breakpoints.values.lg
        }
    },
    left: {
        height: "100%",
        flex: "0 0 200px"
    },
    right: {
        height: "100%",
        flex: "0 0 calc(100% - 200px)"
    },
    groupcard: {
        display: "flex",
        flexDirection: "row"
    },
    closeBtn: {
        position: "absolute",
        right: "-24px",
        top: "0"
    },
}));

function GroupManager(props) {
    const classes = useStyles(props);
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    return (
        <div className={classes.root}>
            <div className={classes.view}>
                <IconButton className={classes.closeBtn}>
                    <CloseIcon/>
                </IconButton>
                <div className={classes.left}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={selectedTab}
                        onChange={handleTabChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                    >
                        <Tab label="Overview" />
                        <Tab label="Roles" />
                        <Tab label="Members" />
                        <Tab label="Files and Folders" />
                    </Tabs>
                </div>
                <div className={classes.right}>
                    <div>
                        <Typography>
                            Group Overview
                        </Typography>
                        <div className={classes.groupcard}>
                            <Avatar style={{width: "100px", height: "100px"}}>
                                G
                            </Avatar>
                            <div>
                                <Button>
                                    Upload
                                </Button>
                            </div>
                            <div>
                                <TextField label="Group Name" variant="outlined" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupManager;
