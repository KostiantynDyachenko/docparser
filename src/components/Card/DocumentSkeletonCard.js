import React from "react";
import { makeStyles } from "@material-ui/styles";
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
    root: {

    },
}));

function DocumentSkeletonCard(props) {
    const classes = useStyles(props);

    return (
        <Fade>
            <div className={classes.root} >
                {
                    props.bars.map(bar => (
                        <Skeleton animation={false} width={bar.width} style={{ backgroundColor: `${bar.color}` }} />
                    ))
                }
            </div>
        </Fade>
    );
}

export default FileUploadCard;
