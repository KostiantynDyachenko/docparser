import React, {useState, useEffect} from "react";
import {withStyles} from "@material-ui/core/styles";
import {rootContainerFullWithTheme, borders} from "../styles/styles";
import {createCase, createDocument, fakeDataSetup, findById, editorData} from "../../models/createData";
import {initializeKData, initializeKObj, getFileTypeFromName} from "../utils/utils";
import {Redirect, Route, useLocation, useParams, useRouteMatch, useHistory, withRouter} from "react-router-dom";
import PortfolioTable from "./PortfolioTable";
import ActionButton from "../Button/ActionButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Tooltip from "@material-ui/core/Tooltip";
import BackspaceIcon from '@material-ui/icons/Backspace';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from '@material-ui/icons/FilterList';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import PublishIcon from '@material-ui/icons/Publish';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CaseModal from "../Modal/CaseModal";
import EditCaseModal from "../Modal/EditCaseModal";
import FolderTreeModal from "../Modal/FolderTreeModal";
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {Link} from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import EditorJs from "react-editor-js";
import Skeleton from "@material-ui/lab/Skeleton";
import {EditorTools} from '../../models/editorConstants';
import {connect} from "react-redux";
import {UploadFile, SetLoader} from "../../modules/fileManager/fileManager";
import {SetCurrentFolder, SetCurrentFolderData, SetTableData} from "../../modules/tableManager/tableManager";
import {SetModal} from "../../modules/modalManager/modalManager";
import {Api} from "../Api";
import newCreateModalProps from "../NewProps/newCreateModalProps";
import newEditModalProps from "../NewProps/newEditModalProps";
import newMoveModalProps from "../NewProps/newMoveModalProps";
import newCopyModalProps from "../NewProps/newCopyModalProps";
import newUploadModalProps from "../NewProps/newUploadModalProps";
import newAiOperationModalProps from "../NewProps/newAiOperationModalProps";
import FlowChart from "./FlowChart";
import {TabContext, TabList, TabPanel, ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Box} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import {Delete, OpenWith, CloudDownload, PlayArrow} from '@material-ui/icons';
import {FormControl, InputLabel, Select, Slider, TextareaAutosize} from '@material-ui/core';
import DocumentViewContentQuery from "./DocumentViewContentQuery";
import Input from "@material-ui/core/Input";
import DocumentViewSummary from "./DocumentViewSummary";
import DocumentViewLogic from "./DocumentViewLogic";

const mapDispatchToProps = (dispatch) => {
    return {
        UploadFile: file => dispatch(UploadFile(file)),
        SetTableData: data => dispatch(SetTableData(data)),
        SetModal: name => props => dispatch(SetModal(name)(props)),
        SetLoader: bool => dispatch(SetLoader(bool)),
        SetCurrentFolder: int => dispatch(SetCurrentFolder(int)),
        SetCurrentFolderData: int => dispatch(SetCurrentFolderData(int))
    }
}

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings,
        currentGroup: state.tableManager.currentGroup,
        tableData: state.tableManager.tableData,
        currentDocumentId: state.tableManager.currentDocumentId,
        flowchart: state.modalManager.flowchart
    }
}

