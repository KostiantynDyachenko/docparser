import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Slide from '@material-ui/core/Slide';
import Typography from "@material-ui/core/Typography";
import { modalWithTheme, exitButton } from '../styles/styles';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: "8px",
        boxShadow: theme.shadows[4],
        whiteSpace: "pre-wrap",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        ...modalWithTheme(theme)
    },
    header: {
        padding: theme.spacing(2, 3)
    },
    content: {
        maxHeight: "calc(100% - 56px)",
        overflow: "auto",
        padding: theme.spacing(0, 2, 0, 3)
    },
    exit: exitButton,
    actions: {
        position: "absolute",
        top: "36px",
        right: "8px"
    }
}));

function FileModal(props) {
    const classes = useStyles();

    const handleClose = () => {
        props.viewFile(-1);
    };

    return (
        <Modal
            aria-labelledby="file-modal"
            aria-describedby="file summary"
            className={classes.modal}
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Slide in={props.open} direction="left">
                <div className={classes.paper}>
                    <IconButton className={classes.exit}
                                size="small"
                                onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>

                    <IconButton className={classes.actions}
                                size="small"
                    >
                        <MoreVertIcon/>
                    </IconButton>

                    <div className={classes.header}>
                        <Typography variant="h3">
                            { props.getDisplayFile()?.name ?? "" }
                        </Typography>
                    </div>

                    <div className={classes.content}>
                        <Typography variant="body1">

                        </Typography>
                    </div>
                </div>
            </Slide>
        </Modal>
    );
}

export default FileModal;
