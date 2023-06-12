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
import {getPhraseColor} from "../utils/getPhraseColor";
import Popover from "@material-ui/core/Popover";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {lighten} from "@material-ui/core/styles/colorManipulator";
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import InputIcon from "@material-ui/icons/Input";
import ToastService from "../Toast/ToastService";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SortableCard from "../Card/SortableCard";

// VIEW CONSTS
const SIDE_VIEW = "SIDE_VIEW";
const LIST_VIEW = "LIST_VIEW";

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings
    }
}

const useStyles = makeStyles((theme) => ({
    root: {},
    content: {
        ...rootContainerFullWithTheme(theme),
        flexDirection: "column",
        height: "calc(100% - 64px)",
        width: "calc(100% - 64px)",
        margin: "0 0 32px",
        overflow: "hidden",
        justifyContent: "flex-start",
        boxSizing: "border-box"
    },
    context: {
        width: "100%",
        height: "100%",
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
                maxWidth: "calc(100% - 64px)"
            },
        },
        "& .ce-block__content": {
            margin: "auto",
            [theme.breakpoints.down('md')]: {
                maxWidth: "calc(100% - 32px)"
            },
            [theme.breakpoints.up('lg')]: {
                maxWidth: "calc(100% - 64px)"
            },
        },
        "& .cdx-block": {
            fontSize: "14px",
            padding: "0.4em 0",
        },
        "& .ce-block": {
            borderBottom: "1px solid rgba(150, 150, 150, 0.2)"
        },
        "& .original-context--active": {
            border: "1px solid #4087FF",
            borderBottom: "1px solid #4087FF"
        }
    },
    contentview: {
        width: "100%",
        height: "100%",
        display: "flex"
    },
    contentviewleft: {
        flex: "1 1 50%",
        display: "flex",
        flexDirection: "column",
        order: 1,
        boxShadow: theme.shadows[2],
    },
    contentviewright: {
        flex: "1 1 calc(50% - 10px)",
        width: "calc(50% - 10px)",
        paddingLeft: "10px",
        display: "flex",
        flexDirection: "column",
        order: 2,
        boxShadow: theme.shadows[2],
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
        padding: "8px",
        ...theme.typography.body2,
        fontFamily: "inherit",
        lineHeight: "unset",
        letterSpacing: "unset",
        "& .MuiTypography-body1": {
            fontSize: "14px",
        },
    },
    contentcards: {
        width: "100%",
        height: "auto",
        maxHeight: "calc(100% - 85px)",
        overflow: "auto",
        marginBottom: "16px",
        "& $contentcard": {
            marginTop: "6px"
        }
    },
    contentcard: {
        width: "100%",
        height: "auto",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
        padding: "0 0 6px",
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
                maxWidth: "calc(100% - 32px)"
            },
            [theme.breakpoints.up('lg')]: {
                maxWidth: "calc(100% - 64px)"
            },
        },
        "& .ce-block__content": {
            margin: "auto",
            [theme.breakpoints.down('md')]: {
                maxWidth: "calc(100% - 32px)"
            },
            [theme.breakpoints.up('lg')]: {
                maxWidth: "calc(100% - 64px)"
            },
        },
        "& .cdx-block": {
            fontSize: "14px",
            padding: "0.4em 0",
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
            maxWidth: "calc(100% - 32px)"
        },
        "& .ce-block__content": {
            maxWidth: "calc(100% - 32px)"
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
    documentList: {
        background: "rgba(0, 0, 0, 0.05)",
        padding: "6px",
    },
    documentListContainer: {
        width: "100%",
        maxHeight: "300px",
        padding: "6px 0",
        boxSizing: "border-box"
    },
    searchBlock: {
        display: "flex",
        width: "100%",
        padding: "0",
        borderBottom: "1px solid rgba(150, 150, 150, 0.2)",
    },
    searchTextField: {
        height: "72px",
        display: "flex",
        flex: "1",
        alignItems: "flex-end",
        padding: "0",
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
    floatRight: {
        position: "absolute",
        right: 0,
        display: "inline-block"
    },
    descriptionfiller: {
        ...theme.typography.caption,
        color: "rgba(0, 0, 0, 0.67)",
    },
    displayContextButton: {
        position: "absolute",
        right: "0",
        top: "0"
    },
    expandDocumentsButton: {
        position: "absolute",
        top: "0",
        right: "4px"
    },
    label: {
        fontSize: "12px",
        padding: "2px 0"
    },
    labelContainer: {
        height: "22px",
        width: "100%",
        paddingLeft: "12px"
    }
}));

