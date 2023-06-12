import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { useFormFields } from "../utils/useFormFields";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditCaseModal(props) {
    const modalRef = React.useRef();
    const [fields, setFields] = useState({
        name: "",
        description: ""
    });

    const handleFieldChange = (event) => {
        setFields({
            ...fields,
            [event.target.name]: event.target.value
        });
    }

    useEffect(() => {
        setFields({
            name: (props.case?.name || ""),
            description: (props.case?.description || "")
        });
    }, [props.case]);

    const handleSave = () => {
        setFields({
            name: "",
            description: ""
        });
        props.handleSave(fields);
    }

    // TODO: modal isn't closing on enter key
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSave();
        }
    }

    const marginTop = {
        marginTop: "24px"
    }

    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleClose}
            onChange={handleFieldChange}
            aria-labelledby="create-folder-dialog"
            aria-describedby="create folder"
            ref={modalRef}
            onKeyDown={handleKeyDown}
        >
            <DialogTitle id="edit-folder-dialog-title">
                Edit { props.case?.documenttype === 4 ? ("Folder") : ("File") }
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="edit-folder-name"
                    label="Folder Name"
                    type="text"
                    placeholder="Folder Name"
                    name="name"
                    value={fields.name}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    autoComplete="off"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="edit-folder-description"
                    label="Description"
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={fields.description}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    autoComplete="off"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}
