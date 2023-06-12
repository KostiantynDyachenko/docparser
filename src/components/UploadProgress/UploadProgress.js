import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { exitButton } from '../styles/styles';
import {connect} from "react-redux";
import {Api} from "../Api";
import {ClearFiles, SetRefresh} from "../../modules/fileManager/fileManager";
import {getFileTypeFromName} from "../utils/getFileTypeFromName";
import Progressbar from "../Card/Progressbar/Progressbar";
import LinearProgress from '@material-ui/core/LinearProgress';
import { green, lightBlue, yellow, red, grey } from "@material-ui/core/colors";
import ToastService from "../Toast/ToastService";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {SetModal} from "../../modules/modalManager/modalManager";

const mapDispatchToProps = (dispatch) => {
    return {
        ClearFiles: () => dispatch(ClearFiles()),
        SetRefresh: (bool) => dispatch(SetRefresh(bool)),
        SetModal: name => props => dispatch(SetModal(name)(props)),
    }
}

const mapStateToProps = (state) => {
    return {
        uploading: state.fileManager.uploading
    }
}

const QUEUED = "QUEUED";
const UPLOADING = "UPLOADING";
const PROCESSING = "PROCESSING";
const COMPLETE = "COMPLETE";
const FAILED = "FAILED";

const getRenderStatus = (type) => {
    switch (type) {
        default:
        case QUEUED:
            return "QUEUED FOR UPLOAD";
        case UPLOADING:
            return "UPLOADING";
        case PROCESSING:
            return "UPLOAD PROCESSING";
        case COMPLETE:
            return "UPLOAD COMPLETE";
        case FAILED:
            return "UPLOAD FAILED";
    }
}

const getColor = (type) => {
    switch (type) {
        default:
        case QUEUED:
            return grey["600"];
        case UPLOADING:
            return lightBlue["600"];
        case PROCESSING:
            return yellow["600"];
        case COMPLETE:
            return green["600"];
        case FAILED:
            return red["600"];
    }
}

const verticalPadding = {
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: ".85rem"
}

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        width: "600px",
        maxHeight: "100px",
        overflowY: "auto",
        overflowX: "hidden",
        height: "auto",
        bottom: "20px",
        left: "calc(50% - 200px)",
        backgroundColor: "rgba(0,0,0,0.86)",
        color: "#fff",
        zIndex: 1
    },
    fileupload: {
        ...theme.typography.body2,
        flexBasis: "100%",
        whiteSpace: "nowrap"
    },
    filedetails: {
        display: "flex",
        alignItems: "center",
        height: "24px",
        padding: "2px 8px"
    },
    filename: {
        width: "calc(100% - 16px)",
        height: "20px",
        overflow: "hidden",
    },
    exit: {
        color: "#fff"
    },
}));

