import React, {useState, useEffect, useRef, createRef, useCallback, useLayoutEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import {Redirect, useLocation, useRouteMatch, Link} from "react-router-dom";
import {EditorTools} from "../../models/editorConstants";
import {rootContainerFullWithTheme} from "../styles/containerStylesWithTheme";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import {borders} from "../styles/globalStyles";
import CircularProgress from '@material-ui/core/CircularProgress';
import {Api} from "../Api";
import IconButton from "@material-ui/core/IconButton";
import InputIcon from '@material-ui/icons/Input';
import Tooltip from "@material-ui/core/Tooltip";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import CustomParagraph from "../Editor/CustomParagraph/CustomParagraph";
import CustomDate from "../Editor/CustomDate/CustomDate";
import OriginalContextModal from "../Modal/OriginalContextModal";
import DefinitionModal from "../Modal/DefinitionModal";
import OriginalContextTool from "../Editor/OriginalContextTool/OriginalContextTool";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from '@material-ui/icons/Minimize';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import PaletteIcon from '@material-ui/icons/Palette';
import AssistantIcon from '@material-ui/icons/Assistant';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from "@material-ui/icons/Edit";
import Avatar from "@material-ui/core/Avatar";
import Popover from "@material-ui/core/Popover";
import NavSkeleton from "../Nav/NavSkeleton";
import Skeleton from "@material-ui/lab/Skeleton";
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TextField from '@material-ui/core/TextField';
import {lighten} from "@material-ui/core/styles/colorManipulator";
import { getPhraseColor } from "../utils/getPhraseColor";
import MenuList from '@material-ui/core/MenuList';
import EditorBlock from "../EditorBlock/EditorBlock";
import HeaderBlock from "../EditorBlock/HeaderBlock";
import ParagraphBlock from "../EditorBlock/ParagraphBlock";
import SentenceBlock from "../EditorBlock/SentenceBlock";
import DisplayDefinitionButton from "../Button/DisplayDefinitionButton";
import {PlayArrow} from "@material-ui/icons";
import {Slider, TextareaAutosize} from "@material-ui/core";
import newFlowChartProps from "../NewProps/newFlowChartProps";
import newAIOperationActionPayload from "../NewProps/newAIOperationActionPayload";
import newAiOperationModalProps from "../NewProps/newAiOperationModalProps";
import PortfolioTableForDocView from "./PortfolioTableForDocView";

// VIEW CONSTS
const TEXT_EDITOR = "TEXT_EDITOR";
const TEXT_VIEWER = "TEXT_VIEWER";

const initialDisplayOriginal = {
    display: false,
    data: {},
    response: false,
    json: null,
    x: 0,
    y: 0,
    width: 0,
    params: {},
}

const initialDisplayDefinition = {
    display: false,
    x: 150,
    y: 150,
    width: 400,
    json: null
}

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings,
        current_word_mouse_hover: state.eventManager.current_word_mouse_hover,
        current_sentence_mouse_hover: state.eventManager.current_sentence_mouse_hover,
    }
}

