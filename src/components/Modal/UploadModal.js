import React, { useState, useEffect } from 'react';
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
import { Api } from "../Api";
import { SetModal } from "../../modules/modalManager/modalManager";
import { UploadFiles } from "../../modules/fileManager/fileManager";
import newUploadModalProps from "../NewProps/newUploadModalProps";
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import ListItemText from "@material-ui/core/ListItemText";

const mapStateToProps = (state) => {
    return {
        currentFolder: state.tableManager.currentFolder,
        currentFolderData: state.tableManager.currentFolderData,
        currentUserFilter: state.tableManager.currentUserFilter,
        currentGroup: state.tableManager.currentGroup,
        upload: state.modalManager.upload,
        userSettings: state.sessionManager.userSettings,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        SetModal: name => props => dispatch(SetModal(name)(props)),
        UploadFiles: files => dispatch(UploadFiles(files)),
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

// modal to allow user to configure a file being uploaded
function UploadModal(props) {
    const modalRef = React.useRef();
    const [fields, _handleFieldChange] = useState(initialFields);
    const [contentView, setContentView] = useState(0); // 0: form; 1: company & folder selection;
    const [open, _setOpen] = useState(initialOpen);
    const [groupFolders, _setGroupFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = React.useState(null);

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

    useEffect(() => {
        if (props.upload.bool) {
            handleFieldChange({
                target: {
                    name: "name",
                    value: props.upload?.file[0]?.name
                }
            })
        }
    }, [props.upload.bool]);

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
        props.SetModal("upload")(newUploadModalProps(false, []));
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
            ...initialFields
        });
        const newUploadFile = new File(props.upload.file, fields.name, { type: props.upload.file[0].type });

        newUploadFile.description = fields.description;
        newUploadFile.fileType = props.upload.file[0].fileType;
        newUploadFile.parentID = props.upload.file[0].parentID;
        newUploadFile.group = props.upload.file[0].group;
        props.UploadFiles([newUploadFile]);
        props.SetModal("upload")(newUploadModalProps(false, []));
        setSelectedFolder(null);
        setGroupFolders([]);
    }

    const marginTop = {
        marginTop: "24px"
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
                        Upload
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
                        //         <FormControlLabel value="None" control={<Radio color="primary" />} label={`Current: File will be shared with your group ${props.userSettings?.groups?.find(g => g.id === props.upload.file[0]?.group)?.name}`} />
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
            open={props.upload.bool}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            onChange={handleFieldChange}
            aria-labelledby="create-case-dialog"
            aria-describedby="create case"
            ref={modalRef}
        >
            {/*<DialogTitle id="create-case-dialog-title" disableTypography>
                <Typography variant="caption">
                    Upload File
                </Typography>
            */}
            <DialogTitle id="create-case-dialog-title">
                    Upload File
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadModal);
