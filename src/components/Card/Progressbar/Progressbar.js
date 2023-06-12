import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%"
    },
    progressbar: props => ({
        width: "100%",
        height: "3px",
        borderRadius: "4px",
        backgroundColor: lighten(props.color, 0.62),
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: props.color
        }
    })
});

export default function Progressbar(props) {
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            {
                props.indeterminate ? (
                    <LinearProgress className={classes.progressbar}
                                    variant="indeterminate"
                    />
                ) : (
                    <LinearProgress className={classes.progressbar}
                                    variant="determinate"
                                    value={(props.value / props.total * 100) ?? 100}
                    />
                )
            }
        </div>
    );
}