const useStyles = () => ({
    content: {
        // ...rootContainerFullWithTheme(theme),
        flexDirection: "column",
        height: "calc(100% - 112px)",
        // width: "calc(100% - 64px)",
        width: "100%",
        margin: "16px 0 32px",
        overflow: "visible",
        justifyContent: "flex-start",
    },
    contentcard: {
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
        padding: "0",
        overflow: "visible",
        // background: theme.palette.background.paper,
        border: borders.border
    },
    contencardbody: {
        height: "auto",
        width: "calc(100% - 16px)",
        overflow: "hidden",
        boxSizing: "border-box",
        marginLeft: "8px",
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
            // [theme.breakpoints.down('md')]: {
            //     maxWidth: "calc(100% - 64px)"
            // },
            // [theme.breakpoints.up('md')]: {
            //     maxWidth: "calc(100% - 304px)"
            // },
        },
        "& .ce-block__content": {
            // [theme.breakpoints.down('md')]: {
            //     maxWidth: "calc(100% - 64px)"
            // },
            // [theme.breakpoints.up('md')]: {
            //     maxWidth: "calc(100% - 304px)"
            // },
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
            // ...theme.typography.caption,
            // color: theme.palette.text.primary,
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
    leftactions: {
        flex: "0 0 50%",
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
        flex: "0 1 50%",
        height: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
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
        // ...theme.typography.h6
    },
    tabs: {
        // ...theme.typography.subtitle2,
        // padding: theme.spacing(0.5, 0, 0.5, 2)
    },
    divider: {
        width: "100%",
        height: "2px",
        background: "rgba(0, 0, 0, 0.1)",
        // margin: theme.spacing(1, 0)
    },
    route: {
        // ...theme.typography.h5,
        // padding: theme.spacing(0, 2),
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
    displayFlexButtons: {
        display: "flex",
        paddingLeft: "8px",
    },
    buttonsTool: {
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        border: "1px solid #9ebda2",
        boxSizing: "border-box",
        padding: "7px 13px",
        borderRadius: "10px",
        fontWeight: "400",
        transition: ".2s",
        "&:hover": {
            backgroundColor: '#9ebda2',
            color: "#fff",
            transition: ".2s",
            "& $buttonsToolIcon": {
                color: "#fff"
            }
        },
    },
    buttonsToolContent: {
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        columnGap: "6px",
    },
    buttonsToolIcon: {
        color: "#9ebda2",
    },
    displayAI: {
        columnGap: "50px",
        minHeight: "130px",
    },
    widthAISelect: {
        width: "20%",
    },
    manualDisplay: {
        display: "flex",
        marginTop: "30px",
        height: "50px",
        columnGap: "50px",
    },
    fileParams: {
        display: "flex",
        columnGap: "50px",
        marginTop: "30px",
    },
    advancedSettingsButton: {
        flexDirection: "row",
        alignItems: "center",
        height: "50px",
        display: "inline",
        marginLeft: "20px",
        color: "#45764b",
        cursor: "pointer"
    }
})

class PortfolioCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTab: '1',
            parentid: -1,
            createCaseBool: false,
            redirect: false,
            anchorElEllipsis: null,
            anchorElFilterMenu: null,
            openFilterMenu: false,
            viewAnchorEl: null,
            selectedAction: "",
            modal: {
                "create": newCreateModalProps(false),
                "edit": newEditModalProps(false, null),
                "move": newMoveModalProps(false, []),
                "copy": newCopyModalProps(false, null)
            },
            contextLinkData: null,
            contextMouse: {
                mouseX: null,
                mouseY: null
            },
            searchContextField: "",
            searchContextAnswer: "",
            displayContextAnswerWindow: false,
            displayContextAnswer: false,
            currentFilter: "all",
            currentRootFilter: "all",
            currentParent: null,
            selectedOptionAi: "summary",
            selectConfigAI: false,
            operatorChosen: false,
            selectDictionaries: "medical",
            rangeConfigValue: 50,
            summarizerMethod: "eachSection",

            selectedDocsToShow: [],
            selectedFiles: [],
            isSelectedFilesLoaded: true
        }
        this.editorInstance = undefined;
    }

    arraysAreEqual = (arr1, arr2 ) => {
        if (arr1?.length !== arr2?.length) {
            return false;
        }

        for (let i = 0; i < arr1?.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tableDataLoaded != this.state.tableDataLoaded && !this.state.tableDataLoaded) {
            this.setState({tableDataLoaded: true});
            this.getFiles();
            this.getId();
        }

        if(!this.arraysAreEqual(prevState.selectedFiles,this.state.selectedFiles)){
            this.handleSelectedFiles(prevState.selectedFiles)
        }
    }

    handleSelectedFiles = async (prevSelectedFiles) => {
        this.setState({ isSelectedFilesLoaded: false }, () => {
            console.log("isSelectedFilesLoaded", this.state.isSelectedFilesLoaded);
        });

        const documents = [];
        const promises = this.state.selectedFiles?.map(async (file,i) => {
            if (file.documenttype === 4 && prevSelectedFiles[i] !== file) {
                const result = await this.getAllDocumentsFromAllFolders(file);
                console.log(510, result);
                return result;
            } else {
                return file;
            }
        });

        await Promise.all(promises).then((data) => {
            console.log("data", data);
            this.setState({ selectedDocsToShow: data }, () => {
                console.log("this.state.selectedDocsToShow", this.state.selectedDocsToShow, data);
            });
        })
            .then(() => {
                this.setState({ isSelectedFilesLoaded: true }, () => {
                    console.log("isSelectedFilesLoaded", this.state.isSelectedFilesLoaded);
                });
            });

    };


    getDocumentsFromFolder = async(folder) => {
        let response = await Api.getDocumentsByParentID(folder.documentid,folder.group_id);
        const data = response._json;
        const copy = [];
        return data;
    }

    arr = [];
    getAllDocumentsFromAllFolders = async(folder) => {
        let docs = await this.getDocumentsFromFolder(folder);
        docs.forEach(file => {
            if(file.documenttype === 4){
                this.arr=[]
                // let result = await this.getAllDocumentsFromAllFolders(file);
                this.getAllDocumentsFromAllFolders(file);
                // this.arr.push(result)
            }else{
                this.arr.push(file)
            }
        })
        return this.arr;
    }

    handleChangeTab = (e, newTab) => {
        this.setState({currentTab: newTab});
    };

    getFileTypeAI = (selected) => {
        if (selected.length) {
            return !(selected.length === selected.filter(select => select.documenttypestr !== 'folder').length)
        } else {
            return true;
        }
    }

    // changeSelectedOptionAI = (event) => {
    //     this.setState({...this.state, selectedOptionAi: event.target.value, operatorChosen: true});
    // }

    changeSelectedOptionAI = (event, chosenOperation) => {
        const chosen = chosenOperation !== null;
        this.setState({selectedOptionAi: chosenOperation, operatorChosen: chosen});
    }

    changeConfigurationOptionAI = (event) => {
        this.setState({...this.state, selectConfigAI: !this.state.selectConfigAI})
    }

    changeDictionariesOptionAI = (event) => {
        this.setState({...this.state, selectDictionaries: event.target.value})
    }

    rangeConfig = (event, newRange) => {
        this.setState({...this.state, rangeConfigValue: newRange})
    }

    changeSummarizerMethod = (event) => {
        this.setState({...this.state, summarizerMethod: event.target.value})
    }

    changeSelectedFiles = (files) => {
        this.setState({...this.state,selectedFiles: files.length === 0 ? [] : files.filter(select => select.selected)})
    }

    flowchartTemplate() {
        const { classes } = this.props;

        return (
            <div></div>
        )
    }

    mainOperatorTemplate = () => {
        const { classes } = this.props;

        return (
            <>
                {
                    this.state.selectConfigAI && this.state.operatorChosen
                        ? (
                            <div className={classes.fileParams}>
                                {
                                    this.state.selectedOptionAi === "summary" || this.state.selectedOptionAi === "timeline"
                                    ? this.configTemplate()
                                    : this.flowchartTemplate()
                                }
                            </div>
                        )
                        : null
                }
            </>
        )
    }

    configTemplate = () => {
        const {classes} = this.props;
        const {rangeConfigValue} = this.state;
        return (
            <>
                <FormControl className={classes.widthAISelect}>
                    <InputLabel>Dictionaries</InputLabel>
                    <Select value={this.state.selectDictionaries} onChange={this.changeDictionariesOptionAI}>
                        <MenuItem value={"medical"}>Medical</MenuItem>
                        <MenuItem value={"wireless"}>Wireless</MenuItem>
                    </Select>
                </FormControl>
                <div className={classes.widthAISelect}>
                    <InputLabel style={{fontSize: "12px"}}>Summary Length</InputLabel>
                    <Slider value={rangeConfigValue}
                            onChange={this.rangeConfig}
                            ria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={10}
                            marks
                            min={10}
                            max={90}
                            valueLabelFormat={(rangeConfigValue) => rangeConfigValue.toLocaleString() + '%'}
                    />
                </div>
                <FormControl className={classes.widthAISelect}>
                    <InputLabel>Summarizer Method</InputLabel>
                    <Select value={this.state.summarizerMethod} onChange={this.changeSummarizerMethod}>
                        <MenuItem value={"entrySelection"}>Summary for the entire document selection</MenuItem>
                        <MenuItem value={"eachSection"}>Summary for each section</MenuItem>
                        <MenuItem value={"eachParagraph"}>Summary for each paragraph</MenuItem>
                    </Select>
                </FormControl>
            </>
        )
    }

    // ******************
    // * Create Actions *
    // ******************

    createLeftActionsTest = (classes) => {
        if (this.state.displayContextAnswerWindow) {
            return (null);
        }
        let check = this.checkRowsSelected();
        if (this.state.operatorChosen === false && this.state.selectedOptionAi) {
            this.setState({operatorChosen: true});
        }
        console.log(check)
        // console.log("selection",this.getData())
        const selection = this.getData();
        const selected = selection.length === 0 ? null : selection.filter(select => select.selected);
        // const selected = null;

        if (check) {
            return (
                <div style={{width: 'calc(100% - 16px)', margin: '5px auto'}}>
                    <Box sx={{width: '100%', typography: 'body1'}}>
                        <TabContext value={this.state.currentTab}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <TabList onChange={this.handleChangeTab} aria-label="lab API tabs example">
                                    <Tab label="FILE" value="1"/>
                                    <Tab label="CONTENT QUERY" value="2" disabled={!this.state.isSelectedFilesLoaded}/>
                                    <Tab label="SUMMARY" value="3" disabled={!this.state.isSelectedFilesLoaded}/>
                                    <Tab label="LOGIC" value="4" disabled={!this.state.isSelectedFilesLoaded}/>
                                    <Tab label="TIMELINE" value="5"
                                         disabled={true}/>
                                </TabList>
                            </Box>
                            <TabPanel value="1" style={{display: "flex", height: "50px", alignItems: "center"}}>
                                <div style={{display: "flex", columnGap: '15px'}}>
                                    <div className={classes.buttonsTool}
                                         onClick={() => this.setModal("move")(newMoveModalProps(true, selected))}>
                                        <div className={classes.buttonsToolContent}>
                                            <OpenWith className={classes.buttonsToolIcon}/>
                                            <div>Move</div>
                                        </div>
                                    </div>
                                    <div className={classes.buttonsTool}>
                                        <div className={classes.buttonsToolContent}
                                             onClick={() => this.downloadDocument(this.getData().find(item => item.selected))}>
                                            <CloudDownload className={classes.buttonsToolIcon}/>
                                            <div>Download</div>
                                        </div>
                                    </div>
                                    <div className={classes.buttonsTool}
                                         onClick={() => this.deleteCase(this.getData())}>
                                        <div className={classes.buttonsToolContent}>
                                            <Delete className={classes.buttonsToolIcon}/>
                                            <div>Delete</div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="2" style={{display: "grid", minHeight: "200px", margin: "0 auto"}}>
                                <DocumentViewContentQuery document={selected} userSettings={this.props.userSettings}/>
                                {console.log(selected)}
                                <button onClick={this.check}>
                                    Click me
                                </button>
                            </TabPanel>
                            <TabPanel value="3" style={{display: "grid", minHeight: "200px", margin: "0 auto"}}>
                                <DocumentViewSummary
                                    // document={selected}
                                    userSettings={this.props.userSettings}
                                    document={this.state.selectedDocsToShow.flat(Infinity)}
                                />
                            </TabPanel>
                            <TabPanel value="4" style={{display: "grid", minHeight: "200px", margin: "0 auto"}}>
                                <DocumentViewLogic document={selected} userSettings={this.props.userSettings}/>
                            </TabPanel>
                            {/*<TabPanel value="2" style={{display: "flex"}}>*/}
                            {/*    /!*onClick={() => this.props.SetModal("aioperation")(newAiOperationModalProps(true, selected))}*!/*/}
                            {/*    {console.log(selected)}*/}
                            {/*    <div style={{width: "80%"}}>*/}
                            {/*        <div className={classes.displayAI}>*/}
                            {/*            <ToggleButtonGroup*/}
                            {/*                color="primary"*/}
                            {/*                value={this.state.selectedOptionAi}*/}
                            {/*                exclusive*/}
                            {/*                onChange={this.changeSelectedOptionAI}*/}
                            {/*                aria-label="Platform"*/}
                            {/*            >*/}
                            {/*                <ToggleButton*/}
                            {/*                    style={{textTransform: "initial"}}*/}
                            {/*                    value="summary">Summary</ToggleButton>*/}
                            {/*                <ToggleButton*/}
                            {/*                    style={{textTransform: "initial", color: "#575353"}}*/}
                            {/*                    value="timeline">Timeline</ToggleButton>*/}
                            {/*                <ToggleButton*/}
                            {/*                    style={{textTransform: "initial"}}*/}
                            {/*                    value="flowchart"*/}
                            {/*                    disabled>Flowchart</ToggleButton>*/}
                            {/*                <ToggleButton*/}
                            {/*                    style={{textTransform: "initial"}}*/}
                            {/*                    value="ask & question"*/}
                            {/*                    disabled>Ask & Question</ToggleButton>*/}
                            {/*                <ToggleButton*/}
                            {/*                    style={{textTransform: "initial"}}*/}
                            {/*                    value="generate test cases"*/}
                            {/*                    disabled>Generate test cases</ToggleButton>*/}
                            {/*            </ToggleButtonGroup>*/}
                            {/*            /!*<FormControl style={{flexDirection: "row", alignItems: "center", height: "50px"}}*!/*/}
                            {/*            /!*             className={classes.widthAISelect}>*!/*/}
                            {/*            /!*    <p style={{margin: "0 auto", textAlign: "center"}}>Advanced Settings</p>*!/*/}
                            {/*            /!*    <Switch*!/*/}
                            {/*            /!*        checked={this.state.selectConfigAI}*!/*/}
                            {/*            /!*        onChange={this.changeConfigurationOptionAI}*!/*/}
                            {/*            /!*        inputProps={{ 'aria-label': 'controlled' }}*!/*/}
                            {/*            /!*        color={"primary"}*!/*/}
                            {/*            /!*    />*!/*/}
                            {/*            /!*</FormControl>*!/*/}
                            {/*            <p className={classes.advancedSettingsButton}*/}
                            {/*               onClick={this.changeConfigurationOptionAI}>Advanced Settings</p>*/}
                            {/*            /!*<FormControl className={classes.widthAISelect}>*!/*/}
                            {/*            /!*    <InputLabel>Operations</InputLabel>*!/*/}
                            {/*            /!*    <Select value={this.state.selectedOptionAi} onChange={this.changeSelectedOptionAI}>*!/*/}
                            {/*            /!*        <MenuItem value={"summary"}>Summary</MenuItem>*!/*/}
                            {/*            /!*        <MenuItem value={"timeline"}>Timeline</MenuItem>*!/*/}
                            {/*            /!*        <MenuItem value={"flowchart"}>Flowchart</MenuItem>*!/*/}
                            {/*            /!*        <MenuItem value={"generate test cases"} disabled={true}>Generate test*!/*/}
                            {/*            /!*            cases</MenuItem>*!/*/}
                            {/*            /!*    </Select>*!/*/}
                            {/*            /!*</FormControl>*!/*/}
                            {/*            {*/}
                            {/*                this.state.operatorChosen*/}
                            {/*                    ? this.mainOperatorTemplate()*/}
                            {/*                    : null*/}
                            {/*            }*/}
                            {/*            <div className={[classes.fileParams]}>*/}
                            {/*                <FormControl className={classes.widthAISelect}>*/}
                            {/*                    <InputLabel>Name</InputLabel>*/}
                            {/*                    <Input value={selected[0].name}/>*/}
                            {/*                </FormControl>*/}
                            {/*                <FormControl className={classes.widthAISelect}>*/}
                            {/*                    <InputLabel>Description</InputLabel>*/}
                            {/*                    <Input value={selected[0].description}/>*/}
                            {/*                </FormControl>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <div style={{width: "30%", display: "flex", alignItems: "center"}}>*/}
                            {/*        <Button style={{margin: "0 auto", width: "50%", color: "white"}} disabled>Process</Button>*/}
                            {/*    </div>*/}
                            {/*</TabPanel>*/}
                            {/*<TabPanel value="3">Item Three</TabPanel>*/}
                        </TabContext>
                    </Box>
                </div>
            )
        } else {
            return (
                <div className={classes.displayFlexButtons}>
                    <div>
                        <Button className={classes.actionbutton}
                                disableElevation
                                startIcon={<AddIcon/>}
                                onClick={this.openCreateCaseModal}
                        >
                            Create Folder
                        </Button>
                    </div>
                    {this.createUploadButton()}
                </div>
            );
        }
    }
    createLeftActions = (classes) => {
        if (this.state.displayContextAnswerWindow) {
            return (null);
        }
        let check = this.checkRowsSelected();
        if (check) {
            return (
                <Tooltip title={"Clear selected rows"}>
                    <IconButton className={classes.actionbutton}
                                variant="contained"
                                onClick={this.clearAll}
                    >
                        <ClearAllIcon/>
                    </IconButton>
                </Tooltip>
            )
        } else {
            return (
                <>
                    <div>
                        <Button className={classes.actionbutton}
                                disableElevation
                                startIcon={<AddIcon/>}
                                onClick={this.openCreateCaseModal}
                        >
                            Create Folder
                        </Button>
                    </div>
                    {this.createUploadButton()}
                </>
            );
        }
    }

    createUploadButton = () => {
        const {classes} = this.props;
        return (
            <>
                <input
                    className={classes.input}
                    id="upload-document"
                    multiple
                    onChange={this.onInputUpload}
                    type="file"
                />
                <label htmlFor="upload-document">
                    <Button className={classes.actionbutton}
                            disableElevation
                            startIcon={<PublishIcon/>}
                            component="span">
                        Upload
                    </Button>
                </label>
            </>
        );
    }

    createActions = (classes) => {
        let selected = this.getSelectedRows();
        let actions, quicksearch = false;

        if (selected.length === 0) {
            return null;
        }

        if (selected.length === 1) {
            switch (selected[0].algorithmtype) {
                // folder
                case 0:
                    actions = ["view", "delete", "move"];
                    break;
                // original
                case 1:
                    actions = ["view", "train ai", "ai operation", "download", "delete", "move"];
                    break;
                // processed
                default:
                case 2:
                    actions = ["view", "delete", "move"];
                    break;
            }
        }

        if (selected.length > 1) {
            // original documents
            if (selected.every(s => s.algorithmtype === 1)) {
                actions = ["delete", "move", "compare", "ai operation"];
                // quicksearch = true;
            }
            // files & folders
            else if (selected.some(s => s.algorithmtype > 0)) {
                actions = ["delete", "move", "compare"];
                // quicksearch = true;
            }
            // all folders
            else {
                actions = ["delete", "move"];
                // quicksearch = false;
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
                                            <SearchIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={this.handleSearchContextChange}
                                value={this.state.searchContextField}
                                variant="outlined"
                                style={{width: this.state.searchContextField.length > 0 ? ("100%") : ("180px")}}
                            />
                        </>
                    ) : (null)
                }
                {
                    this.state.searchContextField.length > 0 ? (
                            <>
                                <Tooltip title={"Clear Quick Search"}>
                                    <IconButton className={classes.actionbutton} onClick={this.clearContextField}>
                                        <BackspaceIcon/>
                                    </IconButton>
                                </Tooltip>
                                <ActionButton action={"Search"} onClick={this.getQuestionAnswered}/>
                            </>
                        )
                        : actions.map(action => (
                            <div key={action}>
                                <ActionButton action={action} onClick={(event) => this.handleAction(action, [], event)}/>
                            </div>
                        ))
                }
            </>
        );
    }

    createEllipsisButton = () => {
        let selected = this.getSelectedRows();
        const {classes} = this.props;

        if (selected.length === 1 && selected[0].type === "document") {
            return (
                <>
                    <Button className={classes.actionbutton}
                            variant="contained"
                            color="secondary"
                            disableElevation
                            onClick={this.ellipsisButtonOnClick}
                            style={{minWidth: "40px"}}
                    >
                        <MoreHorizIcon/>
                    </Button>
                    <Menu
                        id="fade-menu"
                        anchorEl={this.state.anchorElEllipsis}
                        keepMounted
                        open={this.openEllipsisMenu}
                        onClose={this.ellipsisButtonOnClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => this.ellipsisButtonOnClose("download")}>Download</MenuItem>
                        <MenuItem onClick={() => this.ellipsisButtonOnClose("rename")}>Rename</MenuItem>
                    </Menu>
                </>
            );
        }

        return (null);
    }
    // **********************
    // * End Create Actions *
    // **********************


    // ***************************
    // * Handle Button Functions *
    // ***************************
    handleAction = (action, selection = [], event) => {
        switch (action) {
            case "view": {
                this.handleViewClick(event, action);
                break;
            }
            case "train in current tab":
            case "view in current tab": {
                const selected = selection.length > 0 ? selection[0] : this.props.tableData.filter(dataItem => dataItem.selected)[0];
                this.setState({viewAnchorEl: null});
                // folder
                if (selected.documenttype === 4) {
                    console.log(1)
                    return this.props.history.push(`${this.props.match.url}portfolio/${selected.documentid}${this.props.location.search}`);
                }
                // original
                else if (selected.algorithmtype === 1 && this.state.selectedAction === "train ai") {
                    console.log(2)
                    return this.props.history.push(`${this.props.match.url}portfolio${this.props.location.search}?train=${selected.documentid}`);
                }
                // all others
                else {
                    console.log(3)
                    console.log(this.props.history.push(`${this.props.match.url}portfolio${this.props.location.search}?view=${selected.documentid}`))
                    return this.props.history.push(`${this.props.match.url}portfolio${this.props.location.search}?view=${selected.documentid}`);
                }
            }
            case "train in new tab":
            case "view in new tab": {
                const selected = selection.length > 0 ? selection[0] : this.props.tableData.filter(dataItem => dataItem.selected)[0];
                this.setState({viewAnchorEl: null});
                // folder
                if (selected.documenttype === 4) {
                    return window.open(`http://${window.location.host}/#${this.props.match.url}portfolio/${selected.documentid}${this.props.location.search}`, '_blank', 'noopener,noreferrer');
                }
                // original
                else if (selected.algorithmtype === 1 && this.state.selectedAction === "train ai") {
                    return window.open(`http://${window.location.host}/#${this.props.match.url}portfolio${this.props.location.search}?train=${selected.documentid}`, '_blank', 'noopener,noreferrer');
                }
                // all other files
                else {
                    return window.open(`http://${window.location.host}/#${this.props.match.url}portfolio${this.props.location.search}?view=${selected.documentid}`, '_blank', 'noopener,noreferrer');
                }
            }
            case "train ai": {
                this.handleViewClick(event, action);
                break;
            }
            case "compare": {
                const selected = selection.length > 0 ? selection : this.props.tableData.filter(dataItem => dataItem.selected);
                const ids = selected.map(s => s.documentid).join("-");
                return window.open(`http://${window.location.host}/#${this.props.match.url}portfolio${this.props.location.search}?search=${ids}`, '_blank', 'noopener,noreferrer');
            }
            case "delete": {
                const selected = selection.length > 0 ? selection : this.props.tableData.filter(dataItem => dataItem.selected);
                this.deleteCase(selected);
                break;
            }
            case "download": {
                const selected = selection.length > 0 ? selection : this.props.tableData.filter(dataItem => dataItem.selected);
                this.downloadDocument(selected[0]);
                break;
            }
            case "edit": {
                const selected = selection.length > 0 ? selection : this.props.tableData.filter(dataItem => dataItem.selected);
                this.setModal("edit")(newEditModalProps(true, selected[0]));
                break;
            }
            case "move": {
                const selected = selection.length > 0 ? selection : this.props.tableData.filter(dataItem => dataItem.selected);
                this.setModal("move")(newMoveModalProps(true, selected));
                break;
            }
            case "copy": {
                const selected = selection.length > 0 ? selection : this.props.tableData.filter(dataItem => dataItem.selected);
                break;
            }
            case "ai operation": {
                const selected = selection.length > 0 ? selection : this.props.tableData.filter(dataItem => dataItem.selected);
                this.props.SetModal("aioperation")(newAiOperationModalProps(true, selected));
                console.log('ai modal')
                break;
            }
        }
        if (["view", "train ai"].includes(action)) return;
        this.clearSelected();
    }

    handleViewClick = (event, action) => {
        console.log(action)
        this.setState({
            viewAnchorEl: event.currentTarget,
            selectedAction: action
        });
    }

    handleViewClose = () => {
        this.setState({viewAnchorEl: null});
    }

    handleClose = () => {
        this.setState({createCaseBool: false});
    }

    handleDblClick = (selected) => {
        // folder
        if (selected.documenttype === 4) {
            this.props.SetCurrentFolder(selected.documentid);
            this.props.history.push(`${this.props.match.url}/${selected.documentid}${this.props.location.search}`);
            return this.setState({tableDataLoaded: false});
        }
        // file
        else {
            this.props.SetCurrentFolder(selected.documentid);
            return this.props.history.push(`${this.props.match.url}?view=${selected.documentid}`);
        }
    }

    handlePreviewContextMenu = (data) => (event) => {
        event.preventDefault();
        this.setState({
            contextLinkData: data,
            contextMouse: {
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4
            }
        });
    }

    handleSearchContextChange = (event) => {
        this.setState({searchContextField: event.target.value});
    }

    closeContextAnswerWindow = () => {
        this.setState({displayContextAnswerWindow: false});
    }

    ellipsisButtonOnClick = (event) => {
        this.setState({anchorElEllipsis: event.currentTarget});
    }

    ellipsisButtonOnClose = (action = "") => {
        this.handleAction(action);
        this.setState({anchorElEllipsis: null});
    }

    handleEditClose = () => {
        this.setModal("edit")({bool: false, row: null});
    }

    openCreateCaseModal = () => {
        this.setModal("create")(newCreateModalProps(true));
    }

    filterMenuButtonOnClick = (event) => {
        this.setState({
            anchorElFilterMenu: event.currentTarget,
            openFilterMenu: true
        });
    }

    filterMenuButtonOnClose = (action = "") => {
        if (action.length > 0) {
            this.setState({
                currentFilter: action,
                anchorElFilterMenu: null,
                openFilterMenu: false
            });
        } else {
            this.setState({
                anchorElFilterMenu: null,
                openFilterMenu: false
            });
        }
    }
    // *******************************
    // * End Handle Button Functions *
    // *******************************


    // ***********
    // * Getters *
    // ***********
    getSelectedRows = () => {
        let selected = [];
        if (this.state.parentid === -1) {
            selected = this.props.tableData.filter(dataItem => dataItem.selected);
        } else {
            let parentData = findById(this.props.tableData, this.state.parentid);
            selected = parentData.cases.filter(dataItem => dataItem.selected);
        }
        return selected;
    }

    getId = async () => {
        if (this.props.currentDocumentId) {
            const response = await Api.getDocument(this.props.currentDocumentId);
            const data = response?._json;
            this.setState({currentParent: data});
            this.props.SetCurrentFolderData(data);
        } else {
            this.setState({currentParent: null});
            this.props.SetCurrentFolderData({});
        }
    }

    getFiles = async () => {
        const parentID = this.props.currentDocumentId || 0;
        const response = await Api.getDocumentsByParentID(parentID, this.props.currentGroup);
        const files = response?._json || [];
        this.props.SetLoader(false);
        const tableFiles = files.map(f => {
            f.selected = false;
            return f;
        });
        this.props.SetTableData(tableFiles);
    }

    getSelectedTypeName = () => {
        const selected = this.props.tableData.filter(dataItem => dataItem.selected)[0];
        if (!selected) return undefined;
        return selected.documenttype === 4 ? ("Folder") : ("File");
    }

    getData = () => {
        if (this.state.parentid === -1) {
            return this.props.tableData;
        }
        const parent = findById(this.props.tableData, this.state.parentid);
        return parent.cases;
    }

    getUrls = () => {
        return this.props.match.url.replace("-", " ").split("/").filter(link => !["", "portfolio"].includes(link));
    }

    getCardBodyDimensions = () => {
        let cardBodyElement = document.getElementById('documentCardBody');
        return {
            height: cardBodyElement ? cardBodyElement.offsetHeight : '500px',
            width: cardBodyElement ? cardBodyElement.offsetWidth : '500px'
        }
    }
    // ***************
    // * End Getters *
    // ***************


    // ***********
    // * Setters *
    // ***********
    setModal = (name) => (newProps) => {
        console.log('move setModal');
        console.log(this.state.modal)
        let newModal = {...this.state.modal};
        newModal[name] = newProps;
        this.setState({modal: newModal});
    }

    setData = (newData, params = {}) => {
        SetTableData(newData);
    }
    // ***************
    // * End Setters *
    // ***************


    // *****************
    // * Miscellaneous *
    // *****************
    EditorJsOnReady = async (instance) => {
        this.editorInstance = instance;
    }

    checkRowsSelected = (_data = this.props.tableData) => {
        const selected = _data.filter(dataItem => dataItem.selected);
        return (selected.length > 0);
    }

    getQuestionAnswered = async () => {
        const rows = this.getSelectedRows();
        const ids = rows.map(row => +row.documentid);
        const request = {
            question: this.state.searchContextField,
            is_long_form: true,
            compare_document_list: ids
        }
        const response = await Api.getQuestionAnswered(request);
        const json = response._json;
        this.setState({
            searchContextAnswer: json,
            displayContextAnswerWindow: true,
            displayContextAnswer: true
        });
    }

    createCase = async (newcase) => {
        this.props.SetLoader(true);
        // upload with "" for root
        const parentID = this.state.currentParent ? this.state.currentParent.documentid : "";
        const groupID = this.state.currentParent ? this.state.currentParent.group_id : this.props.currentGroup;
        const docTypeResponse = await Api.getDocumentType("folder");
        const fileTypeEnum = docTypeResponse._json;
        const formData = new FormData();
        formData.append("name", newcase.name);
        formData.append("description", newcase.description);
        formData.append("documenttype", fileTypeEnum);
        formData.append("parent", parentID);
        formData.append("group", groupID);
        const results = await Api.uploadFile(formData);
        this.setModal("create")(newCreateModalProps(false));
        this.getFiles();
    }

    editCase = async (newcase) => {
        this.props.SetLoader(true);
        const updatedCase = {
            documentid: this.state.modal["edit"].row.documentid,
            name: newcase.name,
            description: newcase.description,
            documenttype: this.state.modal["edit"].row.documenttype,
            parent: this.state.modal["edit"].row.parent_id,
            group: this.state.modal["edit"].row.group_id,
        }
        const response = await Api.updateDocument(updatedCase);
        this.setModal("edit")({bool: false, row: null});
        this.getFiles();
    }

    deleteCase = async (selected) => {
        const onlySelected = selected.filter(select => select.selected);
        this.props.SetLoader(true);
        const promises = onlySelected.map(row => {
            return Api.deleteDocument(row.documentid);
        });
        await Promise.all(promises);
        this.getFiles();
    }

    moveCase = async (group, folder) => {
        this.props.SetLoader(true);
        const promises = this.state.modal["move"].row.map((row) => {
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
        this.setModal("move")({bool: false, row: null});
        this.getFiles();
    }

    copyCase = async (copycase) => {

    }

    downloadDocument = async (document) => {
        this.props.SetLoader(true);
        const response = await Api.downloadDocument(document.documentid);
        const json = response?._json;
        this.props.SetLoader(false);
    }

    clearAll = () => {
        this.clearContextField();
        this.clearSelected();
    }

    clearContextField = () => {
        this.setState({searchContextField: ""});
    }

    clearSelected = () => {
        let newData = this.props.tableData.map(dataItem => {
            return Object.assign({}, dataItem, {
                selected: false
            });
        });
        this.props.SetTableData(newData);
        this.setState({selectedAction: ""});
    }

    onInputUpload = async ({target}) => {
        // upload with "" for root
        const parentID = this.state.currentParent ? this.state.currentParent.documentid : "";
        const {files} = target;
        // handle 1 doc
        if (files.length === 1) {
            const uploadFile = Object.keys(files).map(key => {
                const file = files[key];
                let wb = files[key].name.split(".");
                file.fileType = "." + wb[wb.length - 1];
                file.parentID = parentID;
                file.group = this.state.currentParent ? this.state.currentParent.group_id : this.props.currentGroup;
                return file;
            });
            this.props.SetModal("upload")(newUploadModalProps(true, uploadFile));
        }
        // handle multiple docs
        else {
            let uploadfiles = Object.keys(files).map(key => {
                const file = files[key];
                let wb = file.name.split(".");
                let fileType = "." + wb[wb.length - 1];
                const newUploadFile = new File([file], file.name, {type: fileType});
                newUploadFile.fileType = fileType;
                newUploadFile.parentID = parentID
                newUploadFile.group = this.state.currentParent ? this.state.currentParent.group_id : 0;
                return newUploadFile;
            });
            this.props.UploadFiles(uploadfiles);
        }

        return target.value = null;
    }
    // *********************
    // * End Miscellaneous *
    // *********************


    // ********************
    // * Render Functions *
    // ********************
    getBreadCrumbs = () => {
        const paths = this.getUrls();
        const urls = [];
        paths.forEach(path => {
            let obj = {
                url: path,
                href: urls.length === 0 ? (`/portfolio/${path}`) : (`${urls[urls.length - 1].href}/${path}`)
            }
            urls.push(obj);
        });
        const current = urls.pop();

        // portfolio root
        if (this.state.parentid === -1) {
            return (
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="textPrimary" variant="caption">
                        All Cases
                    </Typography>
                </Breadcrumbs>
            );
        }

        // document view
        else if (this.props.currentDocumentId) {
            const _document = findById(this.props.tableData, this.props.currentDocumentId);
            return (
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/portfolio">
                        All Cases
                    </Link>
                    {
                        urls.map(url => (
                            <Link color="inherit" to={url.href} key={url.href}>
                                {url.url}
                            </Link>
                        ))
                    }
                    <Link color="textPrimary" to={current.href} variant="caption">
                        {current.url}
                    </Link>
                    <Typography color="textPrimary" variant="caption">
                        {_document.id}
                    </Typography>
                </Breadcrumbs>
            );
        }

        // case view
        else {
            return (
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/portfolio">
                        All Cases
                    </Link>
                    {
                        urls.map(url => (
                            <Link color="inherit" to={url.href} key={url.href}>
                                {url.url}
                            </Link>
                        ))
                    }
                    <Typography color="textPrimary" variant="caption">
                        {current.url}
                    </Typography>
                </Breadcrumbs>
            );
        }
    }

    getDocumentView = () => {
        console.log('check in')
        console.log("editor data", editorData)
        const {classes} = this.props;
        return (
            <div className={classes.content}>
                <div className={classes.contentcard}>
                    <div className={classes.contentcardtitle}>
                        {this.getBreadCrumbs()}
                    </div>
                    <div className={classes.documentcardbody}>
                        <EditorJs data={editorData} tools={EditorTools} onReady={this.EditorJsOnReady}/>
                    </div>
                </div>
            </div>
        );
    }

    getCard = () => {
        const cardBodyDimensions = this.getCardBodyDimensions();
        const {classes} = this.props;
        return (
            <div className={classes.content}>
                <div className={classes.contentcard}>
                    <div className={classes.contentcardtitle}>
                        {this.getBreadCrumbs()}
                    </div>
                    <div className={classes.contentcardactions}>
                        <div className={classes.leftactions}>
                            {this.createLeftActions(classes)}
                            {this.createActions(classes)}
                            {this.createEllipsisButton()}
                        </div>
                        <div className={classes.rightactions}>
                            <div>
                                <IconButton size="small"
                                            onClick={this.filterMenuButtonOnClick}
                                >
                                    <FilterListIcon/>
                                </IconButton>
                                <Menu
                                    id="fade-menu"
                                    anchorEl={this.state.anchorElFilterMenu}
                                    keepMounted
                                    open={this.state.openFilterMenu}
                                    onClose={this.filterMenuButtonOnClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem disabled={this.state.currentFilter === "all"}
                                              onClick={() => this.filterMenuButtonOnClose("all")}
                                    >
                                        All
                                    </MenuItem>
                                    <MenuItem disabled={this.state.currentFilter === "originals"}
                                              onClick={() => this.filterMenuButtonOnClose("originals")}
                                    >
                                        Originals
                                    </MenuItem>
                                    <MenuItem disabled={this.state.currentFilter === "processed"}
                                              onClick={() => this.filterMenuButtonOnClose("processed")}
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

                    <div id='documentCardBody' className={classes.contencardbody}>
                        {
                            this.state.displayContextAnswerWindow ? (
                                    <>
                                        <div>
                                            <IconButton onClick={this.closeContextAnswerWindow}>
                                                <ArrowBackIcon/>
                                            </IconButton>
                                        </div>
                                        <div className={classes.contextAnswer}>
                                            <Typography variant="h6" style={{padding: "0 20px"}}>
                                                Answer:
                                            </Typography>
                                            {
                                                this.state.displayContextAnswer ?
                                                    (
                                                        <>
                                                            <div style={{
                                                                padding: "4px 20px",
                                                                borderBottom: "1px solid rgba(150, 150, 150, 0.2)"
                                                            }}>
                                                                {this.state.searchContextAnswer.answer}
                                                            </div>
                                                            <Typography variant="h6" style={{padding: "0 20px"}}>
                                                                Context:
                                                            </Typography>
                                                            {
                                                                this.state.searchContextAnswer.context_paragraph_list.map((p, idx) => {
                                                                    return (
                                                                        <div key={idx} style={{
                                                                            padding: "4px 20px",
                                                                            borderBottom: "1px solid rgba(150, 150, 150, 0.2)"
                                                                        }}>
                                                                            {
                                                                                p.sentence_list.map((s, i) => {
                                                                                    return (
                                                                                        <span key={i}>
                                                                                        {s.text} {i === (p.sentence_list.length - 1) ? "" : " "}
                                                                                    </span>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </>
                                                    ) : (
                                                        <Skeleton width={"100%"} height={"300%"} variant="rect"/>
                                                    )
                                            }
                                        </div>
                                    </>
                                ) :
                                this.props.flowchart.bool ? (
                                    <div style={{height: cardBodyDimensions.height, width: cardBodyDimensions.width}}>
                                        <FlowChart/>
                                    </div>
                                ) : (
                                    // <PortfolioTable data={this.getData()} setData={this.setData}
                                    //                 currentFilter={this.state.currentFilter}
                                    //                 handleDblClick={this.handleDblClick}
                                    //                 changeSelectedFiles={this.changeSelectedFiles}
                                    // />
                                    <div></div>
                                )
                        }
                        <EditCaseModal open={this.state.modal["edit"].bool}
                                       handleSave={this.editCase}
                                       handleClose={this.handleEditClose}
                                       case={this.state.modal["edit"].row}
                        />
                        <CaseModal open={this.state.modal["create"].bool}
                                   handleSave={this.createCase}
                                   handleClose={() => this.setModal("create")(newCreateModalProps(false))}
                                   currentGroup={this.state.modal["create"].currentGroup}
                                   parentID={this.state.modal["create"].parentID}
                        />
                        <FolderTreeModal open={this.state.modal["move"].bool}
                                         handleSave={this.moveCase}
                                         handleClose={() => this.setModal("move")(newMoveModalProps(false, []))}
                                         case={this.state.modal["move"].row}
                                         title={`Move ${this.getSelectedTypeName()}`}
                        />
                        <FolderTreeModal open={this.state.modal["copy"].bool}
                                         handleSave={this.copyCase}
                                         handleClose={() => this.setModal("copy")(newCopyModalProps(false, null))}
                                         case={this.state.modal["copy"].row}
                                         title={`Copy ${this.getSelectedTypeName()}`}
                        />
                        <Menu
                            id="view-selection-menu"
                            anchorEl={this.state.viewAnchorEl}
                            keepMounted
                            open={Boolean(this.state.viewAnchorEl)}
                            onClose={this.handleViewClose}
                        >
                            <MenuItem onClick={() => this.handleAction("view in current tab")}>In Current Tab</MenuItem>
                            <MenuItem onClick={() => this.handleAction("view in new tab")}>In New Tab</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        );
    }

    render() {

        return (
            <>
                {
                    (this.props.location.pathname === "/portfolio/" || this.state.redirect) ? (
                        <Redirect to="/portfolio"/>) : (null)
                }
                {
                    (this.props.location.pathname === this.props.match.url && this.props.currentDocumentId) ? this.getDocumentView() : (null)
                }
                {
                    (this.props.location.pathname === this.props.match.url && !this.props.currentDocumentId) ? this.getCard() : (null)
                }
                {this.createLeftActionsTest(this.props.classes)}
                <PortfolioTable data={this.getData()} setData={this.setData} currentFilter={this.state.currentFilter}
                                handleDblClick={this.handleDblClick} changeSelectedFiles={this.changeSelectedFiles}/>
                <Route path={`${this.props.match.path}/:id`}>
                    <PortfolioCard/>
                </Route>
            </>
        );
    }

    // ************************
    // * End Render Functions *
    // ************************
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(useStyles)(PortfolioCard)));
