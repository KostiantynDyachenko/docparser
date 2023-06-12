// *****************************************************************************
// This component's functionality has been moved to PortfolioCard.js to reduce
// redundancies. Keeping this file temporarily in case anything was lost during
// the move.
// *****************************************************************************

import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Redirect, Route, useLocation, useParams, useRouteMatch, useHistory, Link} from "react-router-dom";
import {rootContainerFullWithTheme} from "../styles/containerStylesWithTheme";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import {borders} from "../styles/globalStyles";
import CircularProgress from '@material-ui/core/CircularProgress';
import {Api} from "../Api";
import {connect} from "react-redux";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PortfolioTable from "./PortfolioTable";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import MenuItem from "@material-ui/core/MenuItem";
import ActionButton from "../Button/ActionButton";
import PublishIcon from "@material-ui/icons/Publish";
import {getFileTypeFromName} from "../utils/getFileTypeFromName";
import CaseModal from "../Modal/CaseModal";
import EditCaseModal from "../Modal/EditCaseModal";
import FolderTreeModal from "../Modal/FolderTreeModal";
import AIOperationModal from "../Modal/AIOperationModal";
import newCreateModalProps from "../NewProps/newCreateModalProps";
import newEditModalProps from "../NewProps/newEditModalProps";
import newMoveModalProps from "../NewProps/newMoveModalProps";
import newCopyModalProps from "../NewProps/newCopyModalProps";
import newAiOperationModalProps from "../NewProps/newAiOperationModalProps";
import newUploadModalProps from "../NewProps/newUploadModalProps";
import DocIcon from "../Svg/DocIcon";
import CsvIcon from "../Svg/CsvIcon";
import SvgPdf from "../Svg/SvgPdf";
import SvgFolder from "../Svg/SvgFolder";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import BackspaceIcon from '@material-ui/icons/Backspace';
import {UploadFile, UploadFiles, SetRefresh, SetLoader} from "../../modules/fileManager/fileManager";
import {SetModal} from "../../modules/modalManager/modalManager";
import UploadModal from "../Modal/UploadModal";
import NavSkeleton from "../Nav/NavSkeleton";
import Skeleton from "@material-ui/lab/Skeleton";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Tooltip from "@material-ui/core/Tooltip";
import {withRouter} from 'react-router-dom';
import {
    SetCurrentFolder, SetCurrentFolderData,
    SetCurrentGroup, SetCurrentPage, SetCurrentRowsPerPage,
    SetCurrentUserFilter,
    SetTableData, SetTableRowsSelected, ToggleTableRowSelected
} from "../../modules/tableManager/tableManager";
import {openContextMenu} from "../../modules/contextMenuManager/contextMenuManager";

const mapDispatchToProps = (dispatch) => {
    return {
        SetTableData: data => dispatch(SetTableData(data)),
        SetCurrentUserFilter: int => dispatch(SetCurrentUserFilter(int)),
        SetCurrentGroup: int => dispatch(SetCurrentGroup(int)),
        SetCurrentFolder: int => dispatch(SetCurrentFolder(int)),
        SetCurrentFolderData: int => dispatch(SetCurrentFolderData(int)),
        SetCurrentPage: int => dispatch(SetCurrentPage(int)),
        SetCurrentRowsPerPage: int => dispatch(SetCurrentRowsPerPage(int)),
        openContextMenu: (x, y, actions, handleActions) => dispatch(openContextMenu(x, y, actions, handleActions)),
        ToggleTableRowSelected: (data, index) => dispatch(ToggleTableRowSelected(data, index)),
        SetTableRowsSelected: (data, indices, bool) => dispatch(SetTableRowsSelected(data, indices, bool)),
        UploadFile: file => dispatch(UploadFile(file)),
        UploadFiles: files => dispatch(UploadFiles(files)),
        SetRefresh: bool => dispatch(SetRefresh(bool)),
        SetModal: name => props => dispatch(SetModal(name)(props)),
        SetLoader: bool => dispatch(SetLoader(bool)),
    }
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableManager.tableData,
        currentFolder: state.tableManager.currentFolder,
        currentFolderData: state.tableManager.currentFolderData,
        currentFilter: state.tableManager.currentFilter,
        currentGroup: state.tableManager.currentGroup,
        selectedRows: state.tableManager.selectedRows,
        userSettings: state.sessionManager.userSettings,
        upload: state.modalManager.upload,
        refresh: state.fileManager.refresh
    }
}

