import React, {useState, useEffect, useRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {green, grey, lightBlue, red, yellow} from "@material-ui/core/colors";
import {ClearActions} from "../../modules/progressManager/progressManager";
import {SetModal} from "../../modules/modalManager/modalManager";
import {connect} from "react-redux";
import { Api } from "../Api";
import ToastService from "../Toast/ToastService";
import {SetRefresh} from "../../modules/fileManager/fileManager";
import Progressbar from "../Card/Progressbar/Progressbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const mapDispatchToProps = (dispatch) => {
    return {
        ClearActions: () => dispatch(ClearActions()),
        SetRefresh: (bool) => dispatch(SetRefresh(bool)),
    }
}

const mapStateToProps = (state) => {
    return {
        processes: state.progressManager.processes
    }
}
// statuses
const DELETE = "DELETE";
const AIOPERATION = "AIOPERATION";
const EDIT = "EDIT";
const MOVE = "MOVE";
const COPY = "COPY";
export { DELETE, AIOPERATION, EDIT, MOVE, COPY }
// status for delete
const QUEUED_FOR_DELETE = "QUEUED_FOR_DELETE";
const PROCESSING_DELETE = "PROCESSING_DELETE";
const DELETE_FAILED = "DELETE_FAILED";
const DELETE_COMPLETE = "DELETE_COMPLETE";
// status for processing
const QUEUED_FOR_AIOPERATION = "QUEUED_FOR_AIOPERATION";
const PROCESSING_AIOPERATION = "PROCESSING_AIOPERATION";
const AIOPERATION_FAILED = "AIOPERATION_FAILED";
const AIOPERATION_COMPLETE = "AIOPERATION_COMPLETE";
// status for edit
const QUEUED_FOR_EDIT = "QUEUED_FOR_EDIT";
const PROCESSING_EDIT = "PROCESSING_EDIT";
const EDIT_FAILED = "EDIT_FAILED";
const EDIT_COMPLETE = "EDIT_COMPLETE";
// status for move
const QUEUED_FOR_MOVE = "QUEUED_FOR_MOVE";
const PROCESSING_MOVE = "PROCESSING_MOVE";
const MOVE_FAILED = "MOVE_FAILED";
const MOVE_COMPLETE = "MOVE_COMPLETE";
// status for edit
const QUEUED_FOR_COPY = "QUEUED_FOR_COPY";
const PROCESSING_COPY = "PROCESSING_COPY";
const COPY_FAILED = "COPY_FAILED";
const COPY_COMPLETE = "COPY_COMPLETE";

const getStatus = (type) => {
    switch (type) {
        default:
            return undefined;
        case AIOPERATION: {
            return QUEUED_FOR_AIOPERATION;
        }
    }
}

const getRenderStatus = (type, algtype = "") => {
    switch (type) {
        default:
        case QUEUED_FOR_DELETE:
            return "QUEUED FOR DELETE";
        case PROCESSING_DELETE:
            return "PROCESSING DELETE";
        case DELETE_FAILED:
            return "DELETE FAILED";
        case DELETE_COMPLETE:
            return "DELETE COMPLETE";
        case QUEUED_FOR_AIOPERATION:
            return "QUEUED FOR " + algtype.toUpperCase();
        case PROCESSING_AIOPERATION:
            return "PROCESSING " + algtype.toUpperCase();
        case AIOPERATION_FAILED:
            return algtype.toUpperCase() + " FAILED";
        case AIOPERATION_COMPLETE:
            return algtype.toUpperCase() + " COMPLETE";
    }
}

