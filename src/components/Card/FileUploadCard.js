import React from "react";
import { makeStyles } from "@material-ui/styles";
import { bytesToSize, getFiletypeColor } from "../utils/utils";
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import RedoIcon from '@material-ui/icons/Redo';
import StopIcon from '@material-ui/icons/Stop';
import StatusBadge from "./StatusBadge/StatusBadge";
import { getStatusBadgeColor } from "../utils/utils";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import SvgIcon from '@material-ui/core/SvgIcon';
import Fade from '@material-ui/core/Fade';
import Progressbar from "./Progressbar/Progressbar";

const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: "8px",
        boxShadow: theme.shadows[2],
        height: "auto",
        margin: "8px 0",
        padding: "8px",
        display: "flex",
        position: 'relative'
    },
    icon: {
        flex: "0 0 64px",
        width: "64px",
        height: "64px",
        position: "relative",
        color: props => getFiletypeColor(props.filetype),
        "& svg": {
            height: "100%",
            width: "100%"
        }
    },
    iconbadge: {
        ...theme.typography.button,
        height: "27px",
        width: "40px",
        boxSizing: "border-box",
        fontSize: "11px",
        position: "absolute",
        bottom: "10px",
        left: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        border: props => `1px solid ${getFiletypeColor(props.filetype)}`,
        color: props => getFiletypeColor(props.filetype),
        padding: "3px",
        borderRadius: "4px"
    },
    content: {
        flex: "100%",
        padding: "2px 8px"
    },
    actions: {
        height: "64px",
        display: "flex",
        alignItems: "start"
    },
    progressBar: {
        position: "absolute",
        width: "calc(100% - 88px)",
        height: "8px",
        bottom: "8px",
        left: "78px",
        borderRadius: "4px"
    },
    title: {
        ...theme.typography.h6,
        maxHeight: "32px",
        maxWidth: "100%",
        overflow: "hidden",
        wordWrap: "break-all"
    },
    size: {
        ...theme.typography.caption
    },
    filler: {
        width: "4px"
    }
}));

function FileUploadCard(props) {
    const classes = useStyles(props);

    const getAction = () => {
        if (props.status === "complete") return (
            <IconButton size="small"
                        onClick={() => props.viewFile(props.index)}
            >
                <LaunchIcon />
            </IconButton>
        )

        if (props.status === "failed") return (
            <IconButton size="small"
                        onClick={() => props.retryFile(props.index)}
            >
                <RedoIcon />
            </IconButton>
        );

        return (
            <IconButton size="small"
                        onClick={() => props.stopFile(props.index)}
            >
                <StopIcon />
            </IconButton>
        );
    }

    return (
        <Fade>
            <div className={classes.root}>
                <div className={classes.icon}>
                    <SvgIcon>
                        <InsertDriveFileIcon/>
                    </SvgIcon>
                    <div className={classes.iconbadge}>
                        {props.filetype}
                    </div>
                </div>

                <div className={classes.content}>
                    <div className={classes.title}>
                        {props.name}
                    </div>
                    <div className={classes.size}>
                        {bytesToSize(props.size)}
                    </div>
                </div>

                <div className={classes.actions}>
                    <StatusBadge {...props} />
                    <div className={classes.filler}/>
                    { getAction() }
                </div>

                <div className={classes.progressBar}>
                    <Progressbar color={getStatusBadgeColor(props.status)} value={props.time} total={props.totalTime} />
                </div>
            </div>
        </Fade>
    );
}

export default FileUploadCard;
