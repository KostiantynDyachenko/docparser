import React from "react";
import RegisterForm from "./RegisterForm";
import { withStyles } from '@material-ui/core/styles';
import { rootContainerFullWithTheme, rootContainerWithTheme } from "../styles/styles";
import NavLoggedOut from "../Nav/NavLoggedOut";
import { userPing } from "../utils/userPing";
import { connect } from "react-redux";
import { userLogin } from "../../modules/sessionManager/sessionManager";

const mapDispatchToProps = (dispatch) => {
    return {
        userLogin: user => dispatch(userLogin(user))
    }
}


const styles = (theme) => ({
    root: {
        ...rootContainerFullWithTheme(),
        background: "linear-gradient(#000 55%, #fff 55%)"
    },
    content: { ...rootContainerWithTheme(theme) }
});

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this._props = {...props};
        delete this._props.classes;
    }

    componentDidMount() {
        userPing(this.props.userLogin).then(status => {
            if (status) this.props.history.push("/");
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <RegisterForm {...this._props} />
                </div>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Register));
