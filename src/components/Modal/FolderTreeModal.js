import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Api } from "../Api";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import {connect} from "react-redux";
import FormControl from "@material-ui/core/FormControl";

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings,
    }
}

const initialFields = {
    groupShare: ""
}

const initialOpen = {
    groupShare: false
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
// displays folder tree and returns folder details for the folder selected by user
function FolderTreeModal(props) {
    const modalRef = React.useRef();
    const [expanded, setExpanded] = React.useState([]);
    const [open, _setOpen] = useState(initialOpen);
    const [fields, _handleFieldChange] = useState(initialFields);
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

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelectedFolder(nodeIds);
    };

    const handleClose = () => {
        setSelectedFolder([]);
        props.handleClose();
    }

    const handleSave = () => {
        props.handleSave(fields.groupShare.id, selectedFolder);
    }

    useEffect(() => {
        if (fields.groupShare !== 0) {
            getGroupFolders(fields.groupShare);
        }
    }, [fields]);

    const getGroupFolders = async (groupShare) => {
        if (!groupShare.id) return;
        const response = await Api.getFolderStructureByGroupID(groupShare.id, 0);
        const json = response?._json;
        setGroupFolders(groupShare, json);
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

    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="folder tree modal"
            aria-describedby="folder tree"
            ref={modalRef}
        >
            <DialogTitle id="folder-tree-modal">
                { props?.title }
            </DialogTitle>
            <DialogContent>
                <FormControl component="fieldset">
                    <InputLabel>Select the group to share with</InputLabel>
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
                            props.userSettings.groups.map(group => {
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
                            <InputLabel shrink style={{ marginTop: "8px" }}>Select the folder to move to</InputLabel>
                            <TreeView defaultCollapseIcon={<ExpandMoreIcon />}
                                      defaultExpandIcon={<ChevronRightIcon />}
                                      expanded={expanded}
                                      selected={selectedFolder}
                                      onNodeToggle={handleToggle}
                                      onNodeSelect={handleSelect}
                            >
                                {renderTree(groupFolders)}
                            </TreeView>
                        </>
                    ) : (null)
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained" disabled={selectedFolder?.length === 0}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default connect(mapStateToProps)(FolderTreeModal);
