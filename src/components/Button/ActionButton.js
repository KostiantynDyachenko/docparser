import Button from "@material-ui/core/Button";
import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    actionbutton: {
        padding: "4px 8px",
        borderRadius: "0",
        marginRight: "6px"
    }
});

export default function ActionButton(props) {
    const classes = useStyles();
    return (
        <Button className={classes.actionbutton}
                variant="contained"
                disableElevation
                onClick={props.onClick}
        >
            {props.action}
        </Button>
    );
}