function UploadProgress(props){
    const classes = useStyles(props);
    const [filesUploading, setFilesUploading] = useState([]);
    // tracks filesUploading for previous states that are still loading
    const _filesUploading = useRef(null);
    const fileID = useRef(0);
    const [ellipsisAnchorEl, setEllipsisAnchorEl] = React.useState(null);
    const [ellipsisFile, setEllipsisFile] = React.useState({});

    const openEllipsisMenu = (filesUploading) => (event) => {
        setEllipsisFile(filesUploading);
        setEllipsisAnchorEl(event.target);
    }

    const closeEllipsisMenu = () => {
        setEllipsisFile({});
        setEllipsisAnchorEl(null);
    }

    const onEllipsisMenuClick = (option) => {
        switch (option) {
            case "aioperation": {
                break;
            }
        }
        setEllipsisFile({});
        setEllipsisAnchorEl(null);
    }

    const createFilesUpload = (files) => {
        const uploads = files.map(file => {
            const fileObj = {
                id: fileID.current,
                fileData: file,
                status: QUEUED,
                percent: 0
            }
            fileID.current += 1;
            return fileObj;
        });

        setFilesUploading([...filesUploading, ...uploads]);
        props.ClearFiles();
    }

    // updates a specific file in the filesUploading array, send whole file object being updated
    const updateFileUploading = (file) => {
        const index = _filesUploading.current.findIndex(fileUploading => fileUploading.id === file.id);
        const newFileUploading = Object.assign({}, _filesUploading.current[index], {
            ...file
        });
        const newFilesUploading = [..._filesUploading.current];
        newFilesUploading.splice(index, 1, newFileUploading);
        setFilesUploading(newFilesUploading);
    }

    // updates files from multiple files
    const updateFilesUploading = (files) => {
        let newFilesUploading = [...filesUploading];
        files.forEach(file => {
            const index = filesUploading.findIndex(fileUploading => fileUploading.id === file.id);
            newFilesUploading.splice(index, 1, file);
        });
        setFilesUploading(newFilesUploading);
    }

    const deleteFileUploading = (file) => {
        const index = _filesUploading.current.findIndex(fileUploading => fileUploading.id === file.id);
        const newFilesUploading = [..._filesUploading.current];
        newFilesUploading.splice(index, 1);
        setFilesUploading(newFilesUploading);
    }

    const startFileUploadProcess = async (files) => {
        const updateFilesPromises = files.map(async (file) => {
            const docTypeResponse = await Api.getDocumentType(file.fileData.fileType.substring(1));
            const fileTypeEnum = docTypeResponse._json;
            file.fileData.fileTypeEnum = fileTypeEnum;

            return Object.assign({}, file, {
                status: UPLOADING
            });
        });

        const updateFiles = await Promise.all(updateFilesPromises);
        updateFiles.forEach((file) => {
            const formData = new FormData();
            let name = file.fileData.name.endsWith(file.fileData.fileType) ? file.fileData.name : file.fileData.name + file.fileData.fileType;
            formData.append("name", name);
            formData.append("file", file.fileData);
            formData.append("documenttype", file.fileData.fileTypeEnum);
            formData.append("parent", file.fileData.parentID);
            formData.append("group", file.fileData.group);
            formData.append("description", file.fileData.description || "");
            formData.append("is_dynamic_headers", false);

            let config = {
                onUploadProgress: progressEvent => {
                    let percent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                    file.percent = percent;
                    updateFileUploading(file);
                    if (percent === 100) {
                        file.status = PROCESSING;
                    }
                    updateFileUploading(file);
                }
            }

            Api.uploadFile(formData, config).then(response => {
                file.status = COMPLETE;
                updateFileUploading(file);
                props.SetRefresh(true);
            }).catch(error => {
                ToastService.Toast({icon: "error", message: error.data});
                file.status = FAILED;
                updateFileUploading(file);
            });
        });
        updateFilesUploading(updateFiles);
    }

    useEffect(() => {
        if (props.uploading.length > 0) {
            createFilesUpload(props.uploading);
        }
    }, [props.uploading]);

    useEffect(() => {
        _filesUploading.current = filesUploading;
        // init
        const queued = filesUploading.filter(file => file.status === QUEUED);
        // processing and uploading
        const processing = filesUploading.filter(file => file.status === PROCESSING || file.status === UPLOADING);

        if (queued.length > 0 && processing.length === 0) {
            startFileUploadProcess([queued[0]]);
        }
    }, [filesUploading]);

    const renderProgressbar = (fileUploading) => {
        switch (fileUploading.status) {
            case UPLOADING:
                return (
                    <Progressbar color={getColor(fileUploading.status)} value={fileUploading.percent} total={100}/>
                );
            case QUEUED:
            case COMPLETE:
            case FAILED:
                return (
                    <Progressbar color={getColor(fileUploading.status)} value={100} total={100}/>
                );
            case PROCESSING:
                return (
                    <Progressbar color={getColor(fileUploading.status)} indeterminate/>
                );
        }
    }

    const renderEllipsisButton = (fileUploading) => {
        switch (fileUploading.status) {
            default:
            case UPLOADING:
            case PROCESSING:
            case QUEUED:
            case FAILED:
                return (
                    <></>
                );
            case COMPLETE:
                return (
                    <>
                        <IconButton className={classes.exit}
                                    size="small"
                                    onClick={openEllipsisMenu(fileUploading)}
                        >
                            <MoreHorizIcon/>
                        </IconButton>
                        <Menu
                            id="ellipsis-menu"
                            anchorEl={ellipsisAnchorEl}
                            keepMounted
                            open={Boolean(ellipsisAnchorEl)}
                            onClose={closeEllipsisMenu}
                        >
                            <MenuItem onClick={() => onEllipsisMenuClick("aioperation")} style={verticalPadding}>Ai Operation</MenuItem>
                            <MenuItem onClick={() => onEllipsisMenuClick("edit")} style={verticalPadding}>Edit</MenuItem>
                            <MenuItem onClick={() => onEllipsisMenuClick("copy")} style={verticalPadding}>Copy</MenuItem>
                            <MenuItem onClick={() => onEllipsisMenuClick("move")} style={verticalPadding}>Move</MenuItem>
                        </Menu>
                    </>
                )
        }
    }

    const renderXButton = (fileUploading) => {
        switch (fileUploading.status) {
            default:
            case UPLOADING:
            case PROCESSING:
                return (
                    <></>
                );
            case QUEUED:
            case COMPLETE:
            case FAILED:
                return (
                    <IconButton className={classes.exit}
                                size="small"
                                onClick={() => deleteFileUploading(fileUploading)}
                    >
                        <CloseIcon/>
                    </IconButton>
                );
        }
    }

    return (
        <div className={classes.root}>
            {
                filesUploading.map((fileUploading, index) => {
                    return (
                        <div className={classes.fileupload} key={`${fileUploading.fileData.name}-${index}`}>
                            <div className={classes.filedetails}>
                                <span style={{color: getColor(fileUploading.status)}}>
                                    {
                                        getRenderStatus(fileUploading.status)
                                    }
                                </span>
                                <span className={classes.filename}>
                                    &nbsp; {fileUploading.fileData.name}
                                </span>
                                {
                                    /* renderEllipsisButton(fileUploading) */
                                }
                                {
                                    renderXButton(fileUploading)
                                }
                            </div>
                            {
                                renderProgressbar(fileUploading)
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress);
