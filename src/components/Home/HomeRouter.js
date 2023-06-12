import React from "react";
import Home from "./Home";
import HomeLoggedOut from "./HomeLoggedOut";
import { userPing } from "../utils/utils";
import { connect } from "react-redux";
import { userLogin } from "../../modules/sessionManager/sessionManager";
import { Redirect } from "react-router-dom";

const mapDispatchToProps = (dispatch) => {
    return {
        userLogin: user => dispatch(userLogin(user))
    }
}

const mapStateToProps = (state) => {
    return {
        logged_in: state.sessionManager.logged_in,
        userSettings: state.sessionManager.userSettings
    }
}

class HomeRouter extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        userPing(this.props.userLogin).then(() => {
        });
    }

    render() {
        if (this.props.logged_in) return (
            <Home {...this.props} />
        );
        else return (
            <Redirect to="/login" />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeRouter);
