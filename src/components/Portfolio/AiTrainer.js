import React, { useState, useEffect, useRef, createRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import {Redirect, useLocation, useRouteMatch, Link, useHistory} from "react-router-dom";
import {rootContainerFullWithTheme} from "../styles/containerStylesWithTheme";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import {borders} from "../styles/globalStyles";
import CircularProgress from '@material-ui/core/CircularProgress';
import {Api} from "../Api";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Skeleton from "@material-ui/lab/Skeleton";
import HelpIcon from '@material-ui/icons/Help';
import Popover from "@material-ui/core/Popover";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import MenuItem from "@material-ui/core/MenuItem";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings
    }
}

const wordtypes = [
    {
        id: 0,
        type: "None"
    },
    {
        id: 1,
        type: "Operand"
    },
    {
        id: 2,
        type: "Operator"
    },
    {
        id: 3,
        type: "Condition Result"
    }
];

const useStyles = makeStyles((theme) => ({
    root: {},
    superviseAIMenu: {
        // sentence spans
        "&.user_toggle_false": {
            background: "#e6194B" //red
        },
        "&.user_toggle_true": {
            background: "#3cb44b", //green
        },
        "&.ai_toggle_false": {
            color: "#e6194B" //red
        },
        "&.ai_toggle_true": {
            color: "#3cb44b", //green
        },
        // word spans
        "&.word.user_toggle_unknown": {
            background: "#808080" //grey
        },
        "&.word.user_toggle_none": {
            background: "rgb(227, 227, 227)",
        },
        "&.word.user_toggle_operand": {
            background: "#3cb44b", //green
        },
        "&.word.user_toggle_operator": {
            background: "#e6194B" //red
        },
        "&.word.user_toggle_result_operand": {
            background: "#4363d8" //blue
        },
        "&.word.user_toggle_result_operator": {
            background: "#f58231" //orange
        },
        "&.word.ai_toggle_unknown": {
            color: "#808080" //grey
        },
        "&.word.ai_toggle_none": {
            color: "rgb(227, 227, 227)",
        },
        "&.word.ai_toggle_operand": {
            color: "#3cb44b", //green
        },
        "&.word.ai_toggle_operator": {
            color: "#e6194B" //red
        },
        "&.word.ai_toggle_result_operand": {
            color: "#4363d8" //blue
        },
        "&.word.ai_toggle_result_operator": {
            color: "rgb(163, 123, 29)" //orange
        },
        // phrase spans
        // value variable
        "&.phrase.user_toggle_unknown": {
            background: "#808080" //grey
        },"&.phrase.user_toggle_none": {
            background: "rgb(227, 227, 227)",
        },
        "&.phrase.user_toggle_value": {
            background: "#3cb44b", //green
        },
        "&.phrase.user_toggle_variable": {
            background: "rgb(110, 185, 255)",
        },
        "&.phrase.ai_toggle_unknown": {
            color: "#808080" //grey
        },
        "&.phrase.ai_toggle_none": {
            color: "rgb(227, 227, 227)",
        },
        "&.phrase.ai_toggle_value": {
            color: "#3cb44b", //green
        },
        "&.phrase.ai_toggle_variable": {
            color: "rgb(110, 185, 255)",
        },
        // operators
        "&.phrase.user_toggle_unknown": {
            background: "#808080" //grey
        },
        "&.phrase.user_toggle_none": {
            background: "rgb(227, 227, 227)"
        },
        "&.phrase.user_toggle_equals": {
            background: "rgb(194, 148, 255)" //purple
        },
        "&.phrase.user_toggle_not_equals": {
            background: "rgb(110, 185, 255)" //aqua
        },
        "&.phrase.user_toggle_less_than": {
            background: "#3cb44b", //green
        },
        "&.phrase.user_toggle_less_than_or_equals": {
            background: "rgb(129, 130, 74)" //dark yellow
        },
        "&.phrase.user_toggle_greater_than": {
            background: "rgb(163, 123, 29)" //orange
        },
        "&.phrase.user_toggle_greater_than_or_equals": {
            background: "#e6194B" //red
        },
        "&.phrase.user_toggle_and": {
            background: "rgb(191, 65, 172)" //pink purple
        },
        "&.phrase.user_toggle_or": {
            background: "rgb(237, 83, 152)" //pink
        },
        "&.phrase.user_toggle_comma": {
            background: "rgb(79, 189, 174)" //teal
        },
        "&.phrase.user_toggle_open_parentheses": {
            background: "#4363d8" //blue
        },
        "&.phrase.user_toggle_closed_parentheses": {
            background: "rgb(89, 32, 122)" //dark purple
        },
        
    },
    content: {
        ...rootContainerFullWithTheme(theme),
        flexDirection: "column",
        height: "calc(100% - 112px)",
        width: "calc(100% - 64px)",
        margin: "16px 0 32px",
        overflow: "visible",
        justifyContent: "flex-start",
        // sentence spans
        "& .user_toggle_false": {
            borderBottom: "2px solid #e6194B" //red
        },
        "& .user_toggle_true": {
            borderBottom: "2px solid #3cb44b", //green
        },
        "& .ai_toggle_false": {
            color: "#e6194B" //red
        },
        "& .ai_toggle_true": {
            color: "#3cb44b", //green
        },
        // word spans
        "& .word.user_toggle_unknown": {
            borderBottom: "2px solid #808080" //grey
        },
        "& .word.user_toggle_none": {
            borderBottom: "2px solid rgb(227, 227, 227)"
        },
        "& .word.user_toggle_operand": {
            borderBottom: "2px solid #3cb44b" // green
        },
        "& .word.user_toggle_operator": {
            borderBottom: "2px solid #e6194B" //red
        },
        "& .word.user_toggle_result_operand": {
            borderBottom: "2px solid #4363d8" //blue
        },
        "& .word.user_toggle_result_operator": {
            borderBottom: "2px solid #f58231"
        },
        "& .word.ai_toggle_unknown": {
            color: "#808080" //grey
        },
        "& .word.ai_toggle_none": {
            color: "rgb(227, 227, 227)",
        },
        "& .word.ai_toggle_operand": {
            color: "#3cb44b",
        },
        "& .word.ai_toggle_operator": {
            color: "#e6194B", //red
        },
        "& .word.ai_toggle_result_operand": {
            color: "#4363d8", //blue
        },
        "& .word.ai_toggle_result_operator": {
            color: "#f58231",
        },
        // phrase spans
        // value variable
        "& .phrase.user_toggle_unknown": {
            borderBottom: "2px solid #808080" //grey
        },
        "& .phrase.user_toggle_none": {
            borderBottom: "2px solid rgb(227, 227, 227)"
        },
        "& .phrase.user_toggle_value": {
            borderBottom: "2px solid #3cb44b", //green
        },
        "& .phrase.user_toggle_variable": {
            borderBottom: "2px solid rgb(110, 185, 255)"
        },
        "& .phrase.ai_toggle_unknown": {
            color: "#808080" //grey
        },
        "& .phrase.ai_toggle_none": {
            color: "rgb(227, 227, 227)",
        },
        "& .phrase.ai_toggle_value": {
            color: "#3cb44b", //green
        },
        "& .phrase.ai_toggle_variable": {
            color: "rgb(110, 185, 255)",
        },
        // operators
        "& .phrase.user_toggle_unknown": {
            borderBottom: "2px solid #808080" //grey
        },
        "& .phrase.user_toggle_none": {
            borderBottom: "2px solid rgb(227, 227, 227)" 
        },
        "& .phrase.user_toggle_equals": {
            borderBottom: "2px solid rgb(194, 148, 255)" //purple
        },
        "& .phrase.user_toggle_not_equals": {
            borderBottom: "2px solid rgb(110, 185, 255)" //aqua
        },
        "& .phrase.user_toggle_less_than": {
            borderBottom: "2px solid #3cb44b", //green
        },
        "& .phrase.user_toggle_less_than_or_equals": {
            borderBottom: "2px solid rgb(129, 130, 74)" //dark yellow
        },
        "& .phrase.user_toggle_greater_than": {
            borderBottom: "2px solid rgb(163, 123, 29)" //orange
        },
        "& .phrase.user_toggle_greater_than_or_equals": {
            borderBottom: "2px solid #e6194B" //red
        },
        "& .phrase.user_toggle_and": {
            borderBottom: "2px solid rgb(191, 65, 172)" //pink purple
        },
        "& .phrase.user_toggle_or": {
            borderBottom: "2px solid rgb(237, 83, 152)" //pink
        },
        "& .phrase.user_toggle_comma": {
            borderBottom: "2px solid rgb(79, 189, 174)" //teal
        },
        "& .phrase.user_toggle_open_parentheses": {
            borderBottom: "2px solid #4363d8" //blue
        },
        "& .phrase.user_toggle_closed_parentheses": {
            borderBottom: "2px solid rgb(89, 32, 122)" //dark purple
        },
        "& .phrase.ai_toggle_unknown": {
            color: "#808080" //grey
        },
        "& .phrase.ai_toggle_none": {
            color: "rgb(227, 227, 227)" 
        },
        "& .phrase.ai_toggle_equals": {
            color: "rgb(194, 148, 255)" //purple
        },
        "& .phrase.ai_toggle_not_equals": {
            color: "rgb(110, 185, 255)" //aqua
        },
        "& .phrase.ai_toggle_less_than": {
            color: "#3cb44b", //green
        },
        "& .phrase.ai_toggle_less_than_or_equals": {
            color: "rgb(129, 130, 74)" //dark yellow
        },
        "& .phrase.ai_toggle_greater_than": {
            color: "rgb(163, 123, 29)" //orange
        },
        "& .phrase.ai_toggle_greater_than_or_equals": {
            color: "#e6194B" //red
        },
        "& .phrase.ai_toggle_and": {
            color: "rgb(191, 65, 172)" //pink purple
        },
        "& .phrase.ai_toggle_or": {
            color: "rgb(237, 83, 152)" //pink
        },
        "& .phrase.ai_toggle_comma": {
            color: "rgb(79, 189, 174)" //teal
        },
        "& .phrase.ai_toggle_open_parentheses": {
            color: "#4363d8" //blue
        },
        "& .phrase.ai_toggle_closed_parentheses": {
            color: "rgb(89, 32, 122)" //dark purple
        },
        // no event attached so no training needed
        "& .no_event": {
            color: "rgb(211,211,211)"
        }
    },
    contentview: {
        width: "100%",
        height: "calc(100% - 40px)",
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
    conditionalsentencescontent: {
        position: "relative",
        padding: "8px 152px",
    },
    conditionalsentences: {
        "& span": {
            display: "block",
            padding: "2px 8px",
            "&:hover": {
                cursor: "pointer",
                border: "2px solid black",
                boxSizing: "border-box"
            }
        },
    },
    aitrainingmethodButton: {
        width: "100%",
        margin: "8px 0",
        padding: "8px 8px",
        border: "1px solid black",
        borderRadius: "4px",
        boxShadow: theme.shadows[2],
        "&:hover": {
            cursor: "pointer",
            background: "rgba(0, 0, 0, 0.1)",
        }
    },
    aitrainingmethodButtonHeader: {
        fontSize: "20px"
    },
    wordtyperow: {
        padding: "8px 0",
        "& span": {
            "&:hover": {
                cursor: "pointer",
                border: "2px solid black"
            }
        }
    },
    rowchecktoggle: {
        position: "absolute",
        padding: "8px",
        left: "110px"
    },
    conditionalsentenceslegend: {
        position: "absolute",
        top: "37px",
        right: "22px",
        display: "flex",
        flexDirection: "column",
        border: borders.border,
        "& *": {
            padding: "4px 8px"
        },
        "& .legend_title": {
            background: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            fontWeight: "600"
        },
    },
    helpbutton: {
        position: "absolute",
        right: "0px",
        top: "0px",
        padding: "0",
        margin: "0"
    },
    conditionalsentencesdescription: {
        position: "relative",
        flexShrink: "0",
        padding: "2px 8px",
        ...theme.typography.body2,
        color: "rgba(0, 0, 0, 0.77)",
        background: "rgb(242, 242, 242)",
    },
    colorsections: {
        display: "flex",
        "& *": {
            flex: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
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
            [theme.breakpoints.down('md')]: {
                maxWidth: "calc(100% - 64px)"
            },
            [theme.breakpoints.up('lg')]: {
                maxWidth: "calc(100% - 304px)"
            },
        },
        "& .ce-block__content": {
            [theme.breakpoints.down('md')]: {
                maxWidth: "calc(100% - 64px)"
            },
            [theme.breakpoints.up('lg')]: {
                maxWidth: "calc(100% - 304px)"
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
        },
    },
    small: {
        "& .ce-toolbar__content": {
            maxWidth: "calc(100% - 64px)"
        },
        "& .ce-block__content": {
            maxWidth: "calc(100% - 64px)"
        },
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
    aiOptionReturn: {
        position: "absolute",
        left: "8px",
        top: "36px",
        zIndex: 10
    }
}));

function DocumentView(props){
    const classes = useStyles(props);
    const { url } = useRouteMatch();
    const { search } = useLocation();
    const history = useHistory();
    const [currentParent, setCurrentParent] = useState(null);
    const [openParentDescription, setOpenParentDescription] = useState(false);
    // false: shows spinner; true: shows editor with data
    const [dataLoaded, setDataLoaded] = useState(false);
    // redirect if document doesnt exist
    const [redirect, setRedirect] = useState(false);
    const [currentRootFilter, setCurrentRootFilter] = useState("all");
    const documentcardbodyref = useRef(null);
    const [conditionalSentences, setConditionalSentences] = useState([]);
    const [wordTypeList, setWordTypeList] = useState([]);
    const [phraseTypeList, setPhraseTypeList] = useState([]);
    // root level options user picks from list of ai training options
    const [superviseAIOptions, setSuperviseAIOptions] = useState([]);
    // ai training level user picks from list of choices to update sentence or word status
    const [superviseAIChoices, setSuperviseAIChoices] = useState([]);
    // current view based off queryView
    const [currentView, setCurrentView] = useState(null);
    // supervise ai choices menu variables
    // object reference
    const [superviseAiReference, setSuperviseAiReference] = useState(null);
    // object index reference: sentence index || word index
    const [superviseAiIndexReference, setSuperviseAiIndexReference] = useState(null);
    // object parent index reference: null || sentence index
    const [superviseAiParentIndexReference, setSuperviseAiParentIndexReference] = useState(null);
    // element reference
    const [superviseAiChoicesAnchorEl, setSuperviseAiChoicesAnchorEl] = useState(null);
    // menu position
    const [superviseAiChoicesAnchorPosition, setSuperviseAiChoicesAnchorPosition] = useState(null);

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
    const getQuery = (qs, param) => {
        return qs.find(q => q.param === param);
    }
    // queryId.value = id of document
    const queryId = getQuery(queries, "train");
    // queryView.value = selected view
    const queryView = getQuery(queries, "trainingview");
    let editorInstance = useRef(null);

    const getId = async () => {
        // get doc data
        const response = await Api.getDocument(queryId.value);
        const data = response?._json;
        setCurrentParent(data);
        return data;
    }

    const getToggleAITrainingData = async (id) => {
        setDataLoaded(false);
        setCurrentView(+id);
        if (+id === 0) {
            const response = await Api.getSupervisedAI();
            if (response) handleAiTrainingDefaultView(response);
        }
        else {
            const response = await Api.toggleAITraining(queryId.value, id);
            if (response) handleAiTrainingDataResponse(response, id);
        }
    }

    const handleSuperviseAiChoiceSelect = (choice) => (event) => {
        closeSuperviseAiChoicesMenu();
        if (currentView === 1 || currentView === 5) {
            toggleConditionalSentence(choice, superviseAiReference, superviseAiIndexReference);
        }
        else if (currentView === 2) {
            toggleWordType(choice, superviseAiReference, superviseAiIndexReference, superviseAiParentIndexReference);
        }
        else if (currentView === 3) {
            togglePhraseType(choice, superviseAiReference, superviseAiIndexReference, superviseAiParentIndexReference);
        }
        else if (currentView === 4) {
            togglePhraseType(choice, superviseAiReference, superviseAiIndexReference, superviseAiParentIndexReference);
        }
    }

    const closeSuperviseAiChoicesMenu = () => {
        setSuperviseAiChoicesAnchorEl(null);
        setSuperviseAiIndexReference(null);
        setSuperviseAiParentIndexReference(null);
        setSuperviseAiReference(null);
    }

    const openSentencesSuperviseAiChoicesMenu = (reference, index) => (event) => {
        setSuperviseAiIndexReference(index);
        setSuperviseAiReference(reference);
        openSuperviseAiChoicesMenu(event);
    }

    const openWordsSuperviseAiChoicesMenu = (reference, index, parentindex) => (event) => {
        setSuperviseAiIndexReference(index);
        setSuperviseAiParentIndexReference(parentindex);
        setSuperviseAiReference(reference);
        openSuperviseAiChoicesMenu(event);
    }

    const openSuperviseAiChoicesMenu = (event) => {
        setSuperviseAiChoicesAnchorPosition({
            x: event.clientX,
            y: event.clientY
        });
        setSuperviseAiChoicesAnchorEl(event.currentTarget);
    }

    const handleAiTrainingDefaultView = (response) => {
        const json = response._json;
        setSuperviseAIOptions(json);
        setDataLoaded(true);
    }

    const handleAiTrainingDataResponse = (response, id) => {
        const json = response._json;
        // view is conditional sentences data returned sentence setup
        setSuperviseAIChoices(json?.supervised_ai_choices || []);
        if (+id === 1 || +id === 5) {
            setConditionalSentences(json?.sentence_list || []);
            setDataLoaded(true);
        }
        // view is word type data returned word setup
        else if (+id === 2) {
            setWordTypeList(json?.sentence_list || []);
            setDataLoaded(true);
        }
        // view is phase type data returned phrase setup
        else if (+id === 3 || +id === 4) {
            //setConditionalSentences(json?.sentence_list || []);
            setPhraseTypeList(json?.sentence_list || []);
            setDataLoaded(true); 
        }
    }

    const handleViewInit = (_search = search) => {
        const queries = getQueryFormat(_search);
        const queryView = getQuery(queries, "trainingview");

        // set default view if no view
        if (!queryView || queryView?.value === undefined) {
            return props.history.push(`${url}${search}?trainingview=0`);
        }
        // if queryview then handle queryview
        if (queryId.value && queryId.value.length > 0 && queryView && queryView.value) {
            getId();
            getToggleAITrainingData(queryView.value);
        }
        // value doesn't exist
        else {
            setRedirect(true);
        }
    }

    useEffect(() => {
        let unlisten = history.listen((ev) => {
            const { search, pathname } = ev;
            if (pathname === "/portfolio") handleViewInit(search);
        });
        handleViewInit();

        // set up root filter
        let queries = getQueryFormat(search);
        let currentRootFilter = "all";
        if (queryCheck(queries, "fuser")) {
            const userid = getQuery(queries, "fuser");
            currentRootFilter = "self";
        }
        else if (queryCheck(queries, "fgroup")) {
            const groupid = getQuery(queries, "fgroup");
            currentRootFilter = +groupid.value;
        }
        setCurrentRootFilter(currentRootFilter);

        return () => {
            editorInstance = null;
            unlisten();
        }
    }, []);

    const handleSuperviseAIOptionSelect = (supervisedai_id) => (event) => {
        let newsearch = search.split("?").filter(w => !w.startsWith("trainingview")).join("?");
        return props.history.push(`${url}${newsearch}?trainingview=${supervisedai_id}`);
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

    const toggleConditionalSentence = async (choice, sentence, index) => {
        if (typeof choice?.ai_enum !== 'number') return;
        const new_user_class = choice.ai_enum;

        let newConditionalSentences = [...conditionalSentences];
        newConditionalSentences[index] = Object.assign({}, sentence, {
            user_class: new_user_class
        });
        setConditionalSentences(newConditionalSentences);

        // call api with sentence.sentence_id new_user_class
        Api.superviseAISentence(sentence.sentence_id, currentView, new_user_class);
    }

    const toggleAiWordsAndConfirmSentence = async () => {

    }

    const toggleWordType = async (choice, word, index, parentIndex) => {
        if (typeof choice?.ai_enum !== 'number') return;
        const new_user_class = choice.ai_enum;

        let newWordTypeList = [...wordTypeList];
        let new_word_list = [...wordTypeList[parentIndex].word_list];
        new_word_list[index] = Object.assign({}, word, {
            user_class: new_user_class
        });
        newWordTypeList[parentIndex] = Object.assign({}, wordTypeList[parentIndex], {
            word_list: new_word_list
        });
        setWordTypeList(newWordTypeList);

        // call api with word.word_id new_user_class
        Api.superviseAIWord(word.word_id, currentView, new_user_class);
    }

    const togglePhraseType = async (choice, phrase, index, parentIndex) => {
        if (typeof choice?.ai_enum !== 'number') return;
        const new_user_class = choice.ai_enum;

        let newPhraseTypeList = [...phraseTypeList];
        let new_phrase_list = [...phraseTypeList[parentIndex].phrase_list];
        new_phrase_list[index] = Object.assign({}, phrase, {
            user_class: new_user_class
        });
        newPhraseTypeList[parentIndex] = Object.assign({}, phraseTypeList[parentIndex], {
            phrase_list: new_phrase_list
        });
        setPhraseTypeList(newPhraseTypeList);

        // call api with word.word_id new_user_class
        Api.superviseAIPhrase(phrase.phrase_id, currentView, new_user_class);
    }

    const createConditionalSentenceEl = (sentence, index, classes) => {
        let className = "";
        switch (sentence.user_class) {
            case 0:
                className = className + "user_toggle_false";
                break;
            case 1:
                className = className + "user_toggle_true";
                break;
            case null:
            default:
                break;
        }
        if (className.length > 0) {
            className = className + " ";
        }
        switch (sentence.ai_class) {
            case 0:
                className = className + "ai_toggle_false";
                break;
            case 1:
                className = className + "ai_toggle_true";
                break;
            case null:
            default:
                break;
        }

        return (
            <span key={sentence.sentence_id}
                  className={className}
                  onClick={openSentencesSuperviseAiChoicesMenu(sentence, index)}
            >
                {sentence.sentence_text}
            </span>
        );
    }

    const renderConditionalSentences = (classes) => {
        return conditionalSentences.map((sentence, index) => {
            return createConditionalSentenceEl(sentence, index, classes);
        });
    }

    const handlerowchecktoggle = async (row, index) => {
        let newWordTypeList = [...wordTypeList];
        newWordTypeList[index] = Object.assign({}, row, {
            is_logic_trained_by_user: !row.is_logic_trained_by_user
        });

        let body = {}
        // true
        if (!row.is_logic_trained_by_user) {
            body = {
                supervisedai_id: +currentView,
                is_sentence_confirmed: true,
                word_list: row.word_list,
            }
        }
        // false: need api to handle
        else {
            body = {
                supervisedai_id: +currentView,
                is_sentence_confirmed: false,
                word_list: row.word_list,
            }
        }
        setWordTypeList(newWordTypeList);
        const response = await Api.superviseAIWordsAndConfirmSentence(body);
    }

    const renderWordTypes = (classes) => {
        return wordTypeList.map((row, ri) => {
            let word_list = row?.word_list || [];
            return (
                <React.Fragment key={`word_row-${ri}`}>
                    <IconButton className={classes.rowchecktoggle} onClick={() => handlerowchecktoggle(row, ri)}>
                        { row.is_logic_trained_by_user ? (<CheckBoxIcon />) : (<CheckBoxOutlineBlankIcon />)}
                    </IconButton>
                    <div className={classes.wordtyperow}>
                        {
                            word_list.map((word, wi) => {
                                const ai_class = word.ai_class !== null ? superviseAIChoices.find(c => c.ai_enum === word.ai_class).name.toLowerCase().replace(/ /g, '_') : "";
                                const user_class = word.user_class !== null ? superviseAIChoices.find(c => c.ai_enum === word.user_class).name.toLowerCase().replace(/ /g, '_') : "";
                                return (
                                    <React.Fragment key={`word-${word}-${wi}`}>
                                    <span className={`word ai_toggle_${ai_class} user_toggle_${user_class}`} onClick={openWordsSuperviseAiChoicesMenu(word, wi, ri)}>
                                        {word.word_text}
                                    </span>
                                        {/* {wi === (word_list.length - 1) ? "." : " "} */}
                                        {" "}
                                    </React.Fragment>
                                );
                            })
                        }
                    </div>
                </React.Fragment>
            );
        });
    }

    const renderPhraseTypes = (classes) => {
        console.log(classes);
        console.log(phraseTypeList);
        return phraseTypeList.map((row, ri) => {
            let phrase_list = row?.phrase_list || [];
            return (
                <React.Fragment key={`phrase_row-${ri}`}>
                    {/* <IconButton className={classes.rowchecktoggle} onClick={() => handlerowchecktoggle(row, ri)}>
                        { row.is_logic_trained_by_user ? (<CheckBoxIcon />) : (<CheckBoxOutlineBlankIcon />)}
                    </IconButton> */}
                    <div className={classes.wordtyperow}>
                        {
                            phrase_list.map((phrase, wi) => {
                                if (phrase.is_for_training) {
                                    const ai_class = phrase.ai_class !== null ? superviseAIChoices.find(c => c.ai_enum === phrase.ai_class).name.toLowerCase().replace(/ /g,'_') : "";
                                    const user_class = phrase.user_class !== null ? superviseAIChoices.find(c => c.ai_enum === phrase.user_class).name.toLowerCase().replace(/ /g,'_') : "";
                                    return (
                                        <React.Fragment key={`phrase-${phrase}-${wi}`}>
                                        <span className={`phrase ai_toggle_${ai_class} user_toggle_${user_class}`} onClick={openWordsSuperviseAiChoicesMenu(phrase, wi, ri)}>
                                            {phrase.phrase_text}
                                        </span>
                                            {/* {wi === (phrase_list.length - 1) ? "." : " "} */}
                                            {" "}
                                        </React.Fragment>
                                    );
                                } else {
                                    return (
                                        <React.Fragment key={`phrase-${phrase}-${wi}`}>
                                        <span className={`no_event`}>
                                            {phrase.phrase_text}
                                        </span>
                                            {/* {wi === (phrase_list.length - 1) ? "." : " "} */}
                                            {" "}
                                        </React.Fragment>
                                    );
                                }
                            })
                        }
                    </div>
                </React.Fragment>
            );
        });
    }

    const renderCardBodyConditionalSentences = (classes) => {
        return (
            <>
                <Tooltip title="Return">
                    <IconButton className={classes.aiOptionReturn}
                                size="small"
                                onClick={handleSuperviseAIOptionSelect(0)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <div className={`${classes.conditionalsentenceslegend}`}>
                    <Typography variant="caption" className="legend_title">
                        USER LEGEND
                    </Typography>
                    {
                        superviseAIChoices.map(choice => {
                            return (
                                <Typography variant="body2" key={choice.name} className={`user_toggle_${choice.name.toLowerCase()}`}>
                                    {choice.name}
                                </Typography>
                            );
                        })
                    }
                    <Typography variant="caption" className="legend_title">
                        AI LEGEND
                    </Typography>
                    {
                        superviseAIChoices.map(choice => {
                            return (
                                <Typography variant="body2" key={choice.name} className={`ai_toggle_${choice.name.toLowerCase()}`}>
                                    {choice.name}
                                </Typography>
                            );
                        })
                    }
                </div>
                <div className={classes.conditionalsentencescontent}>
                    <Typography className={classes.conditionalsentencesdescription}>
                        You are now in training mode for conditional sentences. Click on a sentence to toggle its state.
                        <Tooltip title="A conditional sentence is a type of sentence that states a condition and the outcome of that condition occurring.">
                            <IconButton className={classes.helpbutton} size="small" disableFocusRipple disableRipple>
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <Typography className={classes.conditionalsentencesdescription}>
                        Sentences manually set by the user are color displayed as:
                    </Typography>
                    <div className={classes.colorsections}>
                        {
                            superviseAIChoices.map(choice => {
                                return (
                                    <Typography variant="body2" key={choice.name} className={`user_toggle_${choice.name.toLowerCase()}`}>
                                        {choice.name}
                                    </Typography>
                                );
                            })
                        }
                    </div>
                    <Typography className={classes.conditionalsentencesdescription}>
                        Sentences set by the AI are color displayed as:
                    </Typography>
                    <div className={classes.colorsections}>
                        {
                            superviseAIChoices.map(choice => {
                                return (
                                    <Typography variant="body2" key={choice.name} className={`ai_toggle_${choice.name.toLowerCase()}`}>
                                        {choice.name}
                                    </Typography>
                                );
                            })
                        }
                    </div>
                    <div className={classes.conditionalsentences}>
                        {
                            renderConditionalSentences(classes)
                        }
                    </div>
                </div>
            </>
        );
    }

    const renderCardBodyWordTypes = (classes) => {
        return (
            <>
                <Tooltip title="Return">
                    <IconButton className={classes.aiOptionReturn}
                                size="small"
                                onClick={handleSuperviseAIOptionSelect(0)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <div className={`${classes.conditionalsentenceslegend}`}>
                    <Typography variant="caption" className="legend_title">
                        USER LEGEND
                    </Typography>
                    {
                        superviseAIChoices.map(choice => {
                            return (
                                <Typography variant="body2" key={choice.name} className={`word user_toggle_${choice.name.toLowerCase()}`}>
                                    {choice.name}
                                </Typography>
                            );
                        })
                    }
                    <Typography variant="caption" className="legend_title">
                        AI LEGEND
                    </Typography>
                    {
                        superviseAIChoices.map(choice => {
                            return (
                                <Typography variant="body2" key={choice.name} className={`word ai_toggle_${choice.name.toLowerCase()}`}>
                                    {choice.name}
                                </Typography>
                            );
                        })
                    }
                </div>
                <div className={classes.conditionalsentencescontent}>
                    <Typography className={classes.conditionalsentencesdescription}>
                        You are now in training mode for word types. Click on a word to select its type.
                    </Typography>
                    <Typography className={classes.conditionalsentencesdescription}>
                        Words types set by the user are color displayed as:
                    </Typography>
                    <div className={classes.colorsections}>
                        {
                            superviseAIChoices.map(choice => {
                                return (
                                    <Typography variant="body2" key={choice.name} className={`word user_toggle_${choice.name.toLowerCase()}`}>
                                        {choice.name}
                                    </Typography>
                                );
                            })
                        }
                    </div>
                    <Typography className={classes.conditionalsentencesdescription}>
                        Word types set by the AI are color displayed as:
                    </Typography>
                    <div className={classes.colorsections}>
                        {
                            superviseAIChoices.map(choice => {
                                return (
                                    <Typography variant="body2" key={choice.name} className={`word ai_toggle_${choice.name.toLowerCase()}`}>
                                        {choice.name}
                                    </Typography>
                                );
                            })
                        }
                    </div>
                    <div className={classes.wordtypes}>
                        {
                            renderWordTypes(classes)
                        }
                    </div>
                </div>
            </>
        );
    }

    const renderCardBodyPhraseTypes = (classes) => {
        return (
            <>
                <Tooltip title="Return">
                    <IconButton className={classes.aiOptionReturn}
                                size="small"
                                onClick={handleSuperviseAIOptionSelect(0)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <div className={`${classes.conditionalsentenceslegend}`}>
                    <Typography variant="caption" className="legend_title">
                        USER LEGEND
                    </Typography>
                    {
                        superviseAIChoices.map(choice => {
                            return (
                                <Typography variant="body2" key={choice.name} className={`phrase user_toggle_${choice.name.toLowerCase().replace(/ /g,'_')}`}>
                                    {choice.name}
                                </Typography>
                            );
                        })
                    }
                    <Typography variant="caption" className="legend_title">
                        AI LEGEND
                    </Typography>
                    {
                        superviseAIChoices.map(choice => {
                            return (
                                <Typography variant="body2" key={choice.name} className={`phrase ai_toggle_${choice.name.toLowerCase().replace(/ /g,'_')}`}>
                                    {choice.name}
                                </Typography>
                            );
                        })
                    }
                </div>
                <div className={classes.conditionalsentencescontent}>
                    <Typography className={classes.conditionalsentencesdescription}>
                        You are now in training mode for phrase types. Click on a phrase to select its type.
                    </Typography>
                    <Typography className={classes.conditionalsentencesdescription}>
                        Phrase types set by the user are color displayed as:
                    </Typography>
                    <div className={classes.colorsections}>
                        {
                            superviseAIChoices.map(choice => {
                                return (
                                    <Typography variant="body2" key={choice.name} className={`phrase user_toggle_${choice.name.toLowerCase().replace(/ /g,'_')}`}>
                                        {choice.name}
                                    </Typography>
                                );
                            })
                        }
                    </div>
                    <Typography className={classes.conditionalsentencesdescription}>
                        Phrase types set by the AI are color displayed as:
                    </Typography>
                    <div className={classes.colorsections}>
                        {
                            superviseAIChoices.map(choice => {
                                return (
                                    <Typography variant="body2" key={choice.name} className={`phrase ai_toggle_${choice.name.toLowerCase().replace(/ /g,'_')}`}>
                                        {choice.name}
                                    </Typography>
                                );
                            })
                        }
                    </div>
                    <div className={classes.wordtypes}>
                        {
                            renderPhraseTypes(classes)
                        }
                    </div>
                </div>
            </>
        );
    }

    const renderCardBodyDefault = (classes) => {
        return (
            <div className={classes.conditionalsentencescontent}>
                <Typography variant="h6">
                    Select a training method to continue. The more data set will help improve future AI output.
                </Typography>
                <div>
                    {
                        superviseAIOptions.map(option => {
                            return (
                                <div className={`${classes.aitrainingmethodButton}`}
                                     key={option.name}
                                     onClick={handleSuperviseAIOptionSelect(option.supervisedai_id)}
                                >
                                    <div className={`${classes.aitrainingmethodButtonHeader}`}>
                                        { option.name }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

    const renderCardBody = (classes) => {
        if (queryView && queryView.value && +queryView.value === 0) {
            return renderCardBodyDefault(classes);
        }
        if (queryView && queryView.value && +queryView.value === 1 || 
            queryView && queryView.value && +queryView.value === 5) {
            return renderCardBodyConditionalSentences(classes);
        }
        else if (queryView && queryView.value && +queryView.value === 2) {
            return renderCardBodyWordTypes(classes);
        }
        else if (queryView && queryView.value && +queryView.value === 3 || 
            queryView && queryView.value && +queryView.value === 4
        ) {
            return renderCardBodyPhraseTypes(classes);
        }
        else return (null);
    }

    if (!dataLoaded) return (
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
            <div className={`${classes.content}`}>
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
                <div className={`${classes.contentview}`}>
                    <div className={classes.contentviewleft}>
                        {
                            dataLoaded ? (
                                <div className={classes.contentcard}>
                                    <div className={classes.contentcardtitle}>
                                        {getBreadCrumbs()}
                                    </div>
                                    <div className={`${classes.documentcardbody}`} ref={documentcardbodyref}>
                                        {
                                            renderCardBody(classes)
                                        }
                                    </div>
                                </div>
                            ) : (
                                <CircularProgress size={100} />
                            )
                        }
                    </div>
                </div>
                <Menu
                    id="supervise-ai-choices-menu"
                    anchorReference="anchorPosition"
                    anchorPosition={!!superviseAiChoicesAnchorPosition ? {
                        top: superviseAiChoicesAnchorPosition?.y,
                        left: superviseAiChoicesAnchorPosition?.x
                    } : undefined}
                    keepMounted
                    open={!!superviseAiReference && !!superviseAiChoicesAnchorPosition}
                    onClose={closeSuperviseAiChoicesMenu}
                    TransitionComponent={Fade}
                >
                    {
                        superviseAIChoices.map(choice => {
                            return (
                                <MenuItem onClick={handleSuperviseAiChoiceSelect(choice)}
                                          key={choice.name}
                                          className={
                                              `${classes.superviseAIMenu} ${currentView === 2 ? "word" : ""} ${currentView === 3 || currentView === 4 ? "phrase" : ""} user_toggle_${choice.name.toLowerCase().replace(/ /g,'_')}`
                                          }
                                >
                                    {choice.name}
                                </MenuItem>
                            );
                        })
                    }
                </Menu>
            </div>
        </>
    );
}

export default connect(mapStateToProps)(DocumentView);
