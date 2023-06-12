import React from "react";
import { Link } from 'react-router-dom';
import { borders } from "../styles/styles";
import { withStyles } from "@material-ui/core/styles";
import Root from "../Containers/Root";
import Content from "../Containers/Content";
import ContentHeader from "../Containers/ContentHeader";
import Footer from "../Containers/Footer";
import {createCase, createDocument, fakeDataSetup } from "../../models/createData";
import Nav from "../Nav/Nav";
import NavSkeleton from "../Nav/NavSkeleton";
import Skeleton from "@material-ui/lab/Skeleton";
import FolderIcon from '@material-ui/icons/Folder';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Button from "@material-ui/core/Button";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TextField from '@material-ui/core/TextField';
import Dropzone from "../Dropzone/DropZone";
import Typography from "@material-ui/core/Typography";
import CaseModal from "../Modal/CaseModal";
import {Api} from "../Api";
import {connect} from "react-redux";
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import {getFileTypeIcon, getDocumentIcon, initHomeTableData, getUserGroup} from "../utils/utils";
import {SetModal} from "../../modules/modalManager/modalManager";
import newUploadModalProps from "../NewProps/newUploadModalProps";
import Popover from '@material-ui/core/Popover';
import {SetRefresh, UploadFiles} from "../../modules/fileManager/fileManager";
import {openContextMenu} from "../../modules/contextMenuManager/contextMenuManager";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from "../TabPanel/TabPanel";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { SetLoader } from "../../modules/fileManager/fileManager";
import { SetTableData, SetCurrentGroup, SetCurrentUserFilter,
    SetCurrentFolder, SetCurrentFolderData, SetCurrentPage,
    SetCurrentRowsPerPage, ToggleTableRowSelected, SetTableRowsSelected, SetLastSelectedIndex, SetCurrentDocumentId } from "../../modules/tableManager/tableManager";
import PortfolioCard from "../Portfolio/PortfolioCard";

const mapDispatchToProps = (dispatch) => {
    return {
        UploadFiles: files => dispatch(UploadFiles(files)),
        SetTableData: data => dispatch(SetTableData(data)),
        SetCurrentUserFilter: int => dispatch(SetCurrentUserFilter(int)),
        SetCurrentGroup: int => dispatch(SetCurrentGroup(int)),
        SetCurrentFolder: int => dispatch(SetCurrentFolder(int)),
        SetCurrentFolderData: int => dispatch(SetCurrentFolderData(int)),
        SetCurrentPage: int => dispatch(SetCurrentPage(int)),
        SetCurrentRowsPerPage: int => dispatch(SetCurrentRowsPerPage(int)),
        SetCurrentDocumentId: int => dispatch(SetCurrentDocumentId(int)),
        SetRefresh: bool => dispatch(SetRefresh(bool)),
        SetModal: name => props => dispatch(SetModal(name)(props)),
        openContextMenu: (x, y, actions, handleActions) => dispatch(openContextMenu(x, y, actions, handleActions)),
        SetLoader: bool => dispatch(SetLoader(bool)),
        ToggleTableRowSelected: (data, index) => dispatch(ToggleTableRowSelected(data, index)),
        SetTableRowsSelected: (data, indices, bool) => dispatch(SetTableRowsSelected(data, indices, bool)),
        SetLastSelectedIndex: int => dispatch(SetLastSelectedIndex(int)),
    }
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableManager.tableData,
        currentFolder: state.tableManager.currentFolder,
        currentFolderData: state.tableManager.currentFolderData,
        currentUserFilter: state.tableManager.currentUserFilter,
        currentGroup: state.tableManager.currentGroup,
        currentPage: state.tableManager.currentPage,
        rowsPerPage: state.tableManager.rowsPerPage,
        selectedRows: state.tableManager.selectedRows,
        userSettings: state.sessionManager.userSettings,
        refresh: state.fileManager.refresh,
        contextMenuBool: state.contextMenuManager.bool,
    }
}

