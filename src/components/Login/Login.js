import React from "react";
import { Redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
import { withStyles } from '@material-ui/core/styles';
import { rootContainerFullWithTheme, rootContainerWithTheme } from "../styles/styles";
import NavLoggedOut from "../Nav/NavLoggedOut";
import { userPing } from "../utils/userPing";
import { connect } from "react-redux";
import { userLogin } from "../../modules/sessionManager/sessionManager";
import { getUserGroup } from "../utils/getUserGroup";

const mapDispatchToProps = (dispatch) => {
    return {
        userLogin: user => dispatch(userLogin(user)),
    }
}

const mapStateToProps = (state) => {
    return {
        logged_in: state.sessionManager.logged_in,
        userSettings: state.sessionManager.userSettings,
    }
}

const styles = (theme) => ({
    root: {
        ...rootContainerFullWithTheme(),
        background: "linear-gradient(#000 55%, #fff 55%)"
    },
    content: { ...rootContainerWithTheme(theme) }
});



export class Login extends React.Component {
    constructor(props) {
        super(props);
        this._props = {...props};
        delete this._props.classes;
    }

    componentDidMount() {
        userPing(this.props.userLogin);
    }

    render() {
        const { classes } = this.props;
        const group = getUserGroup(this.props.userSettings);
        if (this.props.logged_in) {
            if (this.props.location.state) return <Redirect to={this.props.location.state.from} />;
            else return <Redirect to={`/?fgroup=${group}`} />;
        }
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <LoginForm {...this._props} />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
