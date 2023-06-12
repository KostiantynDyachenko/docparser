import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import SvgLogo from "../../images/logo";

const useStyles = makeStyles({
    wrapperLogo: {
        marginBottom: "20px",
        borderRadius: "25px"
    }
});

export function WrapperLogo(props) {
    const classes = useStyles();
    return(
        <Link to="/">
            <ButtonBase className={classes.wrapperLogo}
                        color="primary"
                        disableRipple
                        disableTouchRipple
                        {...props}
            >
                <SvgLogo width="150px" height="150px" />
            </ButtonBase>
        </Link>
    );
}

export default WrapperLogo;