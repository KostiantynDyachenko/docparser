import React from "react";
import { makeStyles } from "@material-ui/styles";
import { getStatusBadgeColor } from "../../utils/utils";

const useStyles = makeStyles(theme => ({
    root: props => {
        const backgroundColor = getStatusBadgeColor(props.status)
        return ({
            ...theme.typography.button,
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 8px",
            borderRadius: "8px",
            backgroundColor: backgroundColor,
            color: theme.palette.getContrastText(backgroundColor)
        })
    }
}));

function StatusBadge(props) {
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            {props.status}
        </div>
    );
}

export default StatusBadge;