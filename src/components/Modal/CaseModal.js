import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useFormFields } from "../utils/useFormFields";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import {connect} from "react-redux";
import {Api} from "../Api";
import newUploadModalProps from "../NewProps/newUploadModalProps";

const mapStateToProps = (state) => {
    return {
        upload: state.modalManager.upload,
        userSettings: state.sessionManager.userSettings,
    }
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialFields = {
    name: "",
    description: "",
    company: "None",
    newCompany: null,
    groupShare: ""
}

const initialOpen = {
    groupShare: false
}


function CaseModal(props) {
    const modalRef = React.useRef();
    const nameRef = React.useRef();
    const [fields, _handleFieldChange] = useState(initialFields);
    const [contentView, setContentView] = useState(0); // 0: form; 1: company & folder selection;
    const [open, _setOpen] = useState(initialOpen);
    const [groupFolders, _setGroupFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = React.useState(0);

    const setGroupFolders = (group, children) => {
        _setGroupFolders([
            { documentid: 0, name: `${group.name} - root`, children: children }
        ]);
    }

    const setOpen = (key) => (value) => {
        _setOpen({
            ...open,
            [key]: value
        });
    }

    const handleFieldChange = (event) => {
        _handleFieldChange({
            ...fields,
            [event.target.name]: event.target.value
        });
    }

    const handleSelectFolder = (event, nodeIds) => {
        setSelectedFolder(nodeIds);
    };

    useEffect(() => {
        if (fields.groupShare !== 0) {
            getGroupFolders(fields.groupShare);
        }
    }, [fields]);

    // TODO: modal isn't closing on enter key
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSave();
        }
    }

    const marginTop = {
        marginTop: "24px"
    }

    const getGroupFolders = async (groupShare) => {
        if (!groupShare.id) return;
        const response = await Api.getFolderStructureByGroupID(groupShare.id, 0);
        const json = response?._json;
        setGroupFolders(groupShare, json);
    }

    const handleClose = () => {
        setContentView(0);
        _handleFieldChange({
            ...fields,
            ...initialFields
        });
        props.handleClose();
    }

    const handleBack = () => {
        setContentView(0);
    }

    const handleNext = () => {
        setContentView(1);
    }

    const handleSave = () => {
        _handleFieldChange({
            ...fields,
            ...initialFields,
            parentID: selectedFolder ? +selectedFolder : props.parentID
        });
        props.handleSave({
            ...fields,
            parentID: selectedFolder ? +selectedFolder : props.parentID
        });
        setContentView(0);
        setSelectedFolder(null);
        setGroupFolders([]);
    }

    const getCurrentGroup = () => {
        if (props.upload.file.length > 0) {
            return props.upload.file[0].group;
        }
        else {
            return
        }
    }

    const renderTree = (nodes) => {
        return nodes.map(node => {
            let classNames = "";
            if (+selectedFolder === +node.documentid) {
                classNames = "TreeItem-selected";
            }
            return (
                <TreeItem key={node.documentid} nodeId={`${node.documentid}`} label={node.name} className={classNames}>
                    {Array.isArray(node.children) ? renderTree(node.children) : null}
                </TreeItem>
            );
        })
    }

    const getActions = () => {
        if (contentView === 0) {
            return (
                <>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    {
                        fields.company === "None" ? (
                            <Button onClick={handleSave} color="primary" variant="contained">
                                Upload
                            </Button>
                        ) : (
                            <Button onClick={handleNext} color="primary" variant="contained">
                                Next
                            </Button>
                        )
                    }
                </>
            );
        }
        else {
            return (
                <>
                    <Button onClick={handleBack} color="primary">
                        Back
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Confirm
                    </Button>
                </>
            );
        }
    }

    const getContent = () => {
        if (contentView === 0) {
            return (
                <>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="upload-file-name"
                        label="File Name"
                        type="text"
                        placeholder="File Name"
                        name="name"
                        value={fields.name}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        autoComplete="off"
                        ref={nameRef}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="upload-file-description"
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
                    {
                        // <FormControl component="fieldset" style={marginTop}>
                        //     <FormLabel component="legend">Who can access</FormLabel>
                        //     <RadioGroup aria-label="who can access"
                        //                 value={fields.company}
                        //                 name="company"
                        //                 onChange={handleFieldChange}
                        //     >
                        //         <FormControlLabel value="None" control={<Radio color="primary" />} label={`Current: File will be shared with your group ${props.userSettings?.groups?.find(g => g.id === props.currentGroup)?.name}`} />
                        //         <FormControlLabel value="Company" control={<Radio color="primary" />} label={"Group: Choose a different group to share this file with"} />
                        //     </RadioGroup>
                        // </FormControl>
                    }
                </>
            );
        }
        else {
            return (
                <>
                    <FormControl component="fieldset">
                        <InputLabel>Select a group to share with</InputLabel>
                        <Select
                            labelId="group-share"
                            id="group-share"
                            open={open.groupShare}
                            onClose={() => setOpen("groupShare")(false)}
                            onOpen={() => setOpen("groupShare")(true)}
                            name="groupShare"
                            value={fields.groupShare}
                            renderValue={val => val.name}
                            onChange={handleFieldChange}
                        >
                            {
                                props.userSettings.groups.filter(g => g.id !== props.upload.file?.[0]?.group).map(group => {
                                    return (
                                        <MenuItem value={group} key={group.id}>
                                            <ListItemText primary={group.name} />
                                        </MenuItem>
                                    );
                                })
                            }
                        </Select>
                    </FormControl>
                    {
                        (fields.groupShare !== "") ? (
                            <>
                                <InputLabel shrink style={{ marginTop: "8px" }}>Select the folder to upload to</InputLabel>
                                <TreeView
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpanded={['root']}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                    onNodeSelect={handleSelectFolder}
                                >
                                    {renderTree(groupFolders)}
                                </TreeView>
                            </>
                        ) : (null)
                    }
                </>
            );
        }
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
            <DialogTitle id="create-folder-dialog-title">
                Create Folder
            </DialogTitle>
            <DialogContent>
                {getContent()}
            </DialogContent>
            <DialogActions>
                {getActions()}
            </DialogActions>
        </Dialog>
    );
}

export default connect(mapStateToProps)(CaseModal);
