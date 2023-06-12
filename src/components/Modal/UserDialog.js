import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings
    }
}

const useStyles = makeStyles((theme) => ({
    avatarPanel: {
        width: "200px",
        height: "60px",
        padding: "10px",
        display: "flex",
        borderBottom: "1px solid rgba(0, 0, 0, 0.54)",
        boxSizing: "border-box"
    },
    avatarName: {
        height: "40px",
        display: "flex",
        flex: 1,
        alignItems: "center",
        paddingLeft: "8px"
    },
    logout: {
        color: theme.palette.red["700"]
    }
}));

function UserDialog(props) {
    const classes = useStyles();

    return (
        <Popover open={props.open}
                 anchorEl={props.open ? (props.anchorEl) : (null)}
                 anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'center',
                 }}
                 onClose={props.handleClose}
        >
            <div>
                <div className={classes.avatarPanel}>
                    <Avatar component="span">
                        {`${props.userSettings.first_name?.charAt(0)} ${props.userSettings.last_name?.charAt(0)}`}
                    </Avatar>
                    <Typography className={classes.avatarName}>
                        {`${props.userSettings?.username}`}
                    </Typography>
                </div>

                <Button className={classes.logout}
                        onClick={props.handleLogout}
                        fullWidth
                >
                    logout
                </Button>
            </div>
        </Popover>
    );
}

export default connect(mapStateToProps)(UserDialog);