const getColor = (type) => {
    switch (type) {
        default:
        case QUEUED_FOR_DELETE:
        case QUEUED_FOR_AIOPERATION:
            return grey["600"];
        case PROCESSING_DELETE:
        case PROCESSING_AIOPERATION:
            return yellow["600"];
        case DELETE_COMPLETE:
        case AIOPERATION_COMPLETE:
            return green["600"];
        case DELETE_FAILED:
        case AIOPERATION_FAILED:
            return red["600"];
    }
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
        zIndex: 2
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

function AppProgress(props){
    const classes = useStyles(props);
    const [processes, setProcesses] = useState([]);
    const _processes = useRef(null);
    const [processID, setProcessID] = useState(0);

    // updates a specific file in the filesUploading array, send whole file object being updated
    const updateProcess = (process) => {
        const index = _processes.current.findIndex(actionprocess => actionprocess.id === process.id);
        const newprocess = Object.assign({}, _processes.current[index], {
            ...process
        });
        const newprocesses = [..._processes.current];
        newprocesses.splice(index, 1, newprocess);
        setProcesses(newprocesses);
    }

    // updates files from multiple files
    const updateProcesses = (updatingprocesses) => {
        let newprocesses = [...processes];
        updatingprocesses.forEach(actionprocess => {
            const index = processes.findIndex(_actionprocess => _actionprocess.id === actionprocess.id);
            newprocesses.splice(index, 1, actionprocess);
        });
        setProcesses(newprocesses);
    }

    const deleteProcess = (process) => {
        const index = _processes.current.findIndex(actionprocess => actionprocess.id === process.id);
        const newprocesses = [..._processes.current];
        newprocesses.splice(index, 1);
        setProcesses(newprocesses);
    }

    const handleAction = (actionProcesses) => {
        const newprocesses = actionProcesses.map(ap => {
            const apobj = {
                id: processID,
                status: getStatus(ap.action),
                ...ap
            }
            setProcessID(processID + 1);
            return apobj;
        });
        setProcesses([...processes, ...newprocesses]);
        props.ClearActions();
    }

    const startAiOperationProcess = async (operationprocesses) => {
        const updateprocesses = operationprocesses.map(process => {
            return Object.assign({}, process, {
                status: PROCESSING_AIOPERATION
            });
        });
        updateProcesses(updateprocesses);

        operationprocesses.forEach(operationprocess => {
            console.log(operationprocess.body)
            Api.reprocessDocument(operationprocess.body).then(response => {
                operationprocess.status = AIOPERATION_COMPLETE;
                updateProcess(operationprocess);
                props.SetRefresh(true);
            }).catch(error => {
                ToastService.Toast({icon: "error", message: error.data});
                operationprocess.status = AIOPERATION_FAILED;
                updateProcess(operationprocess);
            });
        });

        // Api.reprocessDocument(formData).then(response => {
        //     file.status = AIOPERATION_COMPLETE;
        //     updateFileUploading(file);
        //     props.SetRefresh(true);
        // }).catch(error => {
        //     ToastService.Toast({icon: "error", message: error.data});
        //     file.status = AIOPERATION_FAILED;
        //     updateFileUploading(file);
        // });
    }

    useEffect(() => {
        if (props.processes.length > 0) {
            handleAction(props.processes);
        }
    }, [props.processes]);

    useEffect(() => {
        _processes.current = processes;

        const queued = processes.filter(process => [QUEUED_FOR_AIOPERATION].includes(process.status));
        const processing = processes.filter(process => [PROCESSING_AIOPERATION].includes(process.status));

        if (queued.length > 0 && processing.length === 0) {
            startAiOperationProcess([queued[0]]);
        }
    }, [processes]);

    const renderProgressbar = (process) => {
        switch (process.status) {
            case QUEUED_FOR_AIOPERATION:
            case AIOPERATION_FAILED:
            case AIOPERATION_COMPLETE:
                return (
                    <Progressbar color={getColor(process.status)} value={100} total={100}/>
                );
            case PROCESSING_AIOPERATION:
                return (
                    <Progressbar color={getColor(process.status)} indeterminate/>
                );
        }
    }

    const renderXButton = (process) => {
        switch (process.status) {
            default:
            case PROCESSING_AIOPERATION:
                return (
                    <></>
                );
            case QUEUED_FOR_AIOPERATION:
            case AIOPERATION_FAILED:
            case AIOPERATION_COMPLETE:
                return (
                    <IconButton className={classes.exit}
                                size="small"
                                onClick={() => deleteProcess(process)}
                    >
                        <CloseIcon/>
                    </IconButton>
                );
        }
    }

    return (
        <div className={classes.root}>
            {
                processes.map(process => {
                    return (
                        <div className={classes.fileupload} key={process.id}>
                            <div className={classes.filedetails}>
                                <span style={{color: getColor(process.status)}}>
                                    {
                                        getRenderStatus(process.status, process?.type)
                                    }
                                </span>
                                <span className={classes.filename}>
                                    &nbsp; {process.body.name}
                                </span>
                                {
                                    renderXButton(process)
                                }
                            </div>
                            {
                                renderProgressbar(process)
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AppProgress);
