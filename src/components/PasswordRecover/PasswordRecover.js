import React from "react";
import PasswordRecoverForm from "./PasswordRecoverForm";
import { withStyles } from '@material-ui/core/styles';
import { rootContainerFullWithTheme, rootContainerWithTheme } from "../styles/styles";
import { navigateHome } from "../utils/utils";
import NavLoggedOut from "../Nav/NavLoggedOut";

const styles = (theme) => ({
    root: { ...rootContainerFullWithTheme() },
    content: { ...rootContainerWithTheme(theme) }
});

export class PasswordRecover extends React.Component {
    constructor(props) {
        super(props);
        this._props = {...props};
        delete this._props.classes;
    }

    returnHome = () => navigateHome(this);

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <NavLoggedOut displayLogo={true} {...this._props} />
                <div className={classes.content}>
                    <PasswordRecoverForm />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(PasswordRecover);
