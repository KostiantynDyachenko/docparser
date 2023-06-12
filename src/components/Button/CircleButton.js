import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles({
    circleButton: {
        width: "36px",
        minWidth: "36px",
        borderRadius: "36px"
    }
});

export function CircleButton(props) {
    const classes = useStyles();
    return(
        <Button className={classes.circleButton}
                variant="contained"
                color="primary"
                {...props}
        >
            <ArrowBackIcon/>
        </Button>
    );
}

export default CircleButton;