function DocumentView(props){
    const classes = useStyles(props);
    const { url } = useRouteMatch();
    const { search } = useLocation();
    const history = useHistory();
    // false: shows spinner; true: shows editor with data
    const [dataLoaded, setDataLoaded] = useState(false);
    const documentcardbodyref = useRef(null);
    // array of the files ids
    const [searchIds, setSearchIds] = useState([]);
    // array of the files data
    const [files, setFiles] = useState([]);
    const [currentView, setCurrentView] = useState(LIST_VIEW);
    const [displayDocumentList, setDisplayDocumentList] = useState(false);
    const [searchContextField, setSearchContextField] = React.useState("");
    const [searchPhraseDataLoaded, setSearchPhraseDataLoaded] = useState(false);
    // data returned from api
    const [answers, setAnswers] = useState([]);
    // current marked glossary element
    const [markedGlossaryEl, setMarkedGlossaryEl] = useState(null);
    // current marked sentence element
    const [markedEl, setMarkedEl] = useState(null);
    const [markedBlock, setMarkedBlock] = useState(null);

    const getQueryFormat = (query) => query.split("?")
        .filter(q => q.length > 0)
        .map(s => {
            const [param, value] = s.split("=");
            return {
                param: param,
                value: value
            }
        });
    const getQuery = (qs, param) => {
        return qs.find(q => q.param === param);
    }

    const getIds = async (ids) => {
        // get doc data
        const promises = ids.map(id => {
            return Api.getDocument(id);
        });
        const responses = await Promise.all(promises);
        const jsons = responses.map(response => Object.assign({}, response?._json, {
            selected: false
        }));
        return jsons;
    }

    const handleViewInit = async (_search = search) => {
        const queries = getQueryFormat(_search);
        // queryId.value = ids of documents
        const queryId = getQuery(queries, "search");
        if (!queryId) return;
        // searchIds = array of integers
        const searchIds = queryId.value.split("-").map(e => +e);

        // if searchIds
        if (searchIds && searchIds.length > 0) {
            const jsons = await getIds(searchIds);
            // set side view if 2 documents
            if (searchIds.length === 2) {
                setCurrentView(SIDE_VIEW);
                setFiles(jsons.map(d => {
                    d.selected = true;
                    return d;
                }));
            }
            else {
                setFiles(jsons);
            }
            setSearchIds(searchIds);
            setDataLoaded(true);
        }
    }

    useEffect(() => {
        let unlisten = history.listen((ev) => {
            const { search } = ev;
            handleViewInit(search);
        });
        handleViewInit();

        return () => {
            unlisten();
        }
    }, []);

    const moveCard = (dragIndex, hoverIndex) => {
        const newFiles = [...files];
        newFiles[dragIndex] = files[hoverIndex];
        newFiles[hoverIndex] = files[dragIndex];
        setFiles(newFiles);
        const newAnswers = [...answers];
        newAnswers.sort((a, b) => newFiles.findIndex(f => f.documentid === a.id) - newFiles.findIndex(f => f.documentid === b.id));
        setAnswers(newAnswers);
    }

    const toggleSelectedCard = (index) => (event) => {
        const selected = files.filter(f => f.selected);
        const newBoolean = !files[index].selected;
        const newFiles = [...files];

        if (selected.length === 2 && newBoolean) {
            const lastIndex = files.findIndex(f => f === selected[1]);
            newFiles.splice(lastIndex, 1, Object.assign({}, files[lastIndex], {
                selected: !files[lastIndex].selected
            }));
        }

        newFiles.splice(index, 1, Object.assign({}, files[index], {
            selected: !files[index].selected
        }));
        setFiles(newFiles);
    }

    const markGlossaryEl = (phrase_id) => {
        setMarkedGlossaryEl(phrase_id);
    }

    const unmarkGlossaryEl = () => {
        setMarkedGlossaryEl(null);
    }

    const markel = (span) => {
        setMarkedEl(span.sentence_id);
    }

    const unmarkel = () => {
        setMarkedEl(null);
    }

    const markelfromside = (sentence_id) => {
        setMarkedEl(sentence_id);
    }

    const unmarkelfromside = (sentence_id) => {
        setMarkedEl(null);
    }

    const markblock = (sentence_id) => {
        setMarkedBlock(sentence_id);
    }

    const unmarkblock = () => {
        setMarkedBlock(null);
    }

    const toggleExpandDocuments = () => {
        setDisplayDocumentList(!displayDocumentList);
    }

    const toggleView = () => {
        if (currentView === SIDE_VIEW) {
            setCurrentView(LIST_VIEW);
        }
        else {
            setCurrentView(SIDE_VIEW);
        }
    }

    const clearSearch = () => {
        setSearchContextField("");
    }

    const handleSearchContextChange = (event) => {
        setSearchContextField(event.target.value);
    };

    const toggleDisplayContext = (index) => () => {
        let newAnswers = [...answers];
        let newAnswer = Object.assign({}, answers[index], {
            displayContext: !answers[index].displayContext
        });
        newAnswers.splice(index, 1, newAnswer);
        setAnswers(newAnswers);
    }

    const configSentences = (data) => {
        return data.map(s => {
            if (s.phrase_list.length > 0) {
                const glossary = s.phrase_list.map(phrase => phrase.text.replace(/[()|]/g, '\\$&')).filter(g => !g.includes("[", "]", "(", ")"));
                const reg = `(${glossary.join("|")})`;
                let begin_regex = "(?<=[\\n\\r\\s])(";
                let middle_regex = ")(?=[\\n\\r\\s,s'.!?])|(^";
                let end_regex = ")(?=[\\n\\r\\s,s'.!?])";
                let regex = `${begin_regex}${reg}${middle_regex}${reg}${end_regex}`; //begin_regex + reg + middle_regex + reg + end_regex
                const textsplit = s.text.split(new RegExp(regex, "gi"));
                const textsplitfilter = textsplit.filter((t, index) => !!t && textsplit.indexOf(t) === index);
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

    const handleSearchConfirm = async (event) => {
        setDataLoaded(false);
        const obj = {
            question: searchContextField,
            is_long_form: true,
            compare_document_list: searchIds
        }
        const response = await Api.getComparedDocumentListQuestionAnswered(obj);
        if (!response) return;
        const json = response?._json;
        // set data array with new variables and sort by the files array
        const data = json.map((obj, index) => {
            let _data = obj.context_paragraph_list.reduce((arr, p) => arr.concat(p?.sentence_list || []), []);
            let id = obj.context_paragraph_list[0]?.document_id;
            let name = obj.context_paragraph_list[0]?.document_name;
            let sentences = configSentences(_data);
            return {
                id: id,
                name: name,
                answer: obj.answer,
                sentences: sentences,
                displayContext: false
            }
        }).sort((a, b) => files.findIndex(f => f.documentid === a.id) - files.findIndex(f => f.documentid === b.id));
        setAnswers(data);
        setSearchPhraseDataLoaded(true);
        setDataLoaded(true);
    }

    const renderSideSentences = (sentences) => {
        return sentences.map((sentence, index) => (
            <div className="ce-block"
                 key={`${sentence.sentence_id}-${index}`}
                 onMouseEnter={() => {markblock(sentence.sentence_id)}}
                 onMouseLeave={() => {unmarkblock(sentence.sentence_id)}}
            >
                <div className="ce-block__content">
                    <div className="editor-wrapper">
                        <div className={`cdx-block`}>
                            <span className={markedEl === sentence.sentence_id ? "cdx-lookup" : ""}
                                  key={sentence.sentence_id}
                                  sentenceid={sentence.sentence_id}
                                  onMouseEnter={() => {markelfromside(sentence.sentence_id)}}
                                  onMouseLeave={() => {unmarkelfromside(sentence.sentence_id)}}
                            >
                                {
                                    sentence.elements.map((s, index) => {
                                        if (typeof s === "string") return (
                                            <span key={`${s}-${index}`}>
                                            {s} {index === sentence.elements.length - 1 ? " " : ""}
                                            </span>
                                        );
                                        else {
                                            let style = {}
                                            const color = getPhraseColor(s.phrase_type_str);
                                            if (color) {
                                                const background = lighten(color, 0.7);
                                                style = {
                                                    color: color,
                                                    backgroundColor: markedGlossaryEl === s.phrase_id ? background : ""
                                                }
                                            }
                                            return (
                                                <span key={`${s.phrase_id}-${index}`}
                                                      style={style}
                                                      onMouseEnter={() => {markGlossaryEl(s.phrase_id)}}
                                                      onMouseLeave={() => {unmarkGlossaryEl()}}
                                                >
                                                    {s.text} {index === sentence.elements.length - 1 ? " " : ""}
                                                </span>
                                            );
                                        }
                                    })
                                }
                           </span>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    const renderListView = (classes) => {
        return (
            <>
                {
                    dataLoaded ? (
                        <>
                            <div className={classes.labelContainer}>
                                <div className={`MuiFormLabel-root MuiInputLabel-root ${classes.label}`}>
                                    Results
                                </div>
                            </div>
                            <div className={classes.contentcards}>
                                {
                                    renderAnswers(classes)
                                }
                            </div>
                        </>
                    ) : (
                        <div className={classes.contentcards}>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                        </div>
                    )
                }
            </>
        );
    }

    const renderSideView = (classes) => {
        return (
            <>
                {
                    dataLoaded ? (
                        <>
                            <div className={classes.labelContainer}>
                                <div className={`MuiFormLabel-root MuiInputLabel-root ${classes.label}`}>
                                    Results
                                </div>
                            </div>
                            <div className={classes.contentcards}>
                                {
                                    renderSideAnswers(classes)
                                }
                            </div>
                        </>
                    ) : (
                        <div className={classes.contentcards}>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                            <Skeleton height={50} width="100%"/>
                            <Skeleton height={75} width="100%"/>
                        </div>
                    )
                }
            </>
        );
    }

    const renderView = (classes) => {
        if (currentView === LIST_VIEW) {
            return renderListView(classes);
        }
        else if (currentView === SIDE_VIEW) {
            return renderSideView(classes);
        }
        else {
            return (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "600", padding: "24px 0"}}>
                    No Data To Display
                </div>
            );
        }
    }

    const renderNoData = () => {
        return (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "600", padding: "24px 0"}}>
                No Data To Display
            </div>
        );
    }

    const renderSideAnswers = (classes) => {
        const selectedFiles = files.filter(f => f.selected);
        if (answers.length === 0 || selectedFiles.length === 0) return renderNoData();

        const file1 = selectedFiles[0] ? answers.find(a => a.id === selectedFiles[0].documentid) : null;
        const file2 = selectedFiles[1] ? answers.find(a => a.id === selectedFiles[1].documentid) : null;

        return (
            <div className={classes.contentview}>
                {
                    file1 ? (
                        <div className={classes.contentviewleft}>
                            <div className={classes.context}>
                                <div className={classes.contexttitle}>
                                    {file1.name}
                                </div>
                                <div className={classes.contextcontent}>
                                    <div className="ce-block">
                                        <div className="ce-block__content">
                                            <Typography variant="h6">
                                                Answer:
                                            </Typography>
                                        </div>
                                        <div className="ce-block__content">
                                            <Typography className="cdx-block">
                                                {file1.answer}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="ce-block__content">
                                            <Typography variant="h6">
                                                Context:
                                            </Typography>
                                        </div>
                                    </div>
                                    {
                                        file1.sentences.length > 0 ? (
                                            renderSideSentences(file1.sentences)
                                        ) : (
                                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "600", padding: "24px 0"}}>
                                                No Data To Display
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
                {
                    file2 ? (
                        <div className={classes.contentviewright}>
                            <div className={classes.context}>
                                <div className={classes.contexttitle}>
                                    {file2.name}
                                </div>
                                <div className={classes.contextcontent}>
                                    <div className="ce-block">
                                        <div className="ce-block__content">
                                            <Typography variant="h6">
                                                Answer:
                                            </Typography>
                                        </div>
                                        <div className="ce-block__content">
                                            <Typography className="cdx-block">
                                                {file2.answer}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="ce-block__content">
                                            <Typography variant="h6">
                                                Context:
                                            </Typography>
                                        </div>
                                    </div>
                                    {
                                        file2.sentences.length > 0 ? (
                                            renderSideSentences(file2.sentences)
                                        ) : (
                                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "600", padding: "24px 0"}}>
                                                No Data To Display
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
            </div>
        );
    }

    const renderAnswers = (classes) => {
        if (answers.length === 0) return renderNoData();

        return answers.map((answer, index) => {
            return (
                <div className={`${classes.contentcard} ${classes.documentcardbody}`} key={answer.name}>
                    <IconButton className={classes.displayContextButton}
                                size="small"
                                onClick={toggleDisplayContext(index)}
                    >
                        {
                            answer.displayContext ? (
                                <ExpandLessIcon/>
                            ) : (
                                <ExpandMoreIcon/>
                            )
                        }
                    </IconButton>
                    <div className={classes.contexttitle}>
                        {answer.name}
                    </div>
                    <div className="ce-block">
                        <div className="ce-block__content">
                            <Typography variant="h6">
                                Answer:
                            </Typography>
                        </div>
                        <div className="ce-block__content">
                            <Typography className="cdx-block">
                                {answer.answer}
                            </Typography>
                        </div>
                    </div>
                    {
                        answer.displayContext ? (
                            <>
                                <div>
                                    <div className="ce-block__content">
                                        <Typography variant="h6">
                                            Context:
                                        </Typography>
                                    </div>
                                </div>
                                {
                                    answer.sentences.length > 0 ? (
                                        renderSideSentences(answer.sentences)
                                    ) : (
                                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "600", padding: "24px 0"}}>
                                            No Data To Display
                                        </div>
                                    )
                                }
                            </>
                        ) : (null)
                    }
                </div>
            );
        });
    }

    const searchStatus = searchContextField !== "";
    return (
        <>
            <div className={`${classes.content}`}>
                <div className={classes.contentheader}>
                    File Search: {currentView === SIDE_VIEW ? "Side Comparison" : "List Comparison"}
                    <Tooltip title="Toggle View">
                        <IconButton size="small"
                                    onClick={toggleView}>
                            <ViewModuleIcon/>
                        </IconButton>
                    </Tooltip>
                    <div className={classes.floatRight}>
                        <Tooltip title={displayDocumentList ? "Close File List" : "Open File List"}>
                            <IconButton size="small"
                                        onClick={toggleExpandDocuments}
                            >
                                {
                                    displayDocumentList ? (
                                        <ExpandLessIcon/>
                                    ) : (
                                        <ExpandMoreIcon/>
                                    )
                                }
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>

                <div className={classes.searchBlock}>
                    <div className={classes.searchTextField}>
                        <InputLabel id="context-search-bar-label" className={classes.label} style={{ position: "absolute", top: "0" }}>Search By Context</InputLabel>
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
                            fullWidth
                        />
                    </div>
                    <div className={classes.searchClear}>
                        <Tooltip title="Clear Search">
                            <IconButton onClick={clearSearch}>
                                <CloseIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className={classes.searchConfirm}>
                        <Button variant="contained"
                                size="large"
                                disabled={(!searchStatus)}
                                onClick={handleSearchConfirm}
                        >
                            Search
                        </Button>
                    </div>
                </div>
                {
                    displayDocumentList ? (
                        <div className={classes.documentListContainer}>
                            <div className={`MuiFormLabel-root MuiInputLabel-root ${classes.label}`}>
                                Files
                            </div>
                            <div className={classes.documentList}>
                                <DndProvider backend={HTML5Backend}>
                                    {
                                        files.map((file, i) => {
                                            return (
                                                <div className={classes.documentListRow}
                                                     key={file.name}
                                                >
                                                    <SortableCard key={file.name}
                                                                  index={i}
                                                                  last={(files.length - 1) === i}
                                                                  id={file.name}
                                                                  text={file.name}
                                                                  selected={file.selected}
                                                                  moveCard={moveCard}
                                                                  displayCheckbox={currentView === SIDE_VIEW}
                                                                  toggleSelected={toggleSelectedCard}
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </DndProvider>
                            </div>
                        </div>
                    ) : (null)
                }
                { renderView(classes) }
            </div>
        </>
    );
}

export default connect(mapStateToProps)(DocumentView);
