import { makeStyles } from '@material-ui/core/styles';
import React, {useEffect, useRef, useState} from "react";
import { navWithTheme, navFullWithTheme } from '../styles/styles';
import SvgFLRDAI from "../Svg/SvgFLRDAI";
import Skeleton from "@material-ui/lab/Skeleton";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#fff",
        color: "#000",
        alignItems: "center",
        boxShadow: "none"
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
        justifyContent: "flex-end",
        "& .MuiSkeleton-circle": {
            margin: "12px"
        }
    },
    titlecard: {
        width: "100%",
        ...theme.typography.h5
    },
    titleName: {
        height: "36px",
        display: "flex",
        "&:hover": {
            cursor: "pointer"
        }
    },
}));

function NavSkeleton(props) {
    const classes = useStyles(props);
    const titleName = useRef(null);

    const titleClick = () => {
        props.history.push("/");
    }

    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar className={classes.content}>
                <div className={classes.navleft}>
                    <span className={classes.titleName}
                          ref={titleName}
                    >
                        <SvgFLRDAI height="36px" width="160px" onClick={titleClick}/>
                    </span>
                </div>
                <div className={classes.navright}>
                    <Skeleton variant="circle" height={24} width={24}/>
                    <Skeleton variant="circle" height={24} width={24}/>
                    <Skeleton variant="circle" height={24} width={24}/>
                    <Skeleton variant="circle" height={24} width={24}/>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default NavSkeleton;