const useStyles = makeStyles((theme) => ({
    content: {
        ...rootContainerFullWithTheme(theme),
        flexDirection: "column",
        // height: "calc(100% - 112px)",
        // width: "calc(100% - 64px)",
        margin: "16px 0 32px",
        overflow: "visible",
        justifyContent: "flex-start"
    },
    contentview: {
        width: "100%",
        // height: "calc(100% - 40px)",
        display: "flex"
    },
    contentviewleft: {
        flex: "1 1 50%",
        display: "flex",
        order: 1
    },
    contentviewright: {
        flex: "1 1 calc(50% - 10px)",
        width: "calc(50% - 10px)",
        paddingLeft: "10px",
        display: "flex",
        order: 2
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
    contentcardtitleactions: {
        position: "absolute",
        display: "inline-block",
        right: "8px",
        "& .MuiIconButton-root": {
            height: "24px",
            width: "24px",
            padding: "0",
            marginLeft: "4px"
        },
    },
    contentcardbackbutton:{
        display: "inline-block",
        marginRight: "10px",
        "& .MuiIconButton-root": {
            padding: 0
        }
    },
    colorLegendPopover: {
        padding: "8px"
    },
    colorLegendSquare: {
        width: "10px",
        height: "10px",
        display: "inline-block"
    },
    colorLegendLabel: {
        marginLeft: "8px"
    },
    context: {
        width: "100%",
        height: "100%",
        minHeight: "65vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
        padding: "0",
        overflow: "visible",
        background: theme.palette.background.paper,
        border: borders.border,
        "& .ce-toolbar__content": {
            [theme.breakpoints.down('md')]: {
                maxWidth: "calc(100% - 32px)"
            },
            [theme.breakpoints.up('lg')]: {
                maxWidth: "calc(100% - 300px)"
            },
        },
        "& .ce-block__content": {
            [theme.breakpoints.down('md')]: {
                maxWidth: "calc(100% - 32px)"
            },
            [theme.breakpoints.up('lg')]: {
                maxWidth: "calc(100% - 300px)"
            },
        },
        "& .cdx-block": {
            fontSize: "14px"
        },
        "& .ce-block": {
            borderBottom: "1px solid rgba(150, 150, 150, 0.2)"
        },
        "& .original-context--active": {
            border: "1px solid #4087FF",
            borderBottom: "1px solid #4087FF"
        }
    },
    documentcardbody: {
        height: "auto",
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        "& .original-context--active": {
            border: "1px solid #4087FF",
            borderBottom: "1px solid #4087FF"
        },
    },
    small: {
        "& .editor-date-time": {
            position: "relative",
            left: "-32px",
            top: "4px",
        }
    },
    contentheader: {
        width: "100%",
        height: "40px",
        flexBasis: "40px",
        flexGrow: "0",
        flexShrink: "0",
        ...theme.typography.h6
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
    floatRight: {
        position: "absolute",
        right: 0,
        display: "inline-block"
    },
    descriptionfiller: {
        ...theme.typography.caption,
        color: "rgba(0, 0, 0, 0.67)",
    },
    contexttitle: {
        width: "100%",
        boxSizing: "border-box",
        paddingTop: "0",
        paddingBottom: "0",
        height: "32px",
        display: "flex",
        padding: "0 8px",
        alignItems: "center",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
        ...theme.typography.body1,
        fontSize: "12px",
    },
    contextcontent: {
        height: "calc(100% - 32px)",
        overflow: "auto",
        padding: "0 8px",
        ...theme.typography.body2,
        fontFamily: "inherit",
        lineHeight: "unset",
        letterSpacing: "unset",
        "& .MuiTypography-body1": {
            fontSize: "14px",
        },
    },
    titleActions: {
        position: "absolute",
        top: "0",
        right : "4px"
    },
    searchBlock: {
        display: "flex",
        padding: "6px 0",
        borderBottom: "1px solid rgba(150, 150, 150, 0.2)",
    },
    searchContent: {
        display: "overflow",
        height: "calc(100% - 86px)"
    },
    searchTextField: {
        display: "flex",
        flex: "1",
        alignItems: "flex-end",
        padding: "0 6px",
        position: "relative"
    },
    searchClear: {
        display: "flex",
        alignItems: "flex-end",
        padding: "4px 4px 4px 0px"
    },
    searchConfirm: {
        display: "flex",
        alignItems: "flex-end",
        "& .MuiButtonBase-root": {
            height: "54px"
        },
        paddingBottom: "2px"
    },
    searchDropDown: {
        width: "200px",
        "& .MuiFormControl-root": {
            width: "100%"
        }
    },
    blockinputbtn: {
        position: "absolute",
        right: "-50px",
        top: "-8px"
    },
    greenColor: {
        color: "#208d68"
    },
    spinnerContainer: {
        flex: "1 1 calc(50% - 10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        order: 2
    },
    verticalFlexContainer: {
        minHeight:"60vh",
        display: "flex",
        flexDirection: "column"
    },
    formContainer:{
        display: "grid",
        gridTemplateColumns: "1fr 2fr 2fr 2fr",
        alignItems: 'center',
        margin: "15px 0",
        gap: "20px"
    },
    resultOutput:{
        flex: "1 1 auto",
        display: "block",
        width: "100%",
        minHeight: "40px",
        resize: "none",
        boxSizing: "border-box",
        padding: 5,
        "&:focus":{
            outlineColor: "#208d68"
        }
    },
    summaryRatioContainer: {
        // paddingTop: '5px',
        display: 'flex',
        flexDirection: 'column'
    },
    downloadSaveContainer: {
        display: "flex",
        marginTop: "20px",
        gap: "20px",
    }
}));

export function DocumentViewSummary(props){
    const classes = useStyles(props);
    const { url } = useRouteMatch();
    const { search } = useLocation();
    const [currentParent, setCurrentParent] = useState(null);
    // holds document data for the selected original context
    const [summaryData, setSummaryData] = useState(null);
    const [openParentDescription, setOpenParentDescription] = useState(false);
    // false: shows spinner; true: shows editor with data
    const [dataLoaded, setDataLoaded] = useState(false);
    const [displaySideView, setDisplaySideView] = useState(false);
    const [sideDocumentData, setSideDocumentData] = useState([]);
    const [originalDocumentData, setOriginalDocumentData] = useState([]);
    const [displaySearchPhraseWindow, setDisplaySearchPhraseWindow] = useState(true);// was false
    // current marked glossary element
    const [markedGlossaryEl, setMarkedGlossaryEl] = useState(null);
    // phrases for search dropdown; populated before search window opens
    const [phraseDropDownOptions, setPhraseDropDownOptions] = useState([]);
    const [phraseColorList, setPhraseColorList] = useState([]);
    // user selected option from dropdown
    const [selectedPhraseOption, setSelectedPhraseOption] = useState("");
    const [searchPhraseDataLoaded, setSearchPhraseDataLoaded] = useState(false);
    const [searchPhraseData, setSearchPhraseData] = useState([]);
    const [questionAnswerData, setQuestionAnswerData] = useState("");
    // sentences displayed from search
    const [phraseSentences, setPhraseSentences] = useState([]);
    // editor data
    const [data, setData] = useState([]);
    const [originalLinks, setOriginalLinks] = useState([]);
    // original data with all keys
    const [originalData, setOriginalData] = useState([]);
    // redirect if document doesnt exist
    const [redirect, setRedirect] = useState(false);
    const [currentRootFilter, setCurrentRootFilter] = useState("all");
    // color legend
    const [openColorLegend, setOpenColorLegend] = useState(false);
    const [colorLegendAnchorEl, setColorLegendAnchorEl] = React.useState(null);
    const [openEditorMenu, setOpenEditorMenu] = useState(false);
    const [editorMenuEl, setEditorMenuEl] = React.useState(null);
    const originaltextbodyref = useRef(null);
    // data for original context modal; initial state: _setDisplayOriginal(initialDisplayOriginal);
    const [displayOriginal, _setDisplayOriginal] = useState(initialDisplayOriginal);
    const [displayDefinition, setDisplayDefinition] = useState(initialDisplayDefinition);
    const displayOriginalRef = useRef(null);
    const [beforeExtraContext, setBeforeExtraContext] = useState([]);
    const [afterExtraContext, setAfterExtraContext] = useState([]);
    const [editorView, setEditorView] = useState(TEXT_EDITOR);
    const [searchContextField, setSearchContextField] = React.useState("");
    let paragraphRefs = [];
    let sentenceRefs = useRef([]);
    let sideSentenceRefs = useRef([]);
    let wordRefs = useRef([]);
    let sideWordRefs = [];
    let documentcardelement = useRef(null);
    let sidedocumentcardelement = useRef(null);
    let documenteventadded = false;
    let needsondocscroll = useRef(false);
    const currentSentenceMouseHover = useRef(null);
    const currentPhraseMouseHover = useRef(null);

    const [method, setMethod] = useState(0);
    const [dictionary, setDictionary] = useState("DICTIONARY");
    const [isDocShown, setIsDocShown] = useState(false);
    const [docIdToShow, setDocIdToShow] = useState(props.document.length === 1 ? props.document[0].documentid : null);
    const [isLoading, setIsLoading] = useState(false);
    const [summaryRatio, setSummaryRatio] = useState(5);
    const [result, setResult] = useState("");

    const changeMethod = (event) => {
        setMethod(event.target.value)
    }

    const changeDictionary = (event) => {
        setDictionary(event.target.value)
    }

    const toggleEditorView = async (view) => {
        setEditorView(view);
        handleCloseEditorMenu();
    }

    const sliderOnChange = (event, value) => {
        setSummaryRatio(value)
    }

    const handleRun = async() => {

        let glossarylookup = [];
        // if (fields.category.includes("medical")) glossarylookup.push(1);
        // if (fields.category.includes("wireless")) glossarylookup.push(2);

        // console.log(props.aioperation, "aioperation")
        const body = {
            name: "",
            documenttype: props.document[0].documenttype,
            parent: props.document[0].parent_id,
            group: props.document[0].group_id,
            description: "",
            algorithmtype: 2,
            original_doc_id: props.document.map(row => row.documentid),
            textdivisiontype: method,
            get_documentglossarylookup_set: glossarylookup,
            summary_ratio: summaryRatio,
        }
        console.log("body", body);
        // console.log()

        const response = await Api.reprocessDocument(body);
        if (!response) return setRedirect(true);
        const resultSummary = response._json;
        setResult(resultSummary);
    }

    // boolean to toggle original context dock
    const [dockOriginalContext, setDockOriginalContext] = useState(false);
    // boolean opens FormatDateModal
    const [openFormatDateModal, setOpenFormatDateModal] = useState(false);
    const setDisplayOriginal = async (bool, data, params = {x: 0, y: 0, width: 0, height: 0}) => {
        let [px, py] = getOffsetXY(documentcardelement.current);
        if (params.height >= documentcardelement.current.offsetHeight / 2) setDockOriginalContext(true);

        _setDisplayOriginal({
            display: true,
            data: data,
            response: false,
            json: null,
            x: params.x + px,
            y: params.y + py - documentcardelement.current?.scrollTop,
            width: params.width + 16,
            params: params,
        });
        setBeforeExtraContext([]);
        setAfterExtraContext([]);
        // if true query for data
        if (bool) {
            const response = await Api.getSearchSummaryContext(data.sectionid);
            let json = response._json;
            let string = json.sentence_list.reduce((string, s) => {return (string + " " + s.text)}, "");
            if (response?._json) {
                _setDisplayOriginal({
                    display: true,
                    data: data,
                    response: true,
                    json: string,
                    x: params.x + px,
                    y: params.y + py - documentcardelement.current?.scrollTop,
                    width: params.width + 16,
                    params: params,
                });
            }
        }
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
    const queries = getQueryFormat(search);

    //  search 1s
    const getQuery = (qs, param, docId) => {

        // console.log('param', param);
        // console.log('param.find', qs.find(q => q.param === param))
        // return qs.find(q => q.param === param);
        console.log('prors document', `${docId}`);
        return {param: 'view', value: `${docId}`};
    }
    // queryView.value = id of document
    // search 3

    const findSentenceSpan = useCallback((sentence_id) => {
        let sentence = sentenceRefs.current.find(s => +s.sentence_id === +sentence_id);
        if (sentence) return sentence.ref;
        else return undefined;
    }, [sentenceRefs?.current]);

    const findSideSentenceSpan = useCallback((sentence_id) => {
        let sentence = sideSentenceRefs.current.find(s => +s.sentence_id === +sentence_id);
        if (sentence) return sentence.ref;
        else return undefined;
    }, [sideSentenceRefs?.current]);

    const getOffsetXY = (element, x = 0, y = 0) => {
        x += element.offsetLeft;
        y += element.offsetTop;
        if (element.offsetParent) {
            return getOffsetXY(element.offsetParent, x, y);
        }
        else {
            return [x, y];
        }
    }

    const dockOriginalContextModal = () => {
        setDockOriginalContext(true);
        _setDisplayOriginal({
            ...displayOriginal,
            display: false
        });
    }

    const undockOriginalContextModal = () => {
        setDockOriginalContext(false);
        _setDisplayOriginal({
            ...displayOriginal,
            display: true
        });
    }

    const createMoreContextObj = (newparagraphid, text) => {
        const obj = {
            id: newparagraphid,
            text: text
        }
        return obj;
    }

    const getMoreContext = async (status = 1) => {
        // Next = 1; Previous = 2;
        if (status === 2) {
            const targetid = beforeExtraContext.length > 0 ? beforeExtraContext[0].id : displayOriginal.data.paragraphid;
            const response = await Api.getMoreContext(targetid, status);
            const json = response?._json;
            if (!json || !json?.sentence_list) return;
            const string = json.sentence_list.reduce((str, sentence) => str + sentence.text, "");
            const newObj = createMoreContextObj(targetid - 1, string);
            const newBeforeExtraContext = [newObj, ...beforeExtraContext];
            setBeforeExtraContext(newBeforeExtraContext);
        }

        if (status === 1) {
            const targetid = afterExtraContext.length > 0 ? afterExtraContext[afterExtraContext.length - 1].id : displayOriginal.data.paragraphid;
            const response = await Api.getMoreContext(targetid, status);
            const json = response?._json;
            if (!json || !json?.sentence_list) return;
            const string = json.sentence_list.reduce((str, sentence) => str + sentence.text, "");
            const newObj = createMoreContextObj(targetid + 1, string);
            const newAfterExtraContext = [...afterExtraContext, newObj];
            setAfterExtraContext(newAfterExtraContext);
        }
    }

    const handleSearchContextChange = (event) => {
        setSearchContextField(event.target.value);
    };

    const clearSearch = () => {
        setSelectedPhraseOption("");
        setSearchContextField("");
    }

    const resetOriginalContextModalPosition = () => {
        _setDisplayOriginal({
            ...displayOriginal
        });
    }

    const closeDockOriginalContext = () => {
        setDockOriginalContext(false);
        closeOriginalContextModal();
    }

    const closeDefinitionModal = () => {
        setDisplayDefinition(initialDisplayDefinition);
    }

    const closeOriginalContextModal = () => {
        _setDisplayOriginal(initialDisplayOriginal);
        setBeforeExtraContext([]);
        setAfterExtraContext([]);
    }

    const handleOpenEditorMenu = (event) => {
        setOpenEditorMenu(true);
        setEditorMenuEl(event.currentTarget);
    }

    const handleCloseEditorMenu = () => {
        setOpenEditorMenu(false);
        setEditorMenuEl(false);
    }

    const handleOpenColorLegend = (event) => {
        setOpenColorLegend(true);
        setColorLegendAnchorEl(event.currentTarget);
    }

    const handleCloseColorLegend = () => {
        setOpenColorLegend(false);
        setColorLegendAnchorEl(null);
    }

    const clearRefs = () => {
        wordRefs.current.length = 0;
        paragraphRefs.length = 0;
        sentenceRefs.current.length = 0;
        sideSentenceRefs.current.length = 0;
    }

    const setWordRef = (phrase) => (ref) => {
        let existingWord = wordRefs.current.find(_word => _word.phrase_id === phrase.phrase_id);
        if (existingWord) {
            existingWord.ref = ref;
        }
        else {
            wordRefs.current.push(Object.assign({}, phrase, {
                ref: ref
            }));
        }
    }

    const setSentenceRef = (sentence) => (ref) => {
        let existingSentence = sentenceRefs.current.find(_sentence => _sentence.sentence_id === sentence.sentence_id);
        if (existingSentence) {
            existingSentence.ref = ref;
        }
        else {
            sentenceRefs.current.push(Object.assign({}, sentence, {
                ref: ref
            }));
        }
    }

    const setSideSentenceRef = (sentence) => (ref) => {
        let existingSentence = sideSentenceRefs.current.find(_sentence => _sentence.sentence_id === sentence.sentence_id);
        if (existingSentence) {
            existingSentence.ref = ref;
        }
        else {
            sideSentenceRefs.current.push(Object.assign({}, sentence, {
                ref: ref
            }));
        }
    }

    const setParagraphRef = (paragraph) => (ref) => {
        // paragraphRefs.push({
        //     ...paragraph,
        //     ref: ref
        // });
    }

    // initial data set, data: table data, algtype: aioperation type
    const cleanData = (data, algtype) => {
        const newData = data.map(block => {
            const obj = {
                type: block.type
            };
            switch (block.type) {
                case "paragraph":
                    if (algtype === 3) {
                        obj.type = "customdate";
                        obj.data = {
                            ...block.data,
                            level: block.data.level,
                            sectionid: block.sectionid,
                            selecttext: false,
                            displayoriginal: false,
                            text: block.data.summary_sentence_list.map(s => s.text).join(" "),
                            date: block.data.time_line_header,
                            summary_sentence_list: block.data.summary_sentence_list,
                            summary_phrase_list: block.data.summary_sentence_list.reduce((arr, sentence) => {
                                return arr.concat(sentence?.phrase_list || []);
                            }, [])
                        }
                    }
                    else {
                        obj.type = "customparagraph";
                        obj.data = {
                            //...block.data,
                            level: block.data.level,
                            selecttext: false,
                            displayoriginal: false,
                            sectionid: block.sectionid,
                            text: block.data.summary_sentence_list.map(s => s.text).join(" "),
                            summary_sentence_list: block.data.summary_sentence_list,
                            summary_phrase_list: block.data.summary_sentence_list.reduce((arr, sentence) => {
                                return arr.concat(sentence?.phrase_list || []);
                            }, [])
                        }
                    }
                    if (obj.data.summary_sentence_list.length > 0) obj.data.summary_sentence_list = obj.data.summary_sentence_list.map(sentence => {
                        if (sentence.phrase_list && sentence.phrase_list?.length > 0) {
                            sentence.glossary = sentence.phrase_list.map(phrase => phrase.text.replace(/[()\[\]|]/g, '\\$&'));
                            const reg = `(${sentence.glossary.join("|")})`;
                            let begin_regex = "(?<=[\\n\\r\\s])(";
                            let middle_regex = ")(?=[\\n\\r\\s,s'.!?])|(^";
                            let end_regex = ")(?=[\\n\\r\\s,s'.!?])";
                            let regex = `${begin_regex}${reg}${middle_regex}${reg}${end_regex}`; //begin_regex + reg + middle_regex + reg + end_regex
                            let textsplit = [];
                            let textsplitfilter = [];
                            try {
                                textsplit = sentence.text.split(new RegExp(regex, "gi"));
                                textsplitfilter = textsplit.filter((t, index) => !!t && textsplit.indexOf(t) === index);
                            }
                            catch (error) {
                                console.log("error", error);
                            }

                            sentence.elements = textsplitfilter.map(t => {
                                let phrase = sentence.phrase_list.find(phrase => phrase.text?.toLowerCase() === t?.toLowerCase());
                                if (phrase) {
                                    return phrase;
                                }
                                else {
                                    return t;
                                }
                            });
                        }
                        else {
                            sentence.elements = [sentence.text];
                        }
                        return sentence;
                    });
                    return obj;
                case "header":
                    obj.data = {
                        text: block.data.summary_sentence_list.map(s => s.text).join(" "),
                        level: block.data.level
                    }
                    return obj;
                default:
                    return obj;
            }
        });
        // let [sentences, phrases] = newData.reduce((arr, d) => {
        //     if (d.type !== 'header') {
        //         arr[0] = arr[0].concat(d.data.summary_sentence_list);
        //         arr[1] = arr[1].concat(d.data.summary_phrase_list);
        //     }
        //     return arr;
        // }, [[], []]);
        return newData;
    }

    const getId = async (docId) => {
        // get doc data
        const queryView = getQuery(queries, "view", docId);
        const response = await Api.getDocument(queryView.value);
        const data = response?._json;
        setCurrentParent(data);
        // get doc data for summary
        const response2 = await Api.getDocument(data.documentid);
        const sumdata = response2?._json;
        setSummaryData(sumdata);
        return data;
    }

    const initStaticData = (data) => {
        return data.map(block => {
            switch (block.type) {
                case "header": {
                    let sentence_list = [];
                    block.data.summary_sentence_list.forEach(sentence => {
                        if (sentence_list.findIndex(_s => _s.text === sentence.text) === -1) {
                            sentence_list.push(sentence);
                        }
                    });
                    let text = sentence_list.map(s => s.text).join("");
                    return {
                        ...block,
                        text: text,
                    }
                }
                default: {
                    let summary_phrase_list = block.data.summary_sentence_list.reduce((arr, sentence) => {
                        return arr.concat(sentence?.phrase_list || []);
                    }, []);
                    let summary_sentence_list = block.data.summary_sentence_list.map(sentence => {
                        if (sentence.phrase_list && sentence.phrase_list?.length > 0) {
                            sentence.glossary = sentence.phrase_list.map(phrase => phrase.text.replace(/[()\[\]|]/g, '\\$&'));
                            const reg = `(${sentence.glossary.join("|")})`;
                            let begin_regex = "(?<=[\\n\\r\\s])(";
                            let middle_regex = ")(?=[\\n\\r\\s,s'.!?])|(^";
                            let end_regex = ")(?=[\\n\\r\\s,s'.!?])";
                            let regex = `${begin_regex}${reg}${middle_regex}${reg}${end_regex}`; //begin_regex + reg + middle_regex + reg + end_regex
                            let textsplit = [];
                            let textsplitfilter = [];
                            try {
                                textsplit = sentence.text.split(new RegExp(regex, "gi"));
                                textsplitfilter = textsplit.filter((t, index) => !!t && textsplit.indexOf(t) === index);
                            }
                            catch (error) {
                                console.log("error", error);
                            }

                            sentence.elements = textsplitfilter.map(t => {
                                let phrase = sentence.phrase_list.find(phrase => phrase.text?.toLowerCase() === t?.toLowerCase());
                                if (phrase) {
                                    return phrase;
                                }
                                else {
                                    return t;
                                }
                            });
                        }
                        else {
                            sentence.elements = [sentence.text];
                        }
                        return {
                            ...sentence,
                            ref: createRef(null)
                        }
                    });

                    return {
                        type: block.type,
                        text: block.data.summary_sentence_list.map(s => s.text).join(" "),
                        summary_sentence_list: summary_sentence_list,
                    }
                }
                    break;
            }
        });
    }

    // Original Text On Side View
    const getOriginalText = async (docId) => {
        const queryView = getQuery(queries, "view", docId);
        const response = await Api.getOriginalTextFromAlgorithm(queryView.value);
        const json = response._json;
        console.log("get text", json)
        const _sideDocumentData = cleanData(json);
        console.log("_sideDocumentData", _sideDocumentData)
        needsondocscroll.current = true;
        setSideDocumentData(_sideDocumentData);
    }

    // Original Text on Main View
    const getOriginalDocument = async (_data, docId) => {
        const queryView = getQuery(queries, "view", docId);
        const response = await Api.getOriginalTextFromOriginalDocument(queryView.value);
        const json = response._json;
        console.log("get doc", json)
        const _originalDocumentData = cleanData(json, _data.algorithmtype);
        setOriginalDocumentData(_originalDocumentData);
        setDataLoaded(true);
        setIsLoading(false);
    }

    // Summary Text on Main View
    const getSummary = async (_data, docId) => {
        console.log(_data, "getSummary")
        const queryView = getQuery(queries, "view", docId);
        const response = await Api.getSummaryByDocID(queryView.value);
        if (!response) return setRedirect(true);
        const summary = response._json;
        setOriginalData(summary);
        const _summarydata = cleanData(summary, _data.algorithmtype);
        setData(_summarydata);
        setDataLoaded(true);
        setIsLoading(false);
    }

    const isElementVisible = (el, target) => {
        if (!el) return false;
        var rect     = el.getBoundingClientRect(),
            vWidth   = target.clientWidth,
            vHeight  = target.clientHeight,
            efp      = function (x, y) { return document.elementFromPoint(x, y) };

        // Return false if it's not in the viewport
        if (rect.right < 0 || rect.bottom < 0
            || rect.left > vWidth || rect.top > vHeight)
            return false;

        // Return true if any of its four corners are visible
        return (
            el.contains(efp(rect.left,  rect.top))
            ||  el.contains(efp(rect.right, rect.top))
            ||  el.contains(efp(rect.right, rect.bottom))
            ||  el.contains(efp(rect.left,  rect.bottom))
        );
    }

    const onDocScroll = useCallback((event) => {
        if (needsondocscroll.current) {
            const sentenceBlocks = sentenceRefs.current.map(sentence => sentence.ref);
            const visibleBlocks = sentenceRefs.current.filter(sentence => isElementVisible(sentence.ref, event.target));
            if (visibleBlocks && visibleBlocks[0]) {
                const sideSentenceSpan = findSideSentenceSpan(visibleBlocks[0]?.sentence_id);
                if (sideSentenceSpan && sidedocumentcardelement.current) {
                    console.log({
                        sentences: visibleBlocks.map(s => s.ref),
                        originalSentence: visibleBlocks[0].ref,
                        sideSentenceSpan: sideSentenceSpan,
                        sideSentenceSpanParent: sideSentenceSpan.parentElement,
                    })
                    sidedocumentcardelement.current.scrollTop = sideSentenceSpan.offsetParent.offsetTop - sidedocumentcardelement.current.offsetTop;
                    console.log("scrollTop", sideSentenceSpan.offsetParent.offsetTop - sidedocumentcardelement.current.offsetTop);
                }
            }
        }
    }, [needsondocscroll?.current, sentenceRefs?.current]);

    const openSearchPhraseView = () => {
        setDisplaySearchPhraseWindow(true);
        setSearchPhraseDataLoaded(true);
    }

    const closeSearchPhraseView = () => {
        setDisplaySearchPhraseWindow(false);
        setSelectedPhraseOption("");
        setSearchPhraseDataLoaded(true);
    }

    const getPhraseColors = async () => {
        const response = await Api.getTextColorPhraseTypes();
        const json = response?._json;
        if (!json) return;
        setPhraseColorList(json.sort((a, b) => a.phrase_id < b.phrase_id ? -1 : 1));
    }

    const getPhraseTypes = async () => {
        const response = await Api.getPhraseTypes();
        const json = response?._json;
        if (!json) return;
        setPhraseDropDownOptions(json.sort((a, b) => a.phrase_id < b.phrase_id ? -1 : 1));
    }

    const handleSearchConfirm = (event) => {
        setQuestionAnswerData("");
        setSearchPhraseData([]);
        if (searchContextField !== "" && selectedPhraseOption === "") {
            getQuestionAnswer(event, searchContextField);
        }
        else if (selectedPhraseOption !== "" && searchContextField === "") {
            getPhrases(event);
        }
    }

    const configSentences = (data) => {
        return data.map(s => {
            if (s.phrase_list.length > 0) {
                const glossary = s.phrase_list.map(phrase => phrase.text.replace(/[()\[\]|]/g, '\\$&')).filter(g => !g.includes("[", "]", "(", ")"));
                const reg = `(${glossary.join("|")})`;
                let begin_regex = "(?<=[\\n\\r\\s])(";
                let middle_regex = ")(?=[\\n\\r\\s,s'.!?])|(^";
                let end_regex = ")(?=[\\n\\r\\s,s'.!?])";
                let regex = `${begin_regex}${reg}${middle_regex}${reg}${end_regex}`; //begin_regex + reg + middle_regex + reg + end_regex
                let textsplit = [];
                let textsplitfilter = [];
                try {
                    textsplit = s.text.split(new RegExp(regex, "gi"));
                    textsplitfilter = textsplit.filter((t, index) => !!t && textsplit.indexOf(t) === index);
                }
                catch (error) {
                    console.log("error", error);
                }
                return {
                    ...s,
                    elements: textsplitfilter.map(t => {
                        let phrase = s.phrase_list.find(phrase => phrase.text?.toLowerCase() === t?.toLowerCase());
                        return phrase || t;
                    })
                };
            }
            else {
                return {
                    ...s,
                    elements: [s.text]
                }
            }
        });
    }

    const getQuestionAnswer = async (event, question, originaldocuments = originalLinks, docId) => {
        const queryView = getQuery(queries, "view", docId);
        setSearchPhraseDataLoaded(false);
        const request = {
            question: question,
            compare_document_list: [+queryView.value],
            is_long_form: true
        }
        const response = await Api.getQuestionAnswered(request);
        if (!response) return;
        const json = response?._json;
        let data = json?.context_paragraph_list.map(paragraph => {
            paragraph.sentence_list = configSentences(paragraph.sentence_list);
            return paragraph;
        });
        setQuestionAnswerData(json.answer);
        setSearchPhraseData(data);
        setSearchPhraseDataLoaded(true);
    }

    const getPhrases = async (event, originaldocuments = originalLinks, phraseid = selectedPhraseOption) => {
        setSearchPhraseDataLoaded(false);
        const promises = originaldocuments.map(documentid => {
            return Api.getPhrasesByPhraseType(documentid, phraseid);
        });
        const responses = await Promise.all(promises);
        const json = responses.reduce((arr, r) => {
            if (r?._json && Array.isArray(r._json)) {
                return arr.concat(r._json);
            }
            else {
                return arr;
            }
        }, []);
        const sentences = configSentences(json);
        setSearchPhraseData(sentences);
        setSearchPhraseDataLoaded(true);
    }

    const requestSummary = async(docId) => {
        // value exists, get doc summary
        await setIsLoading(true);
        let queries = getQueryFormat(search);
        const queryView = getQuery(queries, "view", docId);
        if (queryView.value && queryView.value.length > 0) {
            console.log("queryView", queryView)
            clearRefs();

            getId(docId).then(data => {

                if (data.algorithmtype === 1) {
                    console.log('effect 1')
                    setEditorView(TEXT_VIEWER);
                    setOriginalLinks([data.documentid]);
                    getOriginalDocument(data,docId);
                    getPhraseTypes();
                    getPhraseColors();
                }
                else if (data.algorithmtype > 1) {
                    console.log('effect 2')
                    const _originalLinks = data.original_document_list.map(d => d.documentid);
                    setEditorView(TEXT_EDITOR);
                    setOriginalLinks(_originalLinks);
                    console.log("data", data)
                    getSummary(data, docId);
                    getOriginalText(data.documentid);
                    getPhraseTypes();
                    getPhraseColors();
                }

            })
        }
        // value doesn't exist
        else {
            setRedirect(true);
        }

        // let queries = getQueryFormat(search);
        let currentRootFilter = "all";
        if (queryCheck(queries, "fuser")) {
            const userid = getQuery(queries, "fuser", docId);
            currentRootFilter = "self";
        }
        else if (queryCheck(queries, "fgroup")) {
            const groupid = getQuery(queries, "fgroup", docId);
            currentRootFilter = +groupid.value;
        }
        setCurrentRootFilter(currentRootFilter);
    }

    useEffect(() => {
        if(props.document.length === 1 || isDocShown){
            requestSummary(docIdToShow);
        }
    },[docIdToShow, isDocShown])
    useEffect(() => {
        return () => {
            if (documentcardelement.current && onDocScroll && needsondocscroll) {
                needsondocscroll.current = false;
                documenteventadded = false;
                documentcardelement.current?.removeEventListener("scroll", onDocScroll);
            }
            //clearRefs();
        }
    }, []);

    useEffect(() => {
        displayOriginalRef.current = displayOriginal;
    }, [displayOriginal]);

    const createDocRef = (element) => {
        if (!documenteventadded) {
            documentcardelement.current = element;
            documenteventadded = true;
            element.addEventListener("scroll", onDocScroll);
        }
    }

    const createSideDocRef = (element) => {
        sidedocumentcardelement.current = element;
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
    // search 2
    const renderRootBreadcrumbText = () => {
        // console.log('currentRootFilter', props)
        const company = props.userSettings.groups.find(company => company.id === props.document[0].group_id)

        switch (currentRootFilter) {
            case "all":
                return "All Files";
            case "self":
                return "All My Files";
            default:
                // return props.userSettings.groups.find(g => g.id === currentRootFilter)?.name + " Files";
            return `${company.name} Files`;
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

    const getUrls = () => {
        return url.replace("-", " ").split("/").filter(link => !["", "portfolio"].includes(link));
    }

    const getBreadCrumbs = () => {
        if (currentParent === null) return (<></>);

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
                        <Link color="inherit" to={url.href} key={url.href} >
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

    const phraseDropDownOnChange = (event) => {
        setSelectedPhraseOption(event.target.value);
    }

    const scrollToSentence = (sentence_id) => {
        const sentence = findSentenceSpan(sentence_id);
        if (sentence) {
            const offset = sentence.offsetTop + sentence.offsetParent.offsetTop;
            documentcardelement.current.scrollTop = offset;
        }
    }

    const scrollToSentenceRef = (ref) => {
        if (ref && ref.offsetTop) {
            const offset = ref.offsetTop + documentcardelement.current.offsetTop;
            documentcardelement.current.scrollTop = offset;
        }
    }

    const scrollToSideSentence = (sentence_id) => {
        const sentence = findSideSentenceSpan(sentence_id);
        if (sentence) {
            const offset = sentence.offsetTop + sentence.offsetParent.offsetTop + documentcardelement.current.offsetTop + 100;
            originaltextbodyref.current.scrollTop = offset;
        }
    }

    const handleDisplayDefinition = (phrase, params = { x: 150, y: 150 }) => {
        setDisplayDefinition({
            ...displayDefinition,
            ...params,
            display: true,
            json: phrase
        })
        // phrase.text is word;
        // phrase.glossary_def is definition;
        // phrase.glossary_weight is weight of word;
    }

    const openSideView = () => {
        setDisplaySideView(true);
    }

    const closeSideView = () => {
        setDisplaySideView(false);
    }

    const backToFiles = () => {
        setIsDocShown(false);
        setCurrentParent(null);
        setData(null);
    }

    const renderTextEditor = (classes) => {
        console.log("renderTextEditor called")
        return (
            <div className={`${classes.contentview}`}>
                {
                    !isLoading ? (
                        <div
                            className={displaySearchPhraseWindow ? `${classes.contentviewright}` : `${classes.contentviewleft}`}>
                            {
                                (dataLoaded || props.document.length !== 1) ? (
                                    <div className={classes.contentcard}>
                                        {
                                            props.document.length > 1 && !isDocShown ? (
                                                <PortfolioTableForDocView
                                                    data={props.document.map(el => ({...el, selected: false}))}
                                                    handleDblClick={() => {
                                                    }}
                                                    setIsDocShown={setIsDocShown}
                                                    setDocIdToShow={setDocIdToShow}
                                                />
                                            ) : (
                                                <>
                                                    <div className={classes.contentcardtitle}>
                                                        {
                                                            props.document.length > 1 ? (
                                                                <div className={classes.contentcardbackbutton}>
                                                                    <Tooltip title="Back to files">
                                                                        <IconButton className="editButton"
                                                                                    onClick={backToFiles}
                                                                        >
                                                                            <ArrowBackIcon className={classes.greenColor}/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </div>
                                                            ) : (null)
                                                        }
                                                        {getBreadCrumbs()}

                                                        <div className={classes.contentcardtitleactions}>
                                                            {
                                                                currentParent?.algorithmtype > 1 ? (
                                                                    <>
                                                                        <Tooltip title="View Original Text">
                                                                            <IconButton className="editButton"
                                                                                        onClick={openSideView}>
                                                                                <AssistantIcon className={classes.greenColor}/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="View Color Legend">
                                                                            <IconButton className="editButton"
                                                                                        onClick={handleOpenColorLegend}>
                                                                                <PaletteIcon className={classes.greenColor}/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </>
                                                                ) : (null)
                                                            }
                                                        </div>
                                                        <Popover
                                                            open={openColorLegend}
                                                            anchorEl={colorLegendAnchorEl}f
                                                            onClose={handleCloseColorLegend}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'center',
                                                            }}
                                                        >
                                                            <div className={classes.colorLegendPopover}>
                                                                {
                                                                    phraseColorList.map(phrase => {
                                                                        return (
                                                                            <div key={phrase.phrase_name}>
                                                                                <div className={classes.colorLegendSquare}
                                                                                     style={{background: getPhraseColor(phrase.phrase_name)}}/>
                                                                                <span className={classes.colorLegendLabel}>
                                                                                    {phrase.phrase_name}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </Popover>
                                                    </div>
                                                    <div className={`${classes.documentcardbody} ${getSmallClass()}`}>
                                                        {console.log(data)}
                                                        <EditorBlock data={data}
                                                                     setDocRef={createDocRef}
                                                                     setSentenceRef={setSentenceRef}
                                                                     setWordRef={setWordRef}
                                                        />
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <CircularProgress size={100}/>
                                )
                            }
                        </div>
                    ) : (
                        <div className={classes.spinnerContainer}>
                            <CircularProgress size={100} className={classes.greenColor}/>
                        </div>
                    )
                }
                {
                    displaySearchPhraseWindow ? (
                        <div className={`${classes.contentviewleft}`}>
                            <div className={classes.context}>
                                {/*<div className={classes.contexttitle}>*/}
                                {/*    Search Window*/}

                                {/*    <div className={`${classes.titleActions}`}>*/}
                                {/*        <Tooltip title="Close">*/}
                                {/*            <IconButton size="small"*/}
                                {/*                        onClick={closeSearchPhraseView}*/}
                                {/*            >*/}
                                {/*                <CloseIcon/>*/}
                                {/*            </IconButton>*/}
                                {/*        </Tooltip>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className={classes.contextcontent} >
                                    <div className={classes.verticalFlexContainer}>
                                        <div className={classes.formContainer}>
                                            <Button onClick={handleRun}
                                                    disabled={method===0}
                                            >
                                                RUN
                                                <PlayArrow/>
                                            </Button>
                                            <FormControl>
                                                <Select value={method}
                                                        onChange={changeMethod}
                                                        labelId="select-label">
                                                    <MenuItem value={0} disabled >METHOD</MenuItem>
                                                    <MenuItem value={1}>Summary For Entire
                                                        Doc</MenuItem>
                                                    <MenuItem value={2}>Summary By Header</MenuItem>
                                                    <MenuItem value={3}>Summary By Paragraph</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <Select
                                                    value={dictionary}
                                                    onChange={changeDictionary}
                                                    labelId="select-label"
                                                    disabled={true}
                                                >
                                                    <MenuItem value="DICTIONARY" disabled>DICTIONARY</MenuItem>
                                                    {/*<MenuItem value="Q/A">Summary For Entire Doc</MenuItem>*/}
                                                    {/*<MenuItem value="AI Q/A">Summary By Header</MenuItem>*/}
                                                    {/*<MenuItem value="Phrase Search">Summary By Paragraph</MenuItem>*/}
                                                </Select>
                                            </FormControl>
                                            <div className={classes.summaryRatioContainer}>
                                                <InputLabel style={{fontSize: "12px"}}>Summary Length</InputLabel>
                                                <Slider
                                                    value={summaryRatio}
                                                    valueLabelFormat={x => `${x * 10}%`}
                                                    onChange={sliderOnChange}
                                                    aria-labelledby="summary-ratio-slider"
                                                    valueLabelDisplay="auto"
                                                    step={1}
                                                    marks
                                                    min={1}
                                                    max={9}
                                                />
                                            </div>
                                        </div>
                                        <textarea
                                            className={classes.resultOutput}
                                            placeholder="Result..."
                                            value={result}
                                            readOnly
                                        >

                                        </textarea>
                                        <div className={classes.downloadSaveContainer}>
                                            <Button>Download</Button>
                                            <Button>Save</Button>
                                        </div>
                                    </div>
                                    {/*{renderSearchPhraseData()}*/}
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
                {
                    dockOriginalContext ? (
                        <div className={`${classes.contentviewright}`}>
                            <div className={classes.context}>
                                <div className={classes.contexttitle}>
                                    {summaryData?.name}

                                    <div className={`${classes.titleActions}`}>
                                        <Tooltip title="Undock Window">
                                            <IconButton size="small"
                                                        onClick={undockOriginalContextModal}
                                            >
                                                <MinimizeIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Close">
                                            <IconButton size="small"
                                                        onClick={closeDockOriginalContext}
                                            >
                                                <CloseIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className={classes.contextcontent}>
                                    <Button onClick={() => getMoreContext(2)}>
                                        ...
                                    </Button>
                                    {
                                        beforeExtraContext.map((obj, index) => {
                                            return (
                                                <Typography key={obj.id}>
                                                    {obj.text}
                                                </Typography>
                                            );
                                        })
                                    }
                                    <Typography>
                                        {displayOriginal.json}
                                    </Typography>
                                    {
                                        afterExtraContext.map((obj, index) => {
                                            return (
                                                <Typography key={obj.id}>
                                                    {obj.text}
                                                </Typography>
                                            );
                                        })
                                    }
                                    <Button onClick={() => getMoreContext(1)}>
                                        ...
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
                {
                    displaySideView ? (
                        <div className={`${classes.contentviewright}`}>
                            <div className={classes.context}>
                                <div className={classes.contexttitle}>
                                    Original Text

                                    <div className={`${classes.titleActions}`}>
                                        <Tooltip title="Close">
                                            <IconButton size="small"
                                                        onClick={closeSideView}
                                            >
                                                <CloseIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className={classes.contextcontent} ref={originaltextbodyref}>
                                    <EditorBlock data={sideDocumentData}
                                                 setDocRef={createSideDocRef}
                                                 setSentenceRef={setSideSentenceRef}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
            </div>
        );
    }

    const renderTextViewer = (classes) => {
        console.log("renderTextViewer called")
        return (
            <div className={`${classes.contentview}`}>
                {
                    !isLoading ? (
                        <div className={displaySearchPhraseWindow ? `${classes.contentviewright}` : `${classes.contentviewleft}`}>
                            {
                                (dataLoaded || props.document.length !== 1) ? (
                                    <div className={classes.contentcard}>
                                        {
                                            props.document.length > 1 && !isDocShown ? (
                                                <PortfolioTableForDocView
                                                    data={props.document.map(el => ({...el, selected: false}))}
                                                    handleDblClick={() => {
                                                    }}
                                                    setIsDocShown={setIsDocShown}
                                                    setDocIdToShow={setDocIdToShow}
                                                />
                                            ) : (
                                                <>
                                                    <div className={classes.contentcardtitle}>
                                                        {
                                                            props.document.length > 1 ? (
                                                                <div className={classes.contentcardbackbutton}>
                                                                    <Tooltip title="Back to files">
                                                                        <IconButton className="editButton"
                                                                                    onClick={backToFiles}
                                                                        >
                                                                            <ArrowBackIcon className={classes.greenColor}/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </div>
                                                            ) : (null)
                                                        }
                                                        {getBreadCrumbs()}

                                                        <div className={classes.contentcardtitleactions}>
                                                            {
                                                                currentParent?.algorithmtype > 1 ? (
                                                                    <>
                                                                        <Tooltip title="View Original Text">
                                                                            <IconButton className="editButton"
                                                                                        onClick={openSideView}>
                                                                                <AssistantIcon className={classes.greenColor}/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="View Color Legend">
                                                                            <IconButton className="editButton"
                                                                                        onClick={handleOpenColorLegend}>
                                                                                <PaletteIcon className={classes.greenColor}/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </>
                                                                ) : (null)
                                                            }
                                                        </div>
                                                        <Popover
                                                            open={openColorLegend}
                                                            anchorEl={colorLegendAnchorEl}
                                                            onClose={handleCloseColorLegend}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'center',
                                                            }}
                                                        >
                                                            <div className={classes.colorLegendPopover}>
                                                                {
                                                                    phraseColorList.map(phrase => {
                                                                        return (
                                                                            <div key={phrase.phrase_name}>
                                                                                <div className={classes.colorLegendSquare}
                                                                                     style={{background: getPhraseColor(phrase.phrase_name)}}/>
                                                                                <span className={classes.colorLegendLabel}>
                                                                                    {phrase.phrase_name}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </Popover>
                                                    </div>
                                                    <div className={`${classes.documentcardbody} ${getSmallClass()}`}>
                                                        <EditorBlock data={originalDocumentData}
                                                                     setDocRef={createDocRef}
                                                                     setSentenceRef={setSentenceRef}
                                                                     setWordRef={setWordRef}
                                                        />
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <CircularProgress size={100} />
                                )
                            }
                        </div>
                    ) : (
                        <div className={classes.spinnerContainer}>
                            <CircularProgress size={100} className={classes.greenColor}/>
                        </div>
                    )
                }
                {
                    displaySearchPhraseWindow ? (
                        <div className={`${classes.contentviewleft}`}>
                            <div className={classes.context}>
                                <div className={classes.contextcontent}>
                                    <div className={classes.verticalFlexContainer}>
                                        <div className={classes.formContainer}>
                                            <Button onClick={handleRun} disabled={method===0}>RUN<PlayArrow/></Button>
                                            <FormControl>
                                                <Select value={method}
                                                        onChange={changeMethod}
                                                        labelId="select-label">
                                                    <MenuItem value={0} disabled>METHOD</MenuItem>
                                                    <MenuItem value={1}>Summary For Entire
                                                        Doc</MenuItem>
                                                    <MenuItem value={2}>Summary By Header</MenuItem>
                                                    <MenuItem value={3}>Summary By
                                                        Paragraph</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <Select
                                                    value={dictionary}
                                                    onChange={changeDictionary}
                                                    labelId="select-label"
                                                    disabled={true}
                                                >
                                                    <MenuItem value="DICTIONARY" disabled>DICTIONARY</MenuItem>
                                                    {/*<MenuItem value="Q/A">Summary For Entire Doc</MenuItem>*/}
                                                    {/*<MenuItem value="AI Q/A">Summary By Header</MenuItem>*/}
                                                    {/*<MenuItem value="Phrase Search">Summary By Paragraph</MenuItem>*/}
                                                </Select>
                                            </FormControl>
                                            <div className={classes.summaryRatioContainer}>
                                                <InputLabel style={{fontSize: "12px"}}>Summary Length</InputLabel>
                                                <Slider
                                                    value={summaryRatio}
                                                    valueLabelFormat={x => `${x * 10}%`}
                                                    onChange={sliderOnChange}
                                                    aria-labelledby="summary-ratio-slider"
                                                    valueLabelDisplay="auto"
                                                    step={1}
                                                    marks
                                                    min={1}
                                                    max={9}
                                                />
                                            </div>
                                        </div>
                                        <textarea
                                            className={classes.resultOutput}
                                            placeholder="Result..."
                                            value={result}
                                            readOnly
                                        >
                                        </textarea>
                                        <div className={classes.downloadSaveContainer}>
                                            <Button>Download</Button>
                                            <Button>Save</Button>
                                        </div>
                                    </div>
                                    {/*{renderSearchPhraseData()}*/}
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
            </div>
        );
    }

    const renderEditorView = (classes) => {
        if (editorView === TEXT_EDITOR) {
            return renderTextEditor(classes);
        }
        else if (editorView === TEXT_VIEWER) {
            return renderTextViewer(classes);
        }
    }

    const renderSearchPhraseData = () => {
        const dropdown = (
            <div className={classes.searchDropDown}>
                <h1>RENDER SEARCH PHRASE DATA</h1>
                <InputLabel id="phrase-option-label" style={{fontSize: "12px", padding: "2px 0"}}>Search By Phrase Type</InputLabel>
                <FormControl>
                    <Select value={selectedPhraseOption}
                            onChange={phraseDropDownOnChange}
                            labelId="phrase-option-label"
                            id="phrase-option"
                            variant="outlined"
                            disabled={searchContextField !== ""}
                    >
                        {
                            phraseDropDownOptions.map(option => {
                                return (
                                    <MenuItem value={option.phrase_id} key={option.phrase_id}>
                                        {option.phrase_name}
                                    </MenuItem>
                                );
                            })
                        }
                    </Select>
                </FormControl>
            </div>
        );
        const search = (
            <div className={classes.searchTextField}>
                <InputLabel id="context-search-bar-label" style={{position: "absolute", top: "0", fontSize: "12px", padding: "2px 0"}}>Search By Context</InputLabel>
                <TextField
                    className={classes.margin}
                    id="context-search-bar"
                    placeholder="Try asking a question"
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
                    disabled={selectedPhraseOption !== ""}
                    fullWidth
                />
            </div>
        );
        const clear = (
            <div className={classes.searchClear}>
                <Tooltip title="Clear Search">
                    <IconButton onClick={clearSearch}>
                        <CloseIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        );
        // true it exists false it doesnt exist
        const dropdownStatus = selectedPhraseOption !== "";
        const searchStatus = searchContextField !== "";
        const btn = (
            <div className={classes.searchConfirm}>
                <Button variant="contained"
                        size="large"
                        disabled={(!dropdownStatus && !searchStatus)}
                        onClick={handleSearchConfirm}
                >
                    Search
                </Button>
            </div>
        );
        let searchBlock = (
            <div className={classes.searchBlock}>
                {dropdown}
                {search}
                {(dropdownStatus || searchStatus) ? clear : null}
                {btn}
            </div>
        );
        return (
            <>
                {searchBlock}
                <div className={classes.searchContent}>
                    {
                        searchPhraseDataLoaded ? (
                            (searchPhraseData.length > 0 && questionAnswerData !== "") ? (
                                <>
                                    <HeaderBlock text={"Answer:"} />
                                    <ParagraphBlock>
                                        {questionAnswerData}
                                    </ParagraphBlock>
                                    <HeaderBlock text={"Context:"} />
                                    {
                                        searchPhraseData.map((paragraph, index) => {
                                            return (
                                                paragraph.sentence_list.map((sentence, index) => {
                                                    const fs = findSentenceSpan(sentence.sentence_id);
                                                    return (
                                                        <ParagraphBlock key={`question_answer_paragraph_block_${index}`}>
                                                            <SentenceBlock data={sentence} selected={sentence.senetence_id === props.current_selected_mouse_hover} />
                                                            {
                                                                (fs !== undefined) ? (
                                                                    <IconButton className={classes.blockinputbtn}
                                                                                onClick={() => {scrollToSentenceRef(fs)}}
                                                                    >
                                                                        <InputIcon />
                                                                    </IconButton>
                                                                ) : (null)
                                                            }
                                                        </ParagraphBlock>
                                                    );
                                                })
                                            );
                                        })
                                    }
                                </>
                            ) : (
                                (searchPhraseData.length > 0 && questionAnswerData === "") ? (
                                    <>
                                        <HeaderBlock text={"Context:"} />
                                        {
                                            searchPhraseData.map((sentence, index) => {
                                                const fs = findSentenceSpan(sentence.sentence_id);
                                                return (
                                                    <ParagraphBlock key={`question_answer_sentence_block_${index}`} style={{position:"relative"}}>
                                                        <SentenceBlock data={sentence} selected={sentence.sentence_id === props.current_sentence_mouse_hover} />
                                                        {
                                                            (fs !== undefined) ? (
                                                                <IconButton className={classes.blockinputbtn}
                                                                            onClick={() => {scrollToSentenceRef(fs)}}
                                                                >
                                                                    <InputIcon />
                                                                </IconButton>
                                                            ) : (null)
                                                        }
                                                    </ParagraphBlock>
                                                );
                                            })
                                        }
                                    </>
                                ) :
                                (<div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "600", padding: "24px 0"}}>
                                    No Data To Display
                                </div>)
                            )
                        ) : (
                            <>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                                <Skeleton height={40} width="calc(100% - 16px)"/>
                            </>
                        )
                    }
                </div>
            </>
        );
    }

    const getSmallClass = () => {
        if (dockOriginalContext) return classes.small;
        else return "";
    }

    if (!dataLoaded && !(props.document.length > 1)) return (
        <>
            <div className={classes.content}>
                <Skeleton height={50} width="calc(100% - 16px)"/>
                <Skeleton height={100} width="calc(100% - 16px)"/>
                <Skeleton height={75} width="calc(100% - 16px)"/>
                <Skeleton height={50} width="calc(100% - 16px)"/>
                <Skeleton height={100} width="calc(100% - 16px)"/>
                <Skeleton height={75} width="calc(100% - 16px)"/>
                <Skeleton height={50} width="calc(100% - 16px)"/>
                <Skeleton height={100} width="calc(100% - 16px)"/>
                <Skeleton height={75} width="calc(100% - 16px)"/>
                <Skeleton height={50} width="calc(100% - 16px)"/>
                <Skeleton height={100} width="calc(100% - 16px)"/>
                <Skeleton height={75} width="calc(100% - 16px)"/>
                <Skeleton height={50} width="calc(100% - 16px)"/>
                <Skeleton height={100} width="calc(100% - 16px)"/>
                <Skeleton height={75} width="calc(100% - 16px)"/>
                <Skeleton height={50} width="calc(100% - 16px)"/>
                <Skeleton height={100} width="calc(100% - 16px)"/>
                <Skeleton height={75} width="calc(100% - 16px)"/>
            </div>
        </>
    );

    return (
        <>
            {console.log("RENDER")}
            {console.log("current parent", currentParent)}
            <div className={classes.content}>
                {
                    (redirect) ? (<Redirect to="/portfolio" />) : (null)
                }
                {
                    (currentParent) ? (
                        <div className={classes.contentheader}>
                            {currentParent.name}
                            <div className={classes.floatRight}>
                                <Tooltip title="Toggle Description">
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
                                </Tooltip>
                            </div>
                        </div>
                    ) : (null)
                }
                {
                    openParentDescription ? (
                        <div className={classes.contentheaderdescription}>
                            {currentParent.description.length > 0 ? (
                                currentParent.description
                            ) : (
                                <span className={classes.descriptionfiller}>
                                No Description
                            </span>
                            )}
                        </div>
                    ) : (null)
                }
                {
                    renderEditorView(classes)
                }
            </div>
            <OriginalContextModal open={(displayOriginal.display === true && displayOriginal.response && !dockOriginalContext)}
                                  handleClose={closeOriginalContextModal}
                                  dockWindow={dockOriginalContextModal}
                                  resetPosition={resetOriginalContextModalPosition}
                                  x={displayOriginal.x}
                                  y={displayOriginal.y}
                                  width={displayOriginal.width}
                                  title={summaryData?.name}
                                  getMoreContext={getMoreContext}
                                  beforeText={beforeExtraContext}
                                  afterText={afterExtraContext}
                                  text={displayOriginal.json}
            />
            <DefinitionModal open={(displayDefinition.display === true && !!displayDefinition.json)}
                             handleClose={closeDefinitionModal}
                             x={displayDefinition.x}
                             y={displayDefinition.y}
                             width={displayDefinition.width}
                             title={displayDefinition.json?.text}
                             text={displayDefinition.json?.glossary_def}
            />
            <DisplayDefinitionButton word_list={wordRefs.current} containerRef={documentcardelement.current} displayDefinition={handleDisplayDefinition} />
        </>
    );
}

export default connect(mapStateToProps)(DocumentViewSummary);