const useStyles = makeStyles((theme) => {
    return ({
        content: {
            ...rootContainerFullWithTheme(theme),
            flexDirection: "column",
            height: "calc(100% - 112px)",
            width: "calc(100% - 64px)",
            margin: "16px 0 32px",
            overflow: "visible",
            justifyContent: "flex-start",
        },
        contentheader: {
            width: "100%",
            height: "40px",
            flexBasis: "40px",
            flexGrow: "0",
            flexShrink: "0",
            ...theme.typography.h6,
            fontSize: "22px"
        },
        contentheaderdescription: {
            width: "calc(100% - 16px)",
            height: "38px",
            flexBasis: "38px",
            flexGrow: "0",
            marginBottom: "2px",
            flexShrink: "0",
            padding: "0 8px",
            ...theme.typography.body2,
            color: "rgba(0, 0, 0, 0.77)",
            background: "rgb(242, 242, 242)",
            display: "flex",
            alignItems: "center"
        },
        contentview: {
            width: "100%",
            display: "flex",
        },
        contentviewleft: {
            flex: "1 0 calc(100% - 400px)",
            display: "flex",
            maxHeight: "100%",
        },
        contentviewright: {
            flex: "0 0 390px",
            width: "390px",
            paddingLeft: "10px",
            display: "flex",
            maxHeight: "100%",
        },
        linebreak: {
            width: "calc(100% - 16px)",
            margin: "0 8px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
        },
        previewcard: {
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            boxSizing: "border-box",
            padding: "0",
            overflow: "hidden",
            background: theme.palette.background.paper,
            border: borders.border,
            boxShadow: theme.shadows[2],
        },
        previewheading: {
            display: "flex",
            alignItems: "center",
            height: "32px",
            flex: "0 0 32px",
            padding: "0 8px",
            ...theme.typography.caption,
            fontWeight: "600",
            borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
        },
        previewheading2: {
            padding: "8px",
            ...theme.typography.caption,
            fontWeight: "600"
        },
        previewicon: {
            display: "flex",
            justifyContent: "center",
            flex: "0 0 100px",
            padding: "16px 0 8px",
            background: "rgb(242, 242, 242)",
        },
        previewname: {
            wordWrap: "break-word",
            overflow: "hidden",
            width: "373px",
            padding: "8px",
            fontWeight: "600",
            height: "auto",
            flex: "0 0 auto"
        },
        previewdescription: {
            width: "calc(100% - 16px)",
            padding: "0 8px",
            minHeight: "40px",
            ...theme.typography.body2,
            color: "rgba(0, 0, 0, 0.77)",
            background: "rgb(242, 242, 242)",
            display: "flex",
            alignItems: "center"
        },
        progressholder: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
        },
        foldercontentpreview: {
            padding: "12px 8px",
            flex: "0 0 calc(100% - 310px)",
            maxHeight: "calc(100% - 310px)",
            overflowY: "auto",
            overflowX: "hidden",
            "& $linkedsummariespreview:nth-child(even)": {
                backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
        },
        folderitempreview: {
            width: "364px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: "3px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
        },
        linkedsummariespreview: {
            width: "364px",
            display: "flex",
            flexDirection: "row",
            padding: "2px",
            marginTop: "6px",
            overflow: "hidden",
        },
        summaryitemicon: {
            flex: "0 0 40px",
        },
        summaryitempreview: {
            paddingLeft: "6px",
            flex: "0 0 calc(100% - 40px)",
            display: "flex",
            alignItems: "center",
            fontSize: "0.875rem"
        },
        contentcard: {
            width: "100%",
            height: "auto",
            maxHeight: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            boxSizing: "border-box",
            padding: "0",
            overflow: "visible",
            background: theme.palette.background.paper,
            border: borders.border,
            boxShadow: theme.shadows[2],
        },
        contencardbody: {
            height: "auto",
            width: "calc(100% - 16px)",
            overflow: "hidden",
            boxSizing: "border-box",
            marginLeft: "8px",
            paddingBottom: "8px",
            display: "flex",
            flexDirection: "column"
        },
        documentcardbody: {
            height: "auto",
            maxHeight: "100%",
            width: "calc(100% - 16px)",
            overflow: "auto",
            boxSizing: "border-box",
            marginLeft: "8px",
            display: "flex",
            flexDirection: "column",
            "& .ce-toolbar__content": {
                [theme.breakpoints.down('lg')]: {
                    maxWidth: "calc(100% - 64px)"
                },
                [theme.breakpoints.up('lg')]: {
                    maxWidth: "calc(100% - 304px)"
                },
            },
            "& .ce-block__content": {
                [theme.breakpoints.down('lg')]: {
                    maxWidth: "calc(100% - 64px)"
                },
                [theme.breakpoints.up('lg')]: {
                    maxWidth: "calc(100% - 304px)"
                },
            }
        },
        contentcardfooter: {
            height: "52px",
            width: "100%",
            flex: "0 0 52px",
            position: "relative",
        },
        contentcardtitle: {
            height: "32px",
            width: "100%",
            flex: "0 0 32px",
            padding: "0 8px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            "& a": {
                ...theme.typography.caption,
                color: theme.palette.text.primary,
                textDecoration: "none"
            }
        },
        contentcardactions: {
            height: "44px",
            width: "100%",
            flex: "0 0 44px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden"
        },
        contextAnswer: {
            overflow: "auto"
        },
        leftactions: {
            flex: "0 0 calc(100% - 76px)",
            height: "100%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: "8px",
            boxSizing: "border-box",
            "& .MuiButton-label": {
                whiteSpace: "nowrap"
            }
        },
        rightactions: {
            flex: "0 1 76px",
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingLeft: "4px",
            paddingRight: "8px",
            boxSizing: "border-box"
        },
        quickSearchBar: {
            height: "33px",
            "& .MuiInputBase-root": {
                height: "33px",
                borderRadius: "0",
                marginRight: "6px"
            }
        },
        actionbutton: {
            padding: "4px 8px",
            borderRadius: "0",
            marginRight: "6px",
            whiteSpace: "nowrap"
        },
        actionfiller: {
            display: "inline-block",
            width: "4px"
        },
        tabheading: {
            ...theme.typography.h6
        },
        tabs: {
            ...theme.typography.subtitle2,
            padding: theme.spacing(0.5, 0, 0.5, 2)
        },
        divider: {
            width: "100%",
            height: "2px",
            background: "rgba(0, 0, 0, 0.1)",
            margin: theme.spacing(1, 0)
        },
        route: {
            ...theme.typography.h5,
            padding: theme.spacing(0, 2),
            height: "59px",
            position: "relative",
            bottom: "-4px",
            display: "flex",
            alignItems: "center"
        },
        selectedRoute: {
            backgroundColor: "#757575",
            color: "#fff"
        },
        routefiller: {
            width: "4px"
        },
        footeractions: {
            position: "absolute",
            height: "auto",
            bottom: "8px",
            left: "16px",
            zIndex: "1"
        },
        input: {
            display: 'none',
        },
        floatRight: {
            position: "absolute",
            right: 0,
            display: "inline-block"
        },
        descriptionfiller: {
            ...theme.typography.caption,
            color: "rgba(0, 0, 0, 0.67)",
        }
    })
});

