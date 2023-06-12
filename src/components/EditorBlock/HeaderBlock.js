import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: "calc(100% - 128px)",
        height: "auto",
        margin: "0 64px",
        boxSizing: "border-box"
    },
    content: {
        width: "100%",
        height: "auto",
        fontSize: "1.5em",
        fontWeight: "600",
        padding: "0.4em 0",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
    }
}));

function HeaderBlock(props) {
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <span contentEditable
                    suppressContentEditableWarning={true}>
                    { props.text }
                </span>
            </div>
        </div>
    );
}

export default connect(mapStateToProps)(HeaderBlock);