const styles = (theme) => ({
    usercard: {
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        boxSizing: "border-box",
        padding: "0",
        overflow: "visible",
        background: theme.palette.background.paper,
    },
    usercardleft: {
        width: "164px",
        padding: "8px",
        boxSizing: "border-box",
    },
    usercardgroups: {
        display: "flex",
        "& span": {
            display: "flex",
            padding: "2px",
            borderRadius: "20px",
            background: "rgb(235, 235, 235)",
            "& * ~ *": {
                marginLeft: "4px"
            }
        }
    },
    usercardright: {
        width: "calc(100% - 164px)",
        padding: "8px",
        boxSizing: "border-box",
    },
    usercardedit: {
        position: "absolute",
        right: "8px",
        top: "8px"
    },
    blankcard: {
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "row",
        "& $leftcard": {
            flex: "50%",
            marginRight: "4px"
        },
        "& $rightcard": {
            flex: "50%",
            marginLeft: "4px"
        }
    },
    leftcard: {},
    rightcard: {},
    homecard: {
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
        padding: "0",
        overflow: "visible",
        background: theme.palette.background.paper,
        border: borders.border,
        boxShadow: theme.shadows[2],
        flex: "1"
    },
    homecardstorage: {
        position: "absolute",
        right: "8px",
        top: "8px",
        ...theme.typography.subtitle2,
        "& * ~ *": {
            marginLeft: "8px"
        }
    },
    homecardtitle: {
        height: "42px",
        width: "100%",
        flex: "0 0 42px",
        padding: "0 8px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: theme.palette.text.primary,
        ...theme.typography.h5
    },
    homecardbody: {
        height: "auto",
        minHeight: "42px",
        width: "calc(100% - 16px)",
        overflowX: "auto",
        overflowY: "auto",
        boxSizing: "border-box",
        marginLeft: "8px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    quickstart: {
        paddingTop: "16px",
        textAlign: "center",
        ...theme.typography.h4,
        flex: "0 0 64px"
    },
    foldercard: {
        alignItems: "center",
        width: "150px",
        flex: "0 0 150px",
        height: "116px",
        "&:nth-child(even)": {
            backgroundColor: "rgba(0, 0, 0, 0.04)"
        },
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        },
    },
    folderlink: {
        height: "100%",
        margin: "0 8px",
        padding: "16px 0",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...theme.typography.body2,
        color: theme.palette.text.primary,
        textDecoration: "none"
    },
    foldericon: {
        width: "58px",
        height: "58px",
        color: "#F8D775"
    },
    foldername: {
        width: "100%",
        height: "20px",
        textAlign: "center",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: "4px",
    },
    cardbodyfiller: {
        height: "48px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...theme.typography.body1
    },
    cardactions: {
        flex: "0 0 64px",
        height: "64px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxSizing: "border-box"
    },
    activeView: {
        padding: "0 24px"
    },
    casenamefield: {
        width: "400px",
        marginLeft: "calc(50% - 200px)"
    },
    actioncancel: {
        marginRight: "6px",
        backgroundColor: "#fff"
    },
    actionconfirm: {
        backgroundColor: theme.palette.green["500"],
        "&:hover": {
            backgroundColor: theme.palette.green["300"]
        }
    },
    clickable: {
        cursor: "pointer"
    },
    titleLink: {
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)"
        }
    },
    groupPopover: {
        minWidth: "150px",
        padding: "16px 24px",
        textAlign: "center",
        "& .avatarContainer": {
            width: "100%",
            display: "flex",
            justifyContent: "center"
        },
        "& .editButton": {
            position: "absolute",
            top: "2px",
            right: "2px"
        }
    },
    flex: {
        display: "flex"
    },
    groupSkeleton: {
        "& .MuiSkeleton-circle": {
            marginRight: "4px"
        }
    },
    usertitle_outer: {
        fontWeight: "600",
        fontSize: "12px",
        textTransform: "uppercase",
        marginBottom: "2px",
        color: "#696969",
    },
    usertitle_inner: {
        fontSize: "18px",
        color: "#000"
    },
    filemanagertabs: {
        boxShadow: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
        height: "49px"
    },
    filemanager_selectedtab: {
        width: "100%",
        height: "calc(100% - 91px)",
        padding: "8px",
        boxSizing: "border-box"
    },
    selectedtab_breadcrumb: {
        height: "22px",
    },
    selectedtab_table: {
        height: "calc(100% - 74px)"
    },
    selectedtab_tablehead: {
        position: "sticky",
        top: "0",
        background: "#fff"
    },
    tablerow_name: {
        display: "flex",
        alignItems: "center"
    },
    tablerow_selected: {
        background: "#bad9ff"
    },
    tableicon: {
        width: "20px",
        height: "20px",
        marginRight: "6px"
    }
});

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const OPEN_FOLDER = "OPEN_FOLDER";
const DOWNLOAD_FILE = "DOWNLOAD_FILE";
const VIEW_FILE = "VIEW_FILE";
const OPEN_FILE_LOCATION = "OPEN_FILE_LOCATION";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this._props = {...props};
        delete this._props.classes;
        this.state = {
            dataLoaded: false,
            tableDataLoaded: false,
            createCaseBool: false,
            quickStart: false,
            getStarted: false,
            activeStep: 0,
            steps: ["Create a case", "Upload a document", "View & Manage Portfolio"],
            caseName: "",
            stepperCase: null,
            groupPopover: -1,
            contextFileData: {},
            selectedTab: 0,
            // root 0 or folder id
            currentFolder: this.props.currentFolder,
            userGroups: this.props.userSettings?.groups.map(group => {
                return {
                    ...group,
                    open: false,
                    persist: false,
                    loaded: false,
                    json: null,
                    anchorEl: React.createRef(null)
                }
            })
        }
        this.lastSelectedIndex = 0;
    }

    getData = async (currentGroup) => {
        this.props.SetLoader(true);
        let currentFolderData = {};
        // if parent exists get parent info
        if (this.props.currentFolder > 0) {
            const response = await Api.getDocument(this.props.currentFolder);
            currentFolderData = response?._json;
        }
        const response = await Api.getDocumentsByParentID(this.props.currentFolder, currentGroup);
        let data = response?._json;
        // keep selected rows
        this.props.selectedRows.forEach(row => {
            let index = data.findIndex(r => r.documentid === row.documentid);
            if (index > -1) {
                data[index].selected = true;
            }
        });

        this.props.SetTableData(data);
        this.props.SetCurrentFolderData(currentFolderData);
        this.props.SetLoader(false);
    }

    componentWillUnmount() {
        window.removeEventListener(("keydown"), this.onKeyDown);
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
        // disect url
        const tableData = initHomeTableData(this.props.location.search);
        // no group filter set the filter
        if (!tableData.groupfilter) {
            const group = this.props.currentGroup ?? getUserGroup(this.props.userSettings);
            return this.props.history.push(`/?fgroup=${group}`);
        }
        // check store matches url
        else if (!this.checkUrlStoreMatch(tableData)) {
            return this.props.SetCurrentGroup(tableData.groupfilter.value);
        }
        // url matches store, load data
        else {
            this.initData(+tableData.groupfilter.value);
        }
    }

    componentDidUpdate(prevProps) {
        // disect url
        const tableData = initHomeTableData(this.props.location.search);
        // no group filter set the filter
        if (!tableData.groupfilter) {
            const group = getUserGroup(this.props.userSettings);
            return this.props.history.push(`/?fgroup=${group}`);
        }
        // check store matches url
        else if (!this.checkUrlStoreMatch(tableData)) {
            return this.props.SetCurrentGroup(tableData.groupfilter.value);
        }
        // force refresh
        else if (this.props.refresh) {
            this.props.SetRefresh(false);
            return this.setState({
                tableDataLoaded: false
            });
        }
        // table data not loaded and url matches
        else if (this.state.tableDataLoaded === false && this.checkUrlStoreMatch(tableData)) {
            this.setState({
                tableDataLoaded: true
            }, () => {
                this.initData(+tableData.groupfilter.value);
            });
        }
    }

    onKeyDown = (e) => {
        if (e.key === "Shift" && e.shiftKey) {
            document.onselectstart = function() {
                return false;
            }
            window.addEventListener("keyup", this.onKeyUp);
        }
    }

    onKeyUp = (e) => {
        document.onselectstart = function() {
            return true;
        }
        window.removeEventListener("keyup", this.onKeyUp);
    }

    // returns true if store matches false if stores doesnt match
    checkUrlStoreMatch = (tableData) => {
        let groupid = +tableData.groupfilter.value;
        return groupid === this.props.currentGroup;
    }

    getSelectedTab = () => {
        let groupid = this.props.currentGroup;
        let index = this.props.userSettings.groups.findIndex(g => g.id === groupid);
        return index;
    }

    initData = (currentGroup) => {
        // dataLoaded false, toggle true then init
        if (!this.state.dataLoaded) {
            this.setState({
                dataLoaded: true
            }, () => {
                this.getData(currentGroup);
            });
        }
        else {
            this.getData(currentGroup);
        }
    }

    getPortfolioTitle = (classes, title, link) => {
        return (
            <Link className={`${classes.homecardtitle} ${classes.titleLink}`}
                  to={`/portfolio${link}`}
            >
                {title}
                {/*<div className={classes.homecardstorage}>*/}
                {/*    <span>*/}
                {/*        Used: 2GB*/}
                {/*    </span>*/}
                {/*    <span>*/}
                {/*        Free: 13GB*/}
                {/*    </span>*/}
                {/*</div>*/}
            </Link>
        );
    }

    updateTableData = (_data) => {
        const indices = [];
        _data.forEach((r, i) => {
            if (r.selected) indices.push(i);
        });
        this.props.SetTableRowsSelected(this.props.tableData, indices, true);
    }

    handleTabChange = (event, newValue) => {
        this.props.SetTableData([]);
        this.props.SetCurrentFolder(0);
        this.props.SetCurrentFolderData({});
        this.props.SetCurrentPage(0);
        const tab = this.props.userSettings.groups[newValue];
        this.props.SetCurrentGroup(tab.id);
        this.props.history.push(`/?fgroup=${tab.id}`);
        this.setState({
            tableDataLoaded: false
        });
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: event.target.value,
            currentPage: 0
        });
        this.props.SetCurrentRowsPerPage(event.target.value);
        this.props.SetCurrentPage(0);
    }


    handleSelectRow = (index) => (event) => {
        this.props.ToggleTableRowSelected(this.props.tableData, this.props.currentPage * this.props.rowsPerPage + index);

        let last = this.lastSelectedIndex;
        let _data = this.props.tableData.map(d => Object.assign({}, {...d}));
        const current = index;

        if (!event.nativeEvent.shiftKey) {
            this.lastSelectedIndex = last = current;
            this.props.SetLastSelectedIndex(this.lastSelectedIndex);
        }

        if (!event.nativeEvent.ctrlKey) {
            _data.forEach(item => (item.selected = false));
        }

        const select = !this.props.tableData[index].selected;
        for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
            _data[i].selected = select;
        }
        this.updateTableData(_data);
    }

    handleDoubleClickRow = (row) => {
        // folder
        if (row.documenttype === 4) {
            this.props.SetCurrentFolder(row.documentid);
            this.props.SetTableData([]);
            this.props.SetCurrentFolderData({});
            this.props.SetCurrentPage(0);
            this.setState({
                tableDataLoaded: false
            });
        }
        // file
        else {
            this.props.SetCurrentDocumentId(row.documentid);
            return this.props.history.push(`/portfolio?view=${row.documentid}`);
        }
    }

    handleChangePage = (event, newPage) => {
        this.props.SetCurrentPage(newPage);
    }

    returnToPreviousFolder = () => {
        const parent_id = this.props.currentFolderData?.parent_id || 0;
        this.setState({
            tableDataLoaded: false
        }, () => {
            this.props.SetTableData([]);
            this.props.SetCurrentFolder(parent_id);
            this.props.SetCurrentFolderData({});
            this.props.SetCurrentPage(0);
        });
    }

    routeToCurrentLocation = () => {
        let { currentFolder, currentGroup, currentUserFilter } = this.props;
        let string = "/portfolio";
        if (currentFolder > 0) {
            string = string + `/${currentFolder}`;
        }
        if (currentGroup > 0) {
            string = string + `?fgroup=${currentGroup}`;
        }
        if (currentUserFilter > 0) {
            string = string + `?fuser=${currentUserFilter}`;
        }
        this.props.history.push(string);
    }

    quickStartCreateCase = () => {
        fakeDataSetup.id++;
        const newCase = createCase({ name: this.state.caseName, company: "None", id: fakeDataSetup.id });
        this.setState(oldState => ({
            activeStep: oldState.activeStep + 1,
            stepperCase: newCase,
            data: [newCase]
        }), () => {
            fakeDataSetup.updateData(this.state.data);
        });
    }

    modalCreateCase = (fields) => {
        fakeDataSetup.id++;
        const newCase = createCase({ ...fields, id: fakeDataSetup.id });
        this.setState(oldState => ({
            createCaseBool: false,
            data: [...oldState.data, newCase]
        }), () => {
            fakeDataSetup.updateData(this.state.data);
        });
    }

    cancelQuickStart = () => {
        this.setState({
            quickStart: false
        });
    }

    confirmQuickStart = () => {
        this.setState({
             getStarted: true
        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClose = () => {
        this.setState({
            createCaseBool: false
        });
    }

    handleOpen = () => {
        this.setState({
            createCaseBool: true
        });
    }

    addFiles = (files) => {
        let loaded = 0;
        files.forEach((f, i) => {
            const reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = (e) => {
                loaded = loaded + 1;
                let wb = files[i].name.split(".");
                files[i].fileType = "." + wb[wb.length - 1];
                files[i].parentID = this.props.currentFolder === 0 ? "" : this.props.currentFolder;
                files[i].group = this.props.currentGroup;

                if (loaded === files.length) {
                    if (files.length > 1) {
                        const uploadfiles = [];
                        files.forEach(file => {
                            const newUploadFile = new File([file], file.name, { type: file.type });
                            newUploadFile.description = file.description;
                            newUploadFile.fileType = file.fileType;
                            newUploadFile.parentID = file.parentID;
                            newUploadFile.group = file.group;
                            uploadfiles.push(newUploadFile);
                        });
                        this.props.UploadFiles(uploadfiles);
                    }
                    else {
                        this.props.SetModal("upload")(newUploadModalProps(true, files));
                    }
                }
            }
        });

        // reader.readAsDataURL(files[0]);
        // reader.onload = (e) => {
        //     let wb = files[0].name.split(".");
        //     files[0].fileType = "." + wb[wb.length - 1];
        //     files[0].parentID = "";
        //     files[0].group = this.props.userSettings.groups.find(g => g.name === this.props.userSettings.username)?.id;
        //     this.props.SetModal("upload")(newUploadModalProps(true, files));
        // }
    }

    getUserGroupData = async (g, index) => {
        let userGroups = [...this.state.userGroups];
        if (userGroups[index].json !== null) return;
        let promises = [];
        promises[0] = Api.getUsersForGroup(g.id);
        promises[1] = Api.getDocumentsForGroup(g.id);
        const results = await Promise.all(promises);
        const userList = results[0]._json.length;
        const [files, folders, processed] = results[1]._json.reduce((arr, doc) => {
            if ([2, 3].includes(doc.algorithmtype)) {
                arr[2].push(doc);
            }
            else if (doc.algorithmtype === 1) {
                arr[0].push(doc);
            }
            else {
                arr[1].push(doc);
            }
            return arr;
        }, [[], [], []]);
        userGroups.splice(index, 1, Object.assign({}, g, {
            open: true,
            json: {
                users: userList,
                files: files.length,
                folders: folders.length,
                processed: processed.length,
            }
        }));
        this.setState({
            userGroups: userGroups
        });
    }

    handleGroupPopoverMouseEnter = (g) => (e) => {
        return;
        let userGroups = [...this.state.userGroups];
        let index = userGroups.findIndex(group => group.id === g.id);
        userGroups.splice(index, 1, Object.assign({}, g, {
            open: true
        }));
        this.setState({
            groupPopover: index,
            userGroups: userGroups
        });
        this.getUserGroupData(g, index);
    }

    handleGroupPopoverMouseLeave = (g) => (e) => {
        return;
        if (g.persist) return;
        let userGroups = [...this.state.userGroups];
        let index = userGroups.findIndex(group => group.id === g.id);
        userGroups.splice(index, 1, Object.assign({}, g, {
            ...g,
            open: false
        }));
        this.setState({
            userGroups: userGroups,
            groupPopover: -1,
        });
    }

    handleGroupManage = (g) => (e) => {

    }

    handleGroupPopoverOnClick = (g) => (e) => {
        let userGroups = [...this.state.userGroups];
        let index = userGroups.findIndex(group => group.id === g.id);
        userGroups.splice(index, 1, Object.assign({}, g, {
            ...g,
            open: true,
            persist: true
        }));
        this.setState({
            userGroups: userGroups,
            groupPopover: index,
        });
    }

    handleGroupPopoverOnClose = (g) => (e) => {
        let userGroups = [...this.state.userGroups];
        let index = userGroups.findIndex(group => group.id === g.id);
        userGroups.splice(index, 1, Object.assign({}, g, {
            ...g,
            open: false,
            persist: false
        }));
        this.setState({
            userGroups: userGroups
        });
    }

    handleFileContextMenu = (data) => (event) => {
        const x = event.clientX - 2;
        const y = event.clientY - 4;
        let actions = [];
        if (data?.algorithmtype === 0) {
            actions = ["open folder"];
        }
        else if (data?.algorithmtype === 1) {
            actions = ["download file", "open file location"];
        }
        else if (data?.algorithmtype > 1) {
            actions = ["view file", "open file location"];
        }
        else {
            return;
        }
        this.setState({
            contextFileData: data
        });
        this.props.openContextMenu(x, y, actions, this.handleContextActionOnClick);
    }

    handleContextActionOnClick = (action) => {
        switch (action) {
            case "open folder":
                return this.props.history.push(`/portfolio/${this.state.contextFileData?.documentid}`);
            case "download file":
                return Api.downloadDocument(this.state.contextFileData?.documentid);
            case "open file location":
                return this.props.history.push(`/portfolio`);
            case "view file":
                return this.props.history.push(`/portfolio?view=${this.state.contextFileData?.documentid}`);
            default:
                return;
        }
    }

    render() {
        const { classes } = this.props;

        if (!this.state.dataLoaded) return (
            <Root>
                <NavSkeleton full={true}/>
                <Content>
                    <div className={classes.flex} style={{width: "100%"}}>
                        <Skeleton variant="circle" width={100} height={100} />
                        <div style={{marginLeft: "6px"}}>
                            <Skeleton height={32} width={200}/>
                            <Skeleton height={32} width={200}/>
                            <div className={`${classes.flex} ${classes.groupSkeleton}`}>
                                <Skeleton variant="circle" height={24} width={24}/>
                                <Skeleton variant="circle" height={24} width={24}/>
                                <Skeleton variant="circle" height={24} width={24}/>
                                <Skeleton variant="circle" height={24} width={24}/>
                                <Skeleton variant="circle" height={24} width={24}/>
                            </div>
                        </div>
                    </div>
                    <Skeleton height={32} width="calc(100% - 16px)"/>
                    <Skeleton height={100} width="calc(100% - 16px)"/>
                    <Skeleton height={32} width="calc(100% - 16px)"/>
                    <Skeleton height={100} width="calc(100% - 16px)"/>
                    <Skeleton height={32} width="calc(100% - 16px)"/>
                    <Skeleton height={100} width="calc(100% - 16px)"/>
                    <Skeleton height={32} width="calc(100% - 16px)"/>
                    <Skeleton height={100} width="calc(100% - 16px)"/>
                    <Skeleton height={32} width="calc(100% - 16px)"/>
                    <Skeleton height={100} width="calc(100% - 16px)"/>
                    <Skeleton height={32} width="calc(100% - 16px)"/>
                    <Skeleton height={100} width="calc(100% - 16px)"/>
                    <Skeleton height={32} width="calc(100% - 16px)"/>
                    <Skeleton height={100} width="calc(100% - 16px)"/>
                </Content>
                <Footer/>
            </Root>
        );

        const selectedTab = this.getSelectedTab();

        return (
            <Root>
                <Nav title={this.props.userSettings?.first_name} {...this._props} full={true} />
                <Content>
                    <ContentHeader>
                        Dashboard
                    </ContentHeader>
                    {/*<div className={classes.blankcard} style={{flex: "1 0 260px"}}>*/}

                    {/*    <div className={`${classes.homecard} ${classes.leftcard}`}>*/}
                    {/*        <div className={classes.homecardtitle}>*/}
                    {/*            Profile*/}
                    {/*        </div>*/}
                    {/*        <div className={classes.usercard}>*/}

                    {/*            <div className={classes.usercardleft}>*/}
                    {/*                <Avatar style={{width: "148px", height: "148px", fontSize: "49px"}}>*/}
                    {/*                    {this.props.userSettings?.first_name[0]}*/}
                    {/*                </Avatar>*/}
                    {/*            </div>*/}
                    {/*            <div className={classes.usercardright}>*/}
                    {/*                <Typography variant="body2" className={classes.usertitle_outer}>*/}
                    {/*                    USERNAME*/}
                    {/*                </Typography>*/}
                    {/*                <Typography variant="body2" className={classes.usertitle_inner}>*/}
                    {/*                    {this.props.userSettings?.username}*/}
                    {/*                </Typography>*/}

                    {/*                <Typography variant="body2" className={classes.usertitle_outer}>*/}
                    {/*                    FULL NAME*/}
                    {/*                </Typography>*/}
                    {/*                <Typography variant="body2" className={classes.usertitle_inner}>*/}
                    {/*                    {this.props.userSettings?.first_name} {this.props.userSettings?.last_name}*/}
                    {/*                </Typography>*/}

                    {/*                <Typography variant="body2" className={classes.usertitle_outer}>*/}
                    {/*                    EMAIL*/}
                    {/*                </Typography>*/}
                    {/*                <Typography variant="body2" className={classes.usertitle_inner}>*/}
                    {/*                    {this.props.userSettings?.email}*/}
                    {/*                </Typography>*/}

                    {/*                <Typography variant="body2" className={classes.usertitle_outer}>*/}
                    {/*                    GROUPS*/}
                    {/*                </Typography>*/}
                    {/*                <div className={classes.usercardgroups}>*/}
                    {/*            <span>*/}
                    {/*                {*/}
                    {/*                    this.state.userGroups.map((g, index) => {*/}
                    {/*                        return (*/}
                    {/*                            <ClickAwayListener key={g.id} onClickAway={this.handleGroupPopoverOnClose(g)}>*/}
                    {/*                                <React.Fragment>*/}
                    {/*                                    <div onMouseEnter={this.handleGroupPopoverMouseEnter(g)}*/}
                    {/*                                         onMouseLeave={this.handleGroupPopoverMouseLeave(g)}>*/}
                    {/*                                        <Avatar ref={g.anchorEl}*/}
                    {/*                                        >*/}
                    {/*                                            {g.name[0]}*/}
                    {/*                                        </Avatar>*/}
                    {/*                                        <Popover*/}
                    {/*                                            id={g.id}*/}
                    {/*                                            open={g.open && this.state.groupPopover === index && g.json !== null}*/}
                    {/*                                            anchorEl={g.anchorEl?.current}*/}
                    {/*                                            onClose={this.handleGroupPopoverOnClose(g)}*/}
                    {/*                                            anchorOrigin={{*/}
                    {/*                                                vertical: 'bottom',*/}
                    {/*                                                horizontal: 'center',*/}
                    {/*                                            }}*/}
                    {/*                                            transformOrigin={{*/}
                    {/*                                                vertical: 'top',*/}
                    {/*                                                horizontal: 'center',*/}
                    {/*                                            }}*/}
                    {/*                                            PaperProps={{ style: { pointerEvents: "all" }, className: classes.groupPopover }}*/}
                    {/*                                            style={{ pointerEvents: "none" }}*/}
                    {/*                                        >*/}
                    {/*                                            {*/}
                    {/*                                                // <IconButton className="editButton" onClick={this.handleGroupManage(g)}>*/}
                    {/*                                                //     <EditIcon/>*/}
                    {/*                                                // </IconButton>*/}
                    {/*                                            }*/}
                    {/*                                            <div className="avatarContainer">*/}
                    {/*                                                <Avatar style={{width: "98px", height: "98px"}}>*/}
                    {/*                                                    {g.name[0]}*/}
                    {/*                                                </Avatar>*/}
                    {/*                                            </div>*/}
                    {/*                                            <Typography>*/}
                    {/*                                                {g.name}*/}
                    {/*                                            </Typography>*/}
                    {/*                                            <Typography>*/}
                    {/*                                                {g.json?.users} Members*/}
                    {/*                                            </Typography>*/}
                    {/*                                        </Popover>*/}
                    {/*                                    </div>*/}
                    {/*                                </React.Fragment>*/}
                    {/*                            </ClickAwayListener>*/}
                    {/*                        );*/}
                    {/*                    })*/}
                    {/*                }*/}
                    {/*            </span>*/}
                    {/*                </div>*/}
                    {/*                <Button className={classes.usercardedit}>*/}
                    {/*                    Edit*/}
                    {/*                </Button>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className={`${classes.homecard} ${classes.rightcard}`}>*/}
                    {/*        <div className={classes.homecardtitle}>*/}
                    {/*            Quick Upload*/}
                    {/*        </div>*/}
                    {/*        <Dropzone addFiles={this.addFiles} />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className={classes.homecard} style={{marginTop: "8px", flex: "1 0 calc(100% - 308px)", height: "calc(100% - 308px)", overflow: "scroll"}}>
                        <div className={classes.homecardtitle}>
                            File Manager

                            {/* <IconButton size="small" onClick={this.routeToCurrentLocation}>
                                <OpenInBrowserIcon/>
                            </IconButton> */}
                        </div>
                        <AppBar position="static" color="transparent" className={classes.filemanagertabs}>
                            <Tabs
                                value={selectedTab}
                                onChange={this.handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                {
                                    this.state.userGroups.map((g, i) => {
                                        return (
                                            <Tab key={g.name} label={g.name} {...a11yProps(i)} />
                                        );
                                    })
                                }
                            </Tabs>
                        </AppBar>
                        {/* {
                            this.state.userGroups.map((g, i) => {
                                let treepath = this.props.currentFolderData?.treepath || "";
                                let treepathcheck = treepath.length > 0;
                                return (
                                    <TabPanel value={selectedTab} index={i} key={g.name} className={classes.filemanager_selectedtab}>
                                        <div className={classes.selectedtab_breadcrumb}>
                                            {
                                                this.props.currentFolder > 0 ? (
                                                    <IconButton size="small" onClick={this.returnToPreviousFolder}>
                                                        <KeyboardReturnIcon />
                                                    </IconButton>
                                                ) : (null)
                                            }
                                            {g.name} {treepathcheck ? (
                                                treepath.split("/").filter(w => !!w).map(w => {
                                                    return `/ ${w} `;
                                                })
                                            ) : ("")}
                                        </div>
                                        <TableContainer className={classes.selectedtab_table}>
                                            <Table size="small">
                                                <TableHead className={classes.selectedtab_tablehead}>
                                                    <TableRow>
                                                        <TableCell align="left">
                                                            <TableSortLabel>
                                                                File Name
                                                            </TableSortLabel>
                                                        </TableCell>

                                                        <TableCell align="right" style={{width: "125px"}}>
                                                            <TableSortLabel>
                                                                File Type
                                                            </TableSortLabel>
                                                        </TableCell>

                                                        <TableCell align="right" style={{width: "125px"}}>
                                                            <TableSortLabel>
                                                                AI Type
                                                            </TableSortLabel>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody className={classes.selectedtab_tablebody}>
                                                    {
                                                        this.props.tableData
                                                            .slice(this.props.currentPage * this.props.rowsPerPage, this.props.currentPage * this.props.rowsPerPage + this.props.rowsPerPage)
                                                            .map((r, i) => {
                                                                let check = this.props.selectedRows.findIndex(row => row.documentid === r.documentid) > -1;
                                                                let [Icon, type] = getDocumentIcon(r.documenttype);
                                                                return (
                                                                    <TableRow key={r.documentid}
                                                                              className={check ? classes.tablerow_selected : ""}
                                                                              onClick={this.handleSelectRow(i)}
                                                                              onDoubleClick={() => this.handleDoubleClickRow(r)}
                                                                    >
                                                                        <TableCell className={classes.tablerow_name}>
                                                                            <Icon className={classes.tableicon} /> {r.name}
                                                                        </TableCell>
                                                                        <TableCell align="right" style={{width: "125px"}}>
                                                                            {type}
                                                                        </TableCell>
                                                                        <TableCell align="right" style={{width: "125px"}}>
                                                                            {r.algorithmtypestr}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination rowsPerPageOptions={[10, 25, 50, 100]}
                                                         component={"div"}
                                                         count={this.props.tableData.length}
                                                         page={this.props.currentPage}
                                                         rowsPerPage={this.props.rowsPerPage}
                                                         onChangePage={this.handleChangePage}
                                                         onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                        >

                                        </TablePagination>
                                    </TabPanel>
                                );
                            })
                        } */}
                        <PortfolioCard />
                    </div>
                </Content>
                <Footer/>
                <CaseModal open={this.state.createCaseBool}
                           handleSave={this.modalCreateCase}
                           handleClose={this.handleClose}
                />

            </Root>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
