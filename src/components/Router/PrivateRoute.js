import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
        logged_in: state.sessionManager.logged_in
    }
}

function PrivateRoute({ component: Component, logged_in, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => {
                return logged_in ?
                    (<Component {...props} />) :
                    (<Redirect
                        to={{
                            pathname: `${process.env.PUBLIC_URL}/login`,
                            state: { from: props.location }
                        }}
                    />);
            }}
        />
    );
}

export default connect(mapStateToProps)(PrivateRoute);
