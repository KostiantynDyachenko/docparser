import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MaximizeIcon from '@material-ui/icons/Maximize';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import Typography from "@material-ui/core/Typography";
import { ResizableBox } from 'react-resizable';
import Fade from "@material-ui/core/Fade";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
    root: {
        background: "#fff",
        zIndex: "1",
        border: "2px solid rgb(0, 0, 0)",
        position: "absolute",
        top: "0",
        left: "0"
    },
    title: {
        width: "100%",
        boxSizing: "border-box",
        paddingTop: "0",
        paddingBottom: "0",
        height: "32px",
        display: "flex",
        padding: "0 8px",
        alignItems: "center",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
        ...theme.typography.body1,
        fontSize: "12px",
    },
    content: {
        height: "calc(100% - 32px)",
        overflow: "auto",
        color: "rgba(0, 0, 0, 0.84)",
        background: "rgba(100, 100, 100, 0.08)",
        padding: "0 8px",
        ...theme.typography.body2,
        "& .MuiTypography-body1": {
            fontSize: "14px",
        },
    },
    titleActions: {
        position: "absolute",
        top: "0",
        right : "4px"
    },
}));

export default function DefinitionModal(props) {
    const classes = useStyles(props);
    const heightcheck = () => {
        return (props.y >= (window.innerHeight / 2));
    };
    const dialogref = useRef(null);
    const bodyref = useRef(null);
    const [pos, setPos] = useState([props.x, props.y]);
    const [height, setHeight] = useState(400);
    const [width, setWidth] = useState(props.width);

    const handleDrag = (event, data) => {
        event.preventDefault();
        setPos([pos[0] + data.deltaX, pos[1] + data.deltaY]);
    }

    const onResize = (event, {element, size, handle}) => {
        event.preventDefault();
        setWidth(size.width);
        setHeight(size.height);
        //this.setState({width: size.width, height: size.height});
    }

    useEffect(() => {
        setWidth(props.width);
        if (bodyref.current) {
            let _height = bodyref.current.clientHeight + 32;
            let y = props.y;
            if (y + _height > window.innerHeight) {
                y = window.innerHeight - height;
            }
            setHeight(_height);
            setPos([props.x, y]);
        }
    }, [props.x, props.y, props.width]);

    useEffect(() => {
        setWidth(props.width);
        if (bodyref.current) {
            let _height = bodyref.current.clientHeight + 32;
            let y = props.y;
            if (y + _height > window.innerHeight) {
                y = window.innerHeight - height;
            }
            setHeight(_height);
            setPos([props.x, y]);
        }
    }, [bodyref.current, dialogref.current]);

    if (!props.open) return (null);
    return (
        <Fade in={props.open} timeout={{enter: 1000, exit: 1000}}>
            <Draggable handle=".draggable-handle" cancel={'[class*="MuiDialogContent-root"]'} position={{x: pos[0], y: pos[1]}} onStart={handleDrag} onDrag={handleDrag} onStop={handleDrag}>
                <ResizableBox width={width}
                              height={height}
                              onResize={onResize}
                              className={classes.root}
                              resizeHandles={['se']}
                              handleSize={[20, 20]}
                              ref={dialogref}
                >
                    <>
                        <div className={`${classes.title} draggable-handle`} style={{ cursor: 'move' }}>
                            {props.title}

                            <div className={`${classes.titleActions}`}>
                                <Tooltip title="Close">
                                    <IconButton size="small"
                                                onClick={props.handleClose}
                                    >
                                        <CloseIcon/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={classes.content}>
                            <Typography ref={bodyref}>
                                {props.text}
                            </Typography>
                        </div>
                    </>
                </ResizableBox>
            </Draggable>
        </Fade>
    );
    // if (!props.open) return (null);
    // else return (
    //
    // );
}