const initialMouse = {
    mouseX: null,
    mouseY: null
}

function PortfolioView(props){
    const classes = useStyles(props);
    const { id } = useParams();
    const { url } = useRouteMatch();
    const { search } = useLocation();
    const history = useHistory();
    // false: shows spinner; true: shows portfolio
    const [dataLoaded, setDataLoaded] = useState(false);
    const [tableDataLoaded, setTableDataLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [currentParent, setCurrentParent] = useState(null);
    const [anchorElEllipsis, setAnchorElEllipsis] = useState(null);
    const openEllipsisMenu = Boolean(anchorElEllipsis);
    const [anchorElFilterMenu, setAnchorElFilterMenu] = useState(null);
    const openFilterMenu = Boolean(anchorElFilterMenu);
    const [anchorElBreadcrumbMenu, setAnchorElBreadcrumbMenu] = useState(null);
    const openBreadcrumbMenu = Boolean(anchorElBreadcrumbMenu);
    const [currentFilter, setCurrentFilter] = useState("all");
    const [currentRootFilter, setCurrentRootFilter] = useState("all");
    const [previewLinkData, setPreviewLinkData] = useState([]);
    const [previewLinkLoaded, setPreviewLinkLoaded] = useState(false);
    const [contextMouse, setContextMouse] = useState(initialMouse);
    const [contextLinkData, setContextLinkData] = useState(null);
    const [openParentDescription, setOpenParentDescription] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [viewAnchorEl, setViewAnchorEl] = useState(null);
    const [selectedAction, setSelectedAction] = useState("");
    const [displayQuickSearch, setDisplayQuickSearch] = useState(false);
    const [fullSizeQuickSearch, setFullSizeQuickSearch] = useState(false);
    const [searchContextField, setSearchContextField] = React.useState("");
    const [searchContextAnswer, setSearchContextAnswer] = useState("");
    const [displayContextAnswerWindow, setDisplayContextAnswerWindow] = useState(false);
    const [displayContextAnswer, setDisplayContextAnswer] = useState(false);

    const handleViewClick = (event, action) => {
        setViewAnchorEl(event.currentTarget);
        setSelectedAction(action);
    }

    const handleViewClose = () => {
        setViewAnchorEl(null);
    }

    const [modal, _setModal] = useState({
        "create": newCreateModalProps(false),
        "edit": newEditModalProps(false, null),
        "move": newMoveModalProps(false, []),
        "copy": newCopyModalProps(false, null)
    });

    const setModal = (name) => (newProps) => {
        let newModal = { ...modal };
        newModal[name] = newProps;
        _setModal(newModal);
    }

    const getQueryFormat = (query) => query.split("?")
        .filter(q => q.length > 0)
        .map(s => {
            const [param, value] = s.split("=");
            return {
                param: param,
                value: value
            }
        });

    const queryCheck = (qs, param) => {
        return qs.some(q => q.param === param);
    }

    const getQuery = (qs, param) => {
        return qs.find(q => q.param === param);
    }

    const getDocuments = async (_search = search) => {
        let currentGroup = 0;
        let queries = getQueryFormat(_search);
        if (queryCheck(queries, "fuser")) {
            const userid = getQuery(queries, "fuser");
            if (props.currentUserFilter !== +userid.value) props.SetCurrentUserFilter(userid.value);
        }
        if (queryCheck(queries, "fgroup")) {
            const groupid = getQuery(queries, "fgroup");
            if (groupid.value) {
                currentGroup = +groupid.value;
                props.SetCurrentGroup(+groupid.value);
            }
        }
        // get with 0 for root
        const parentID = id || 0;
        if (props.currentFolder !== parentID) props.SetCurrentFolder(+parentID);
        const response = await Api.getDocumentsByParentID(parentID, currentGroup);
        const _data = response?._json || [];
        const selected = getSelectedRows();
        let currentRootFilter = "all";
        let documents = _data.map((row, i) => {
            let es = selected.find(s => row.documentid === s.documentid);
            row.selected = es ? es.selected : false;
            return row;
        });
        if (queryCheck(queries, "fuser")) {
            const userid = getQuery(queries, "fuser");
            documents = documents.filter(row => {
                return row.user_id === +userid.value;
            });
            currentRootFilter = "self";
        }
        if (queryCheck(queries, "fgroup")) {
            const groupid = getQuery(queries, "fgroup");
            documents = documents.filter(row => {
                return row.group_id === +groupid.value;
            });
            currentRootFilter = +groupid.value;
        }
        setCurrentRootFilter(currentRootFilter);
        setData(documents);
        setDataLoaded(true);
        props.SetLoader(false);
        props.SetTableData(documents);
    }

    const getId = async () => {
        if (id) {
            const response = await Api.getDocument(id);
            const data = response?._json;
            setCurrentParent(data);
            props.SetCurrentFolderData(data);
        }
        else {
            setCurrentParent(null);
            props.SetCurrentFolderData({});
        }
    }

    const clearSelected = () => {
        let newData = data.map(dataItem => {
            return Object.assign({}, dataItem, {
                selected: false
            });
        });
        setData(newData);
        props.SetTableData(newData);
        setSelectedAction("");
    }

    const clearContextField = () => {
        setSearchContextField("");
    }

    const clearAll = () => {
        clearContextField();
        clearSelected();
    }

    // set data from table selection
    const _setData = async (_data) => {
        setData(_data);
        setPreviewLinkLoaded(false);
        setPreviewLinkData([]);
        const selected = getSelectedRows(_data);
        if (selected.length === 1) {
            // query linked items
            // folder get tree
            if (selected[0].algorithmtype === 0) {
                const response = await Api.getDocumentsByParentID(selected[0].documentid, props.currentGroup);
                if (!response) return;
                const children = response?._json || [];
                setPreviewLinkLoaded(true);
                setPreviewLinkData(children);
            }

            // original show the summary linked
            else if (selected[0].algorithmtype === 1) {
                setPreviewLinkLoaded(true);
                setPreviewLinkData(selected[0].child_document_list);
            }

            // summary show original linked
            else if (selected[0].algorithmtype > 1) {
                setPreviewLinkLoaded(true);
                setPreviewLinkData(selected[0].original_document_list);
            }
        }
    }

    useEffect(() => {
        if (!tableDataLoaded) {
            setTableDataLoaded(true);
            getDocuments();
            getId();
        }
    }, [tableDataLoaded]);

    useEffect(() => {
        if (props.refresh) {
            props.SetRefresh(false);
            setTableDataLoaded(false);
        }
    }, [props.refresh]);

    const handleSearchContextChange = (event) => {
        setSearchContextField(event.target.value);
    };

    const getSelectedRows = (_data = props.tableData) => {
        return [..._data].filter(dataItem => dataItem.selected);
    }

    const checkRowsSelected = (_data = data) => {
        const selected = _data.filter(dataItem => dataItem.selected);
        return (selected.length > 0);
    }

    const getQuestionedAnswered = async () => {
        setDisplayContextAnswerWindow(true);
        setDisplayContextAnswer(false);
        const rows = getSelectedRows();
        const ids = rows.map(row => +row.documentid);
        const request = {
            question: searchContextField,
            is_long_form: true,
            compare_document_list: ids
        }
        const response = await Api.getQuestionAnswered(request);
        const json = response._json;
        setSearchContextAnswer(json);
        setDisplayContextAnswer(true);
    }

    const closeContextAnswerWindow = () => {
        setDisplayContextAnswerWindow(false);
    }

    const checkDisplayPreview = () => {
        const selected = getSelectedRows();
        return selected.length === 1;
    }

    const getPreviewData = () => {
        return getSelectedRows()[0];
    }

    const getPreviewHeading = (algorithmtype) => {
        switch (algorithmtype) {
            case 0:
                return "Contents";
            case 1:
                return "Processed File(s)";
            default:
                return "Original File(s)";
        }
    }

    const renderPreviewData = () => {
        const previewData = getPreviewData();
        const Icon = getPreviewIcon(previewData);
        const previewheading = getPreviewHeading(previewData.algorithmtype);
        return (
            <div className={classes.previewcard}>
                <div className={classes.previewheading}>
                    {
                        previewData.algorithmtype === 0 ? "Folder Preview" : "File Preview"
                    }
                </div>
                <div className={classes.previewicon}>
                    <Icon style={{width: "100px", height: "100px"}}/>
                </div>
                <div className={classes.previewname}>
                    {previewData.name}
                </div>
                <div className={classes.linebreak} />
                <div className={classes.previewheading2}>
                    Description
                </div>
                <div className={classes.previewdescription}>
                    {previewData.description.length > 0 ? (
                        previewData.description) : (
                        <span className={classes.descriptionfiller}>
                            No Description
                        </span>
                    )}
                </div>
                <>
                    <div className={classes.previewheading2}>
                        {previewheading}
                    </div>
                    {previewLinkLoaded ? (
                        renderPreviewLink(previewData)
                    ) : (
                        <div className={classes.progressholder}>
                            <CircularProgress />
                        </div>
                        )
                    }
                </>
            </div>
        );
    }

    const handlePreviewContextMenu = (data) => (event) => {
        event.preventDefault();
        setContextLinkData(data);
        setContextMouse({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    }

    const handlePreviewContextMenuClose = () => {
        setContextLinkData(null);
        setContextMouse(initialMouse);
    }

    const renderEmptyPreviewLinkData = () => {
        return (
            <div className={classes.foldercontentpreview}>
                <Typography variant="body2">
                    No files to display
                </Typography>
            </div>
        );
    }

    const renderPreviewLink = (previewData) => {
        if (previewLinkData.length === 0) return renderEmptyPreviewLinkData();
        const {algorithmtype} = previewData;
        // folder: display tree
        if (algorithmtype === 0) {
            return (
                <div className={classes.foldercontentpreview}>
                    {
                        previewLinkData.map(d => {
                            const Icon = getPreviewIcon(d);
                            return (
                                <div className={classes.linkedsummariespreview} key={d.name} onClick={handlePreviewContextMenu(d)} onContextMenu={handlePreviewContextMenu(d)}>
                                    <Icon className={classes.summaryitemicon}
                                          style={{width: "40px", height: "40px"}}
                                    />
                                    <div className={classes.summaryitempreview}>
                                        {d.name}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            );
        }
        else {
            return (
                <>
                    {
                        <div className={classes.foldercontentpreview}>
                            {
                                previewLinkData.map(d => {
                                    const Icon = getPreviewIcon(d);
                                    return (
                                        <div className={classes.linkedsummariespreview} key={d.name} onContextMenu={handlePreviewContextMenu(d)}>
                                            <Icon className={classes.summaryitemicon}
                                                  style={{width: "40px", height: "40px"}}
                                            />
                                            <div className={classes.summaryitempreview}>
                                                {d.name}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    }
                </>
            );
        }
    }

    const onInputUpload = async ({ target }) => {
        // upload with "" for root
        const parentID = id || "";
        const { files } = target;
        // handle 1 doc
        if (files.length === 1) {
            const uploadFile = Object.keys(files).map(key => {
                const file = files[key];
                let wb = files[key].name.split(".");
                file.fileType = "." + wb[wb.length - 1];
                file.parentID = parentID;
                file.group = currentParent ? currentParent.group_id : props.currentGroup;
                return file;
            });
            props.SetModal("upload")(newUploadModalProps(true, uploadFile));
        }
        // handle multiple docs
        else {
            let uploadfiles = Object.keys(files).map(key => {
                const file = files[key];
                let wb = file.name.split(".");
                let fileType = "." + wb[wb.length - 1];
                const newUploadFile = new File([file], file.name, { type: fileType });
                newUploadFile.fileType = fileType;
                newUploadFile.parentID = parentID
                newUploadFile.group = currentParent ? currentParent.group_id : 0;
                return newUploadFile;
            });
            props.UploadFiles(uploadfiles);
        }

        return target.value = null;
    }

    const createUploadButton = () => {
        return (
            <>
                <input
                    className={classes.input}
                    id="upload-document"
                    multiple
                    onChange={onInputUpload}
                    type="file"
                />
                <label htmlFor="upload-document">
                    <Button className={classes.actionbutton}
                            variant="contained"
                            color="secondary"
                            disableElevation
                            startIcon={<PublishIcon />}
                            component="span">
                        Upload
                    </Button>
                </label>
            </>
        );
    }

    const contextActionOnClick = (action) => {
        handleAction(action, [contextLinkData]);
        handlePreviewContextMenuClose();
    }

    const createContextActions = () => {
        let actions;
        switch (contextLinkData.algorithmtype) {
            // folder
            case 0:
                actions = ["view in current tab", "view in new tab", "edit", "delete", "move"];
                break;
            // original
            case 1:
                actions = ["train in current tab", "train in new tab", "download", "edit", "delete", "move"];
                break;
            // processed
            default:
            case 2:
                actions = ["view in current tab", "view in new tab", "edit", "delete", "move"];
                break;
        }
        return actions.map(action => {
            return (
                <MenuItem onClick={() => contextActionOnClick(action)} key={action}>
                    {action}
                </MenuItem>
            );
        });
    }

    const createLeftActions = (classes) => {
        if (displayContextAnswerWindow) {
            return (null);
        }
        let check = checkRowsSelected();
        if (check) {
            return (
                <Tooltip title={"Clear selected rows"}>
                    <IconButton className={classes.actionbutton}
                                variant="contained"
                                onClick={clearAll}
                    >
                        <ClearAllIcon />
                    </IconButton>
                </Tooltip>
            )
        }
        else {
            return (
                <>
                    <div>
                        <Button className={classes.actionbutton}
                                variant="contained"
                                color="secondary"
                                disableElevation
                                startIcon={<AddIcon />}
                                onClick={openCreateCaseModal}
                        >
                            Create Folder
                        </Button>
                    </div>
                    { createUploadButton() }
                </>
            );
        }
    }

    const createActions = (classes) => {
        let selected = getSelectedRows();
        let actions, quicksearch;

        if (selected.length === 0) {
            return null;
        }

        if (selected.length === 1) {
            switch (selected[0].algorithmtype) {
                // folder
                case 0:
                    actions = ["view", "edit", "delete", "move"];
                    quicksearch = false;
                    break;
                // original
                case 1:
                    actions = ["view", "train ai", "ai operation", "compare", "download", "edit", "delete", "move"];
                    quicksearch = true;
                    break;
                // processed
                default:
                case 2:
                    actions = ["view", "compare", "edit", "delete", "move"];
                    quicksearch = true;
                    break;
            }
        }

        if (selected.length > 1) {
            // original documents
            if (selected.every(s => s.algorithmtype === 1)) {
                actions = ["delete", "move", "compare", "ai operation"];
                quicksearch = true;
            }
            // files & folders
            else if (selected.some(s => s.algorithmtype > 0)) {
                actions = ["delete", "move", "compare"];
                quicksearch = true;
            }
            // all folders
            else {
                actions = ["delete", "move"];
                quicksearch = false;
            }
        }

        return (
            <>
                {
                    quicksearch ? (
                        <>
                            <TextField
                                className={classes.quickSearchBar}
                                id="quick-search-bar"
                                placeholder="Quick Search"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={handleSearchContextChange}
                                value={searchContextField}
                                variant="outlined"
                                style={{ width: searchContextField.length > 0 ? ("100%") : ("180px") }}
                            />
                        </>
                    ) : (null)
                }
                {
                    searchContextField.length > 0 ? (
                        <>
                            <Tooltip title={"Clear Quick Search"}>
                                <IconButton className={classes.actionbutton} onClick={clearContextField}>
                                    <BackspaceIcon />
                                </IconButton>
                            </Tooltip>
                            <ActionButton action={"Search"} onClick={getQuestionedAnswered} />
                        </>
                        )
                        : actions.map(action => (
                        <div key={action}>
                            <ActionButton action={action} onClick={(event) => handleAction(action, [], event)} />
                        </div>
                    ))
                }
            </>
        );
    }

    const getSelectedTypeName = () => {
        const selected = data.filter(dataItem => dataItem.selected)[0];
        if (!selected) return undefined;
        return selected.documenttype === 4 ? ("Folder") : ("File");
    }

    const handleDblClick = (selected) => {
        // folder
        if (selected.documenttype === 4) {
            props.SetCurrentFolder(selected.documentid);
            history.push(`${url}/${selected.documentid}${search}`);
            return setTableDataLoaded(false);
        }
        // file
        else {
            props.SetCurrentFolder(selected.documentid);
            return history.push(`${url}?view=${selected.documentid}`);
        }
    }

    const handleAction = (action, selection = [], event) => {
        switch (action) {
            case "view": {
                handleViewClick(event, action);
                break;
            }
            case "train in current tab":
            case "view in current tab": {
                const selected = selection.length > 0 ? selection[0] : data.filter(dataItem => dataItem.selected)[0];
                setViewAnchorEl(null);
                // folder
                if (selected.documenttype === 4) {
                    return history.push(`${url}/${selected.documentid}${search}`);
                }
                // original
                else if (selected.algorithmtype === 1 && selectedAction === "train ai") {
                    return history.push(`${url}${search}?train=${selected.documentid}`);
                }
                // all others
                else {
                    return history.push(`${url}${search}?view=${selected.documentid}`);
                }
            }
            case "train in new tab":
            case "view in new tab": {
                const selected = selection.length > 0 ? selection[0] : data.filter(dataItem => dataItem.selected)[0];
                setViewAnchorEl(null);
                // folder
                if (selected.documenttype === 4) {
                    return window.open(`http://${window.location.host}/#${url}/${selected.documentid}${search}`, '_blank', 'noopener,noreferrer');
                }
                // original
                else if (selected.algorithmtype === 1 && selectedAction === "train ai") {
                    return window.open(`http://${window.location.host}/#${url}${search}?train=${selected.documentid}`, '_blank', 'noopener,noreferrer');
                }
                // all other files
                else {
                    return window.open(`http://${window.location.host}/#${url}${search}?view=${selected.documentid}`, '_blank', 'noopener,noreferrer');
                }
            }
            case "train ai": {
                handleViewClick(event, action);
                break;
            }
            case "compare": {
                const selected = selection.length > 0 ? selection : data.filter(dataItem => dataItem.selected);
                const ids = selected.map(s => s.documentid).join("-");
                return window.open(`http://${window.location.host}/#${url}${search}?search=${ids}`, '_blank', 'noopener,noreferrer');
            }
            case "delete": {
                const selected = selection.length > 0 ? selection : data.filter(dataItem => dataItem.selected);
                deleteCase(selected);
                break;
            }
            case "download": {
                const selected = selection.length > 0 ? selection : data.filter(dataItem => dataItem.selected);
                downloadDocument(selected[0]);
                break;
            }
            case "edit": {
                const selected = selection.length > 0 ? selection : data.filter(dataItem => dataItem.selected);
                setModal("edit")(newEditModalProps(true, selected[0]));
                break;
            }
            case "move": {
                const selected = selection.length > 0 ? selection : data.filter(dataItem => dataItem.selected);
                setModal("move")(newMoveModalProps(true, selected));
                break;
            }
            case "copy": {
                const selected = selection.length > 0 ? selection : data.filter(dataItem => dataItem.selected);
                break;
            }
            case "ai operation": {
                const selected = selection.length > 0 ? selection : data.filter(dataItem => dataItem.selected);
                props.SetModal("aioperation")(newAiOperationModalProps(true, selected));
                break;
            }
        }
        if (["view", "train ai"].includes(action)) return;
        clearSelected();
    }

    const downloadDocument = async (document) => {
        props.SetLoader(true);
        const response = await Api.downloadDocument(document.documentid);
        const json = response?._json;
        props.SetLoader(false);
    }

    const getUrls = () => {
        return url.replace("-", " ").split("/").filter(link => !["", "portfolio"].includes(link));
    }

    const getBreadcrumbHref = () => {
        switch (currentRootFilter) {
            case "all":
                return `/portfolio`;
            case "self":
                return `/portfolio?fuser=${props.userSettings.groups.find(g => g.name === props.userSettings.username)?.id}`;
            default:
                return `/portfolio?fgroup=${props.userSettings.groups.find(g => g.id === currentRootFilter)?.id}`;
        }
    }

    const renderRootBreadcrumbText = () => {
        switch (currentRootFilter) {
            case "all":
                return "All Files";
            case "self":
                return "All My Files";
            default:
                return props.userSettings.groups.find(g => g.id === currentRootFilter)?.name + " Files";
        }
    }

    const getBreadCrumbs = () => {
        if (currentParent === null) return (
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" variant="caption" onClick={breadcrumbMenuOnClick} style={{ fontWeight: "600" }}>
                    {renderRootBreadcrumbText()}
                </Typography>
                <Menu
                    id="breadcrumb-root-menu"
                    anchorEl={anchorElBreadcrumbMenu}
                    keepMounted
                    open={openBreadcrumbMenu}
                    onClose={() => breadcrumbMenuOnClose("")}
                    TransitionComponent={Fade}
                >
                    <MenuItem disabled={currentRootFilter === "all"}
                              onClick={() => breadcrumbMenuOnClose("all")}
                    >
                        All Files
                    </MenuItem>
                    {
                        props.userSettings.groups.map(group => {
                            return (
                                <MenuItem disabled={currentRootFilter === group.id}
                                          onClick={() => breadcrumbMenuOnClose(group.id)}
                                          key={group.id}
                                >
                                    {group.name}
                                </MenuItem>
                            );
                        })
                    }
                </Menu>
            </Breadcrumbs>
        );

        const ids = currentParent.idtreepath.split("/").filter(id => id.length > 0);
        const paths = currentParent.treepath.split("/").filter(id => id.length > 0);
        const urls = [];

        ids.forEach((id, index) => {
            let obj = {
                url: paths[index],
                href: urls.length === 0 ? (`/portfolio/${id}`) : (`${urls[urls.length-1].href}/${id}`)
            }
            urls.push(obj);
        });
        const current = urls.pop();
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to={getBreadcrumbHref}>
                    {renderRootBreadcrumbText()}
                </Link>
                {
                    urls.map(url => (
                        <Link color="inherit" to={`${url.href}${search}`} key={url.href}>
                            {url.url}
                        </Link>
                    ))
                }
                {
                    current ? (
                        <Typography color="textPrimary" variant="caption" style={{ fontWeight: "600" }}>
                            {current.url}
                        </Typography>
                    ) : (null)
                }
            </Breadcrumbs>
        );
    }

    const breadcrumbMenuOnClick = (event) => {
        setAnchorElBreadcrumbMenu(event.currentTarget);
    }

    const breadcrumbMenuOnClose = (action = "") => {
        setAnchorElBreadcrumbMenu(null);
        if (action === "") return;
        setCurrentRootFilter(action);
        setDataLoaded(false);
        switch (action) {
            case "all":
                props.SetCurrentFolder(0);
                history.push(`${url}`);
                setTableDataLoaded(false);
                break;
            // case "self":
            //     history.push(`${url}?fuser=${props.userSettings.id}`);
            //     break;
            default:
                props.SetCurrentFolder(action);
                history.push(`${url}?fgroup=${action}`);
                setTableDataLoaded(false);
                break;
        }
    }

    const filterMenuButtonOnClick = (event) => {
        setAnchorElFilterMenu(event.currentTarget);
    }

    const filterMenuButtonOnClose = (action = "") => {
        if (action.length > 0) setCurrentFilter(action);
        setAnchorElFilterMenu(null);
    }

    const ellipsisButtonOnClick = (event) => {
        setAnchorElEllipsis(event.currentTarget);
    }

    const ellipsisButtonOnClose = (action = "") => {
        handleAction(action);
        setAnchorElEllipsis(null);
    }

    const createEllipsisButton = () => {
        let selected = getSelectedRows();

        if (selected.length === 1 && selected[0].type === "document") {
            return (
                <>
                    <Button className={classes.actionbutton}
                            variant="contained"
                            color="secondary"
                            disableElevation
                            onClick={ellipsisButtonOnClick}
                            style={{ minWidth: "40px" }}
                    >
                        <MoreHorizIcon />
                    </Button>
                    <Menu
                        id="fade-menu"
                        anchorEl={anchorElEllipsis}
                        keepMounted
                        open={openEllipsisMenu}
                        onClose={ellipsisButtonOnClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => ellipsisButtonOnClose("download")}>Download</MenuItem>
                        <MenuItem onClick={() => ellipsisButtonOnClose("rename")}>Rename</MenuItem>
                    </Menu>
                </>
            );
        }

        return (null);
    }

    const getPreviewIcon = (preview) => {
        switch (preview.documenttype) {
            case 1: {
                return DocIcon;
            }
            case 2: {
                return CsvIcon;
            }
            case 3: {
                return SvgPdf;
            }
            case 0:
            case 4: {
                return SvgFolder;
            }
            default: {
                return <></>
            }
        }
    }

    const toggleParentDescription = () => {
        if (openParentDescription) {
            setOpenParentDescription(false);
        }
        else {
            setOpenParentDescription(true);
        }
    }

    const deleteCase = async (selected) => {
        props.SetLoader(true);
        const promises = selected.map(row => {
            return Api.deleteDocument(row.documentid);
        });
        await Promise.all(promises);
        getDocuments();
    }

    const copyCase = async (copycase) => {

    }

    const moveCase = async (group, folder) => {
        props.SetLoader(true);
        const promises = modal["move"].row.map((row) => {
            const updatedCase = {
                documentid: row.documentid,
                description: row.description,
                name: row.name,
                documenttype: row.documenttype,
                group: +group,
                parent: +folder
            }
            return Api.updateDocument(updatedCase);
        });
        await Promise.all(promises);
        setModal("move")({ bool: false, row: null });
        getDocuments();
    }

    const createCase = async (newcase) => {
        props.SetLoader(true);
        // upload with "" for root
        const parentID = currentParent.documentid;
        const groupID = currentParent.group_id;
        const docTypeResponse = await Api.getDocumentType("folder");
        const fileTypeEnum = docTypeResponse._json;
        const formData = new FormData();
        formData.append("name", newcase.name);
        formData.append("description", newcase.description);
        formData.append("documenttype", fileTypeEnum);
        formData.append("parent", parentID);
        formData.append("group", groupID);
        const results = await Api.uploadFile(formData);
        setModal("create")(newCreateModalProps(false));
        getDocuments();
    }

    const openCreateCaseModal = () => {
        // const parentID = id || "";
        // let group = currentParent ?
        //     currentParent.group_id :
        //     (["all", "self"].includes(currentRootFilter)) ?
        //         props.userSettings.groups.find(g => g.name === props.userSettings.username)?.id :
        //         +currentRootFilter;
        setModal("create")(newCreateModalProps(true));
    }

    const handleEditClose = () => {
        setModal("edit")({ bool: false, row: null });
    }

    const editCase = async (newcase) => {
        props.SetLoader(true);
        const updatedCase = {
            documentid: modal["edit"].row.documentid,
            name: newcase.name,
            description: newcase.description,
            documenttype: modal["edit"].row.documenttype,
            parent: modal["edit"].row.parent_id,
            group: modal["edit"].row.group_id,
        }
        const response = await Api.updateDocument(updatedCase);
        setModal("edit")({ bool: false, row: null });
        getDocuments();
    }

    if (!dataLoaded) return (
        <div className={classes.content}>
            <Skeleton height={"100px"} width="calc(100% - 16px)" variant="rect" />
            <Skeleton height={"calc(100% - 110px)"} width="calc(100% - 16px)" variant="rect" style={{marginTop: "10px"}} />
        </div>
    );

    return (
        <div className={classes.content}>
            {
                dataLoaded ? (
                    <>
                        {
                            currentParent ? (
                                <div className={classes.contentheader}>
                                    {currentParent.name}
                                    <div className={classes.floatRight}>
                                        <IconButton size="small"
                                                    onClick={toggleParentDescription}
                                        >
                                            {
                                                openParentDescription ? (
                                                    <KeyboardArrowDownIcon />
                                                ) : (
                                                    <KeyboardArrowUpIcon />
                                                )
                                            }
                                        </IconButton>
                                    </div>
                                </div>
                            ) : (
                                <div className={classes.contentheader}>
                                    File Manager
                                </div>
                            )
                        }
                        {
                            openParentDescription ? (
                                <div className={classes.contentheaderdescription}>
                                    {currentParent.description.length > 0 ? (
                                        currentParent.description
                                    ) : (
                                        <span className={classes.descriptionfiller}>
                                            No description
                                        </span>
                                    )}
                                </div>
                            ) : (null)
                        }
                        <div className={classes.contentview} style={{height: openParentDescription ? ("calc(100% - 80px)") : ("calc(100% - 40px)")}}>
                            <div style={{ height: "100%", width: "100%" }}>
                                <div className={classes.contentviewleft}>
                                    <div className={classes.contentcard}>
                                        <div className={classes.contentcardtitle}>
                                            {getBreadCrumbs()}
                                        </div>
                                        <div className={classes.contentcardactions}>
                                            <div className={classes.leftactions}>
                                                { createLeftActions(classes) }
                                                { createActions(classes) }
                                                { createEllipsisButton() }
                                            </div>
                                            <div className={classes.rightactions}>
                                                <div>
                                                    <IconButton size="small"
                                                                onClick={filterMenuButtonOnClick}
                                                    >
                                                        <FilterListIcon />
                                                    </IconButton>
                                                    <Menu
                                                        id="fade-menu"
                                                        anchorEl={anchorElFilterMenu}
                                                        keepMounted
                                                        open={openFilterMenu}
                                                        onClose={filterMenuButtonOnClose}
                                                        TransitionComponent={Fade}
                                                    >
                                                        <MenuItem disabled={currentFilter === "all"}
                                                                  onClick={() => filterMenuButtonOnClose("all")}
                                                        >
                                                            All
                                                        </MenuItem>
                                                        <MenuItem disabled={currentFilter === "originals"}
                                                                  onClick={() => filterMenuButtonOnClose("originals")}
                                                        >
                                                            Originals
                                                        </MenuItem>
                                                        <MenuItem disabled={currentFilter === "processed"}
                                                                  onClick={() => filterMenuButtonOnClose("processed")}
                                                        >
                                                            Processed
                                                        </MenuItem>
                                                    </Menu>
                                                </div>

                                                <div className={classes.actionfiller}/>

                                                <div>
                                                    <IconButton size="small">
                                                        <MoreVertIcon/>
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={classes.contencardbody}>
                                            {
                                                displayContextAnswerWindow ? (
                                                    <>
                                                        <div>
                                                            <IconButton onClick={closeContextAnswerWindow}>
                                                                <ArrowBackIcon />
                                                            </IconButton>
                                                        </div>
                                                        <div className={classes.contextAnswer}>
                                                            <Typography variant="h6" style={{padding: "0 20px"}}>
                                                                Answer:
                                                            </Typography>
                                                            {
                                                                displayContextAnswer ?
                                                                    (
                                                                        <>
                                                                            <div style={{padding: "4px 20px", borderBottom: "1px solid rgba(150, 150, 150, 0.2)"}}>
                                                                                { searchContextAnswer.answer }
                                                                            </div>
                                                                            <Typography variant="h6" style={{padding: "0 20px"}}>
                                                                                Context:
                                                                            </Typography>
                                                                            {
                                                                                searchContextAnswer.context_paragraph_list.map(p => {
                                                                                    return (
                                                                                        <div style={{padding: "4px 20px", borderBottom: "1px solid rgba(150, 150, 150, 0.2)"}}>
                                                                                            {
                                                                                                p.sentence_list.map((s, i) => {
                                                                                                    return (
                                                                                                        <span>
                                                                                                            { s.text } { i === (p.sentence_list.length - 1) ? "" : " " }
                                                                                                        </span>
                                                                                                    );
                                                                                                })
                                                                                            }
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </>
                                                                    ) :
                                                                    (
                                                                        <Skeleton width={"100%"} height={"300px"} variant="rect" />
                                                                    )
                                                            }
                                                        </div>
                                                    </>
                                                ) : (
                                                    <PortfolioTable data={props.tableData} setData={_setData} currentFilter={currentFilter} handleDblClick={handleDblClick} />
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                (checkDisplayPreview() && !displayContextAnswerWindow) ? (
                                    <div style={{ height: "100%" }}>
                                        <div className={classes.contentviewright}>
                                            {renderPreviewData()}
                                        </div>
                                    </div>
                                ) : (null)
                            }
                        </div>
                    </>
                ) : (
                    <CircularProgress size={100} />
                )
            }

            {
                contextMouse.mouseY !== null && contextMouse.mouseX !== null ? (
                    <Menu keepMounted
                          open={contextMouse.mouseY !== null}
                          onClose={handlePreviewContextMenuClose}
                          anchorReference="anchorPosition"
                          anchorPosition={
                              contextMouse.mouseY !== null && contextMouse.mouseX !== null ?
                                  { top: contextMouse.mouseY, left: contextMouse.mouseX }
                                  : undefined
                          }
                    >
                        {createContextActions()}
                    </Menu>
                ) : (null)
            }
            <EditCaseModal open={modal["edit"].bool}
                           handleSave={editCase}
                           handleClose={handleEditClose}
                           case={modal["edit"].row}
            />
            <CaseModal open={modal["create"].bool}
                       handleSave={createCase}
                       handleClose={() => setModal("create")(newCreateModalProps(false))}
                       currentGroup={modal["create"].currentGroup}
                       parentID={modal["create"].parentID}
            />
            <FolderTreeModal open={modal["move"].bool}
                             handleSave={moveCase}
                             handleClose={() => setModal("move")(newMoveModalProps(false, []))}
                             case={modal["move"].row}
                             title={`Move ${getSelectedTypeName()}`}
            />
            <FolderTreeModal open={modal["copy"].bool}
                             handleSave={copyCase}
                             handleClose={() => setModal("copy")(newCopyModalProps(false, null))}
                             case={modal["copy"].row}
                             title={`Copy ${getSelectedTypeName()}`}
            />
            <Menu
                id="view-selection-menu"
                anchorEl={viewAnchorEl}
                keepMounted
                open={Boolean(viewAnchorEl)}
                onClose={handleViewClose}
            >
                <MenuItem onClick={() => handleAction("view in current tab")}>In Current Tab</MenuItem>
                <MenuItem onClick={() => handleAction("view in new tab")}>In New Tab</MenuItem>
            </Menu>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PortfolioView));
