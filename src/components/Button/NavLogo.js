import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import SvgLogo from "../../images/logo";

const useStyles = makeStyles({
    logo: {
    }
});

export function NavLogo(props) {
    const classes = useStyles();
    return(
        <Link to="/">
            <ButtonBase className={classes.logo}
                        color="primary"
                        disableRipple
                        disableTouchRipple
                        {...props}
            >
                <SvgLogo width="24px" height="24px" />
            </ButtonBase>
        </Link>
    );
}

export default NavLogo;