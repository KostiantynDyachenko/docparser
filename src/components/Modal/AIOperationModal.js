import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import DialogContentText from '@material-ui/core/DialogContentText';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { SetModal } from "../../modules/modalManager/modalManager";
import { ProcessAction } from "../../modules/progressManager/progressManager";
import { SetNodesHierarchy, SetEdges } from "../../modules/flowChartManager/flowChartManager";
import {connect} from "react-redux";
import newAiOperationModalProps from "../NewProps/newAiOperationModalProps";
import FilterListIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from "@material-ui/core/TextField";
import newAIOperationActionPayload from "../NewProps/newAIOperationActionPayload";
import Input from '@material-ui/core/Input';
import {SetRefresh} from "../../modules/fileManager/fileManager";
import { Api } from '../Api';
import { Paper } from '@material-ui/core';
import newFlowChartProps from '../NewProps/newFlowChartProps';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const defaultConfig = {
    summaryratio: 5, // # representation 1 - 9
    summarizermethod: 2, // ["sections", "headers", "paragraphs", "tables"]
}

const initialFields = {
    name: "",
    description: "",
    category: ["medical"], // ["medical", "wireless"]
    operationtype: "", // "" || "summary" || "timeline" || "flowchart"
    configurationtype: "", // "" || "manual" || "default",
    flowcharttype: "", // "" || "decisionTree" || "userDirectedDecisionTree"
    ...defaultConfig
}

const verticalPadding = {
    paddingTop: 0,
    paddingBottom: 0,
}

const useStyles = makeStyles((theme) => {
    return ({
        formrow: {
            position: "relative",
        },
        helpericon: {
            position: "absolute",
            padding: 0,
            top: 0,
            right: 0,
            zIndex: 1,
            "& svg": {
                width: "0.6em",
                height: "0.6em",
            }
        },
        choiceItemText: {
            marginLeft: "20px"
        },
        suggestionsList: {
            position: "absolute",
            top: "170px",
            left: "5px",
            width: "97%",
            zIndex: 3
        },
        choicesList: {
            height: "150px",
            maxHeight: "150px",
            overflow: "auto",
            marginTop: "10px"
        }
    });
});

const mapDispatchToProps = (dispatch) => {
    return {
        SetModal: name => props => dispatch(SetModal(name)(props)),
        ProcessAction: data => dispatch(ProcessAction(data)),
        SetRefresh: (bool) => dispatch(SetRefresh(bool)),
        SetNodesHierarchy: nodes => dispatch(SetNodesHierarchy(nodes)),
        SetEdges: edges => dispatch(SetEdges(edges))
    }
}

const mapStateToProps = (state) => {
    return {
        aioperation: state.modalManager.aioperation,
        nodesHierarchy: state.flowChartManager.nodesHierarchy,
        edges: state.flowChartManager.edges
    }
}

function AIOperationModal(props) {
    const classes = useStyles(props);
    const modalRef = React.useRef();
    const [fields, _handleFieldChange] = useState(initialFields);
    const [open, _setOpen] = useState({
        operationtype: false,
        configurationtype: false,
        category: false,
        summarizermethod: false,
        flowcharttype: false
    });
    const [contentView, setContentView] = useState(0); // 0: operation & config select; 1: manual config input
    const [flowChartFilter, setFlowChartFilter] = useState("");
    const [flowChartFilterSuggestions, setFlowChartFilterSuggestions] = useState([]);
    const [flowChartFilterChoices, setFlowChartFilterChoices] = useState([]);
    const currentNodesHierarchy = React.useRef();

    const isNodesHierarchyUpdating = React.useRef(false);

    const setOpen = (name) => (bool) => {
        _setOpen({
            ...open,
            [name]: bool
        });
    }

    const handleFieldChange = (event) => {
        _handleFieldChange({
            ...fields,
            [event.target.name]: event.target.value
        });
    }

    const handleFlowChartFilterChange = (event) => {
        setFlowChartFilter(event.target.value);
    }

    const handleAddFlowChartFilterChoice = (choice) => {
        let newChoices = [...flowChartFilterChoices];
        newChoices.push(choice);
        setFlowChartFilterChoices(newChoices);
        setFlowChartFilter("");
    }

    const handleDeleteFlowChartFilterChoice = (choice) => {
        let newChoices = [...flowChartFilterChoices];
        newChoices = newChoices.filter(newChoice => newChoice != choice);
        setFlowChartFilterChoices(newChoices);
    }

    useEffect(() => {
        if (flowChartFilter.length == 0 && flowChartFilterSuggestions.length > 0) {
            setFlowChartFilterSuggestions([]);
        }
    }, [flowChartFilterSuggestions])

    useEffect(() => {
        const fetchData = async (request) => {
            const response = await Api.getWordInference(request);
            const wordInferenceList = response?._json;
            let numInferences = 5;

            let filteredInferenceList = wordInferenceList.length > numInferences ? wordInferenceList.slice(0, numInferences) : wordInferenceList;

            setFlowChartFilterSuggestions(filteredInferenceList);
        }

        if (flowChartFilter.length > 0) {
            props.aioperation.row.forEach(doc => {
                let request = {
                    word_input: flowChartFilter,
                    document_id: doc.documentid
                };
                fetchData(request);
            });
        }
    }, [flowChartFilter])

    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
            // TODO: make sure this function is happening on dismount
            props.SetNodesHierarchy([]);
            console.log("I made it to dismount.")
        }
    }, [])

    const marginTop = {
        marginTop: "24px"
    }

    const marginTopHalf = {
        marginTop: "12px"
    }

    const marginBottom = {
        marginBottom: "0"
    }

    useEffect(() => {
        if (props.aioperation.bool && props.aioperation.row.length > 0) {
            _handleFieldChange({
                ...fields,
                "name": props.aioperation.row[0].name.split(".")[0]
            });
        }
    }, [props.aioperation])

    const getSummaryRatio = (n) => {
        switch (+n) {
            case 1:
                return 0.5;
            case 2:
                return 0.6;
            case 3:
                return 0.7;
            case 4:
                return 0.8;
            case 5:
                return 0.9;
            case 6:
                return 1.0;
            case 7:
                return 1.1;
            case 8:
                return 1.2;
        }
    }

    useEffect(() => {
        currentNodesHierarchy.current = props.nodesHierarchy;
        isNodesHierarchyUpdating.current = false;
        console.log("After update isNodesHierarchyUpdating: ", isNodesHierarchyUpdating.current);
    }, [props.nodesHierarchy])

    const sliderOnChange = (event, value) => {
        handleFieldChange({
            target: {
                name: "summaryratio",
                value: value
            }
        })
    }

    const getAlgorithmType = (s) => {
        switch (s) {
            case "summary":
                return 2;
            case "timeline":
                return 3;
            case "flowchart":
                return 4;
            case "generate test cases":
                return 5;
        }
    }

    const processDecisionTree = async (documentIdList, sentenceIdList) => {
        let diagramOutlineRequest = {
            document_id_list: documentIdList,
            sentence_id_list: sentenceIdList
        };
        const diagramOutlineResponse = await Api.getDiagramOutline(diagramOutlineRequest);
        const diagramOutlineJson = diagramOutlineResponse?._json;
        // Failure List
        diagramOutlineJson.failure_list.forEach(failure => {
            let logicExpressionIdList = [];
            logicExpressionIdList.push(failure.logic_expression_id);
            getLogicExpressionDetails(failure.condition_formula_id, logicExpressionIdList);
        });

        // Success List
        diagramOutlineJson.success_list.forEach(success => {
            let logicExpressionIdList = [];
            logicExpressionIdList.push(success.logic_expression_id);
            getLogicExpressionDetails(success.condition_formula_id, logicExpressionIdList);
        });
        
        // Warning List
        diagramOutlineJson.warning_list.forEach(warning => {
            let logicExpressionIdList = [];
            logicExpressionIdList.push(warning.logic_expression_id);
            getLogicExpressionDetails(warning.condition_formula_id, logicExpressionIdList);
        });
    }

    // A: [1, 2, ]
    // B: [1, 3]

    const getLogicExpressionDetails = async (conditionFormulaId, logicExpressionIdList, parentLogicExpression = undefined) => {
        let newLogicExpressionIdListResultA = [...logicExpressionIdList];
        let newLogicExpressionIdListResultB = [...logicExpressionIdList];
        let newLogicExpressionIdListConditionA = [...logicExpressionIdList];
        let newLogicExpressionIdListConditionB = [...logicExpressionIdList];
        let newLogicExpressionIdListFollowing = [...logicExpressionIdList];

        let logicExpressionDetailsRequest = {
            logic_expression_id_list: logicExpressionIdList
        };

        const logicExpressionDetailsResponse = await Api.getLogicExpressionDetails(conditionFormulaId, logicExpressionDetailsRequest);
        const logicExpressionDetailsJson = logicExpressionDetailsResponse?._json;

        // Create Nodes Hierarchy for use in FlowChart
        let newNodesList = [];

        // Condition Node
        let conditionNodeId = `${logicExpressionDetailsJson.logic_expression_id}`;
        let conditionNodeText = "";
        if (logicExpressionDetailsJson.condition_a_variable_string && logicExpressionDetailsJson.condition_a_variable_string != "Subcondition") {
            conditionNodeText = `${logicExpressionDetailsJson.condition_a} {${logicExpressionDetailsJson.condition_a_variable_string}} ${logicExpressionDetailsJson.operator} ${logicExpressionDetailsJson.condition_b}`;
        } else if (logicExpressionDetailsJson.condition_a_variable_string == "Subcondition") {
            conditionNodeText = logicExpressionDetailsJson.operator;
        } else {
            if (logicExpressionDetailsJson.condition_a) {
                conditionNodeText = `${logicExpressionDetailsJson.condition_a}`;
            }
            if (logicExpressionDetailsJson.operator) {
                conditionNodeText += ` ${logicExpressionDetailsJson.operator}`;
            }
            if (logicExpressionDetailsJson.condition_b) {
                conditionNodeText += ` ${logicExpressionDetailsJson.condition_b}`;
            }
        }

        let source = [];
        if (parentLogicExpression?.following_condition_formula_id) {
            // This is currently handling formulas since they are just strings for now, but as they will change I didn't want to modify too drastically
            // formulas currently only reside in result_a and b so they do not need to add the y iterator like we are doing below
            source = [`${parentLogicExpression.logic_expression_id}_resultA`];
        } else if (parentLogicExpression && (parentLogicExpression.operator === "and" || parentLogicExpression.operator === "or") && parentLogicExpression.condition_a_id) {
            source = [`${parentLogicExpression.logic_expression_id}`];
        }

        // console.log("conditionNodeText ", conditionNodeText)
        let conditionNode;
        if (logicExpressionDetailsJson.node_position_x !== 0 && conditionNodeText !== "") {
            conditionNode = {
                id: conditionNodeId,
                type: "default",
                source: source,
                target: [],
                text: conditionNodeText,
                children: [],
                position: {
                    x: logicExpressionDetailsJson.node_position_x, 
                    y: logicExpressionDetailsJson.node_position_y
                },
            }
            newNodesList.push(conditionNode);
        } else {
            console.log("There is no condition for this condition_formula")
        }
        


        //Result Nodes
        if (logicExpressionDetailsJson.result_a != undefined) {
            let sourceIdList = []
            let targetIdList = []
            if (parentLogicExpression && (parentLogicExpression.operator === "and" || parentLogicExpression.operator === "or") && parentLogicExpression.condition_a_id) {
                sourceIdList.push(`${parentLogicExpression.condition_a_id}`);
            } else if (parentLogicExpression && parentLogicExpression.following_condition_formula_id) {
                if (logicExpressionDetailsJson.condition_a || logicExpressionDetailsJson.condition_a_id) {
                    sourceIdList.push(`${logicExpressionDetailsJson.logic_expression_id}`);
                } else {
                    sourceIdList.push(`${parentLogicExpression.logic_expression_id}_resultA`);
                }
                
            } else {
                sourceIdList.push(`${logicExpressionDetailsJson.logic_expression_id}`)
            }
            if (parentLogicExpression && (parentLogicExpression.operator === "and" || parentLogicExpression.operator === "or") && parentLogicExpression.condition_b_id) {
                sourceIdList.push(`${parentLogicExpression.condition_b_id}`);
            }

            let resultNodeId = `${logicExpressionDetailsJson.logic_expression_id}_resultA`;
            let resultNodeText = `${logicExpressionDetailsJson.result_a}`;
            if (logicExpressionDetailsJson.node_position_x !== 0) {
                if (resultNodeText === "true" && parentLogicExpression && parentLogicExpression.condition_a_id === logicExpressionDetailsJson.logic_expression_id) {
                    // TODO: this is where and conditions are combined and need to point to the same result node. This should point to condition B node instead of the result
                    // TODO: condition A and condition B come in reverse order currently MAYBE. It looks like condition B is on top and making an edge through condition A to result A
                    // this needs to be fixed to flip flop A and B functionality maybe?
                    console.log("I need to make an edge with 'True' as the text.")
                } else {
                    let result_node_y = logicExpressionDetailsJson.node_position_y
                    if (logicExpressionDetailsJson.condition_a || logicExpressionDetailsJson.condition_a_id) {
                        // This is currently handling formulas since they are just strings for now, but as they will change I didn't want to modify too drastically
                        // formulas currently only reside in result_a and b so they do not need to add the y iterator like we are doing below
                        result_node_y = logicExpressionDetailsJson.node_position_y + logicExpressionDetailsJson.node_y_iterator
                    }

                    if (resultNodeText !== "true" && resultNodeText !== "false") {
                        let resultNode = {    // flowchartmanager
                            id: resultNodeId,
                            type: "default",  // input (beginning) output (end) default (middle)
                            source: sourceIdList,   // what connects to it
                            target: targetIdList,  // what it is connecting to object {id: "resultNodeId"}
                            text: resultNodeText,  // what gets written inside
                            isWarning: logicExpressionDetailsJson.result_a_has_warning,
                            children: [],
                            position: {
                                x: logicExpressionDetailsJson.node_position_x, 
                                y: result_node_y
                            }
                        };
                        // conditionNode.target.push(resultNode.id);
                        // resultNode.source.push(conditionNode.id);
                        newNodesList.push(resultNode);
                    }
                }
                
            } else {

            }
            
        }
        if (logicExpressionDetailsJson.result_b != undefined) {
            let resultNodeId = `${logicExpressionDetailsJson.logic_expression_id}_resultB`;
            let resultNodeText = `${logicExpressionDetailsJson.result_b}`;
            if (logicExpressionDetailsJson.node_position_x !== 0) {
                let source = [`${logicExpressionDetailsJson.logic_expression_id}_resultA`];
                if (logicExpressionDetailsJson.condition_a || logicExpressionDetailsJson.condition_a_id) {
                    // This is currently handling formulas since they are just strings for now, but as they will change I didn't want to modify too drastically
                    // formulas currently only reside in result_a and b so they do not need to add the y iterator like we are doing below
                    source = [`${logicExpressionDetailsJson.logic_expression_id}`];
                } 

                if (resultNodeText !== "true" && resultNodeText !== "false") {
                    let resultNode = {
                        id: resultNodeId,
                        type: "output",
                        source: source,
                        target: [],
                        text: resultNodeText,
                        isWarning: logicExpressionDetailsJson.result_b_has_warning,
                        children: [],
                        position: {
                            x: logicExpressionDetailsJson.node_position_x + (logicExpressionDetailsJson.node_x_iterator / 2), 
                            y: logicExpressionDetailsJson.node_position_y
                        }
                    };
                    // conditionNode.target.push(resultNode.id);
                    // resultNode.source.push(conditionNode.id);
                    newNodesList.push(resultNode);
                }
            }
        }

        // Check if these nodes are children of a parent node
        let addNodesToHierarchy = true;
        // if (currentNodesHierarchy.current && parentLogicExpression) {
        //     let parentNode = currentNodesHierarchy.current.find(n => n.id == `${parentLogicExpression.logic_expression_id}`);
        //     if (parentNode && newNodesList.length > 0) {
        //         console.log("******************************* Parents with children!");
        //         parentNode.children.push(newNodesList);
        //         addNodesToHierarchy = false;
        //     }
        // }

        // // Create Nodes and Edges based on response
        // let yIncrease = 150;
        // let xIncrease = 150;
        // if (!xStart.current) xStart.current = 160;
        // let yStart = 10;
        // let newNodesList = [];

        // // Condition node
        // let conditionNodeId = `${logicExpressionDetailsJson.logic_expression_id}`;
        // let conditionNodeText = "";
        // if (logicExpressionDetailsJson.condition_a_variable_string) {
        //     conditionNodeText = `${logicExpressionDetailsJson.condition_a} {${logicExpressionDetailsJson.condition_a_variable_string}} ${logicExpressionDetailsJson.operator} ${logicExpressionDetailsJson.condition_b}`;
        // } else {
        //     conditionNodeText = `${logicExpressionDetailsJson.condition_a} ${logicExpressionDetailsJson.operator} ${logicExpressionDetailsJson.condition_b}`;
        // }
        // let conditionNodeType = "input";
        // let conditionNodePosition = {
        //     x: xStart.current,
        //     y: yStart
        // };
        // let conditionNode = {
        //     id: conditionNodeId,
        //     type: conditionNodeType,
        //     data: { label: conditionNodeText },
        //     position: conditionNodePosition,
        //     parentId: parentLogicExpression ? `${parentLogicExpression.logic_expression_id}` : undefined
        // };
        // newNodesList.push(conditionNode);

        // // Result nodes
        // if (logicExpressionDetailsJson.result_a != undefined) {
        //     let resultNodeId = `${logicExpressionDetailsJson.logic_expression_id}_resultA`;
        //     let resultNodeText = `${logicExpressionDetailsJson.result_a}`;
        //     let resultNodePosition = {
        //         x: xStart.current - xIncrease,
        //         y: yStart + yIncrease
        //     };
        //     let resultNode = {
        //         id: resultNodeId,
        //         type: "output",
        //         data: { label: resultNodeText },
        //         position: resultNodePosition,
        //         parentId: parentLogicExpression ? `${parentLogicExpression.logic_expression_id}` : undefined
        //     };
        //     newNodesList.push(resultNode);
        // }
        // if (logicExpressionDetailsJson.result_b != undefined) {
        //     let resultNodeId = `${logicExpressionDetailsJson.logic_expression_id}_resultB`;
        //     let resultNodeText = `${logicExpressionDetailsJson.result_b}`;
        //     let resultNodePosition = {
        //         x: xStart.current + xIncrease,
        //         y: yStart + yIncrease
        //     };
        //     let resultNode = {
        //         id: resultNodeId,
        //         type: "output",
        //         data: { label: resultNodeText },
        //         position: resultNodePosition,
        //         parentId: parentLogicExpression ? `${parentLogicExpression.logic_expression_id}` : undefined
        //     };
        //     newNodesList.push(resultNode);
        // }

        // Add to nodes state
        let hasNodesHierarchyUpdated = false;
        while (!hasNodesHierarchyUpdated) {
            // Check to see if there is a lock by one of the other async calls updating the nodesHierarchy state.
            if (!isNodesHierarchyUpdating.current) {
                hasNodesHierarchyUpdated = true;
                let newNodesState = [...currentNodesHierarchy.current];
                if (addNodesToHierarchy) newNodesState.push(...newNodesList);
                isNodesHierarchyUpdating.current = true;
                console.log("Inside If Check: ", isNodesHierarchyUpdating.current);
                props.SetNodesHierarchy(newNodesState);
            }
        }
        
        // xStart.current += (xIncrease * 4);

        // Condition A
        if (logicExpressionDetailsJson.condition_a_id !== null) {
            newLogicExpressionIdListConditionA.push(logicExpressionDetailsJson.condition_a_id);
            await getLogicExpressionDetails(conditionFormulaId, newLogicExpressionIdListConditionA, logicExpressionDetailsJson);
        }

        // Condition B
        if (logicExpressionDetailsJson.condition_b_id !== null) {
            newLogicExpressionIdListConditionB.push(logicExpressionDetailsJson.condition_b_id);
            await getLogicExpressionDetails(conditionFormulaId, newLogicExpressionIdListConditionB, logicExpressionDetailsJson);
        }

        // Result A
        if (logicExpressionDetailsJson.result_a_id !== null) {
            newLogicExpressionIdListResultA.push(logicExpressionDetailsJson.result_a_id);
            await getLogicExpressionDetails(conditionFormulaId, newLogicExpressionIdListResultA, logicExpressionDetailsJson);
        }

        // Result B
        if (logicExpressionDetailsJson.result_b_id !== null) {
            newLogicExpressionIdListResultB.push(logicExpressionDetailsJson.result_b_id);
            await getLogicExpressionDetails(conditionFormulaId, newLogicExpressionIdListResultB, logicExpressionDetailsJson);
        }

        // Following Condition Formulas
        if (logicExpressionDetailsJson.following_condition_formula_id !== null) {
            newLogicExpressionIdListFollowing.push(logicExpressionDetailsJson.following_condition_formula_id);
            await getLogicExpressionDetails(conditionFormulaId, newLogicExpressionIdListFollowing, logicExpressionDetailsJson);
        }
    }

    const processUserDirectedDecisionTree = async () => {

    }

    const handleSave = () => {
        if (fields.configurationtype === "manual" && contentView === 0) {
            if (fields.operationtype === "summary" || fields.operationtype === "timeline") {
                return setContentView(1);
            } else if (fields.operationtype === "flowchart") {
                return setContentView(2);
            }
        }

        if (fields.flowcharttype === "userDirectedDecisionTree" && contentView === 2) {
            return setContentView(3);
        }

        if (fields.operationtype === "flowchart" && fields.configurationtype === "default") {
            // Default configuration for flowchart. Full document without user direction.
            let documentIdList = [];
            let sentenceIdList = [];

            props.aioperation.row.forEach(doc => {
                documentIdList.push(doc.documentid);
            });
            processDecisionTree(documentIdList, sentenceIdList);
            props.SetModal("flowchart")(newFlowChartProps(true));
        } else {
            let glossarylookup = [];
            if (fields.category.includes("medical")) glossarylookup.push(1);
            if (fields.category.includes("wireless")) glossarylookup.push(2);
    
            const body = {
                name: fields.name,
                documenttype: props.aioperation.row[0].documenttype,
                parent: props.aioperation.row[0].parent_id,
                group: props.aioperation.row[0].group_id,
                description: fields.description,
                algorithmtype: getAlgorithmType(fields.operationtype),
                original_doc_id: props.aioperation.row.map(row => row.documentid),
                textdivisiontype: fields.summarizermethod,
                get_documentglossarylookup_set: glossarylookup,
                summary_ratio: fields.summaryratio,
            }
            props.ProcessAction(newAIOperationActionPayload(props.aioperation.row, body, fields.operationtype));    
        }
        
        setContentView(0);
        _handleFieldChange(initialFields);
        props.SetModal("aioperation")(newAiOperationModalProps(false, []));
    }

    const handleModalClose = () => {
        _handleFieldChange(initialFields);
        props.SetModal("aioperation")(newAiOperationModalProps(false, []));
    }

    //toggle button group

    const handleModalBack = () => {
        setContentView(0);
    }

    const renderContent = () => {
        // view 0
        if (contentView === 0) {
            return (
                <>
                    <div className={classes.formrow}>
                        <Tooltip disableFocusListener disableTouchListener title="Input the name for your new file">
                            <IconButton size="small"
                                        className={classes.helpericon}
                            >
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="ai-operation-name"
                            label="Name"
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={fields.name}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            autoComplete="off"
                        />
                    </div>
                    <div className={classes.formrow}>
                        <Tooltip disableFocusListener disableTouchListener title="Input the description for your new file">
                            <IconButton size="small"
                                        className={classes.helpericon}
                            >
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="ai-operaion-description"
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
                    </div>
                    <div className={classes.formrow}>
                        <Tooltip disableFocusListener disableTouchListener title="Select the type of ai operation to run">
                            <IconButton size="small"
                                        className={classes.helpericon}
                            >
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                        <FormControl component="fieldset">
                            <InputLabel>Operation</InputLabel>
                            <Select
                                labelId="operation-type"
                                id="operation-type"
                                open={open.operationtype}
                                onClose={() => setOpen("operationtype")(false)}
                                onOpen={() => setOpen("operationtype")(true)}
                                name="operationtype"
                                value={fields.operationtype}
                                onChange={handleFieldChange}
                                input={<Input />}
                            >
                                <MenuItem value="summary">Summary</MenuItem>
                                <MenuItem value="timeline">Timeline</MenuItem>
                                <MenuItem value="flowchart">Flow Chart</MenuItem>
                                <MenuItem value="generate test cases">Generate Test Cases</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {
                        fields.operationtype !== "" ? (
                            <div className={classes.formrow} style={marginTop}>
                                <Tooltip disableFocusListener disableTouchListener title="Select your default configuration or manually input the configuration">
                                    <IconButton size="small"
                                                className={classes.helpericon}
                                    >
                                        <HelpIcon />
                                    </IconButton>
                                </Tooltip>
                                <FormControl component="fieldset">
                                    <InputLabel>Configuration</InputLabel>
                                    <Select
                                        labelId="configuration-type"
                                        id="configuration-type"
                                        open={open.configurationtype}
                                        onClose={() => setOpen("configurationtype")(false)}
                                        onOpen={() => setOpen("configurationtype")(true)}
                                        name="configurationtype"
                                        value={fields.configurationtype}
                                        onChange={handleFieldChange}
                                    >
                                        <MenuItem value="default">Default</MenuItem>
                                        <MenuItem value="manual">Manual</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        ) : (null)
                    }
                </>
            );
        }
        // view 1
        else if (contentView === 1) {
            return (
                <>
                    <div className={classes.formrow}>
                        <Tooltip disableFocusListener disableTouchListener title="Prioritizes words from the selected dictionaries when summarizing">
                            <IconButton size="small"
                                        className={classes.helpericon}
                            >
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                        <FormControl component="fieldset">
                            <InputLabel>Dictionaries</InputLabel>
                            <Select
                                labelId="ai-dictionaries"
                                id="ai-dictionaries"
                                open={open.category}
                                onClose={() => setOpen("category")(false)}
                                onOpen={() => setOpen("category")(true)}
                                name="category"
                                value={fields.category}
                                renderValue={(selected) => selected.join(', ')}
                                onChange={handleFieldChange}
                                multiple
                            >
                                <MenuItem value="medical" style={verticalPadding}>
                                    <Checkbox checked={fields.category.indexOf("medical") > -1} />
                                    <ListItemText primary="Medical" />
                                </MenuItem>
                                <MenuItem value="wireless" style={verticalPadding}>
                                    <Checkbox checked={fields.category.indexOf("wireless") > -1} />
                                    <ListItemText primary="Wireless" />
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={classes.formrow} style={marginTopHalf}>
                        <Tooltip disableFocusListener disableTouchListener title="Percentage of the original document kept">
                            <IconButton size="small"
                                        className={classes.helpericon}
                            >
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="caption" className="MuiFormLabel" gutterBottom>
                            Summary Length
                        </Typography>
                        <Slider
                            value={fields.summaryratio}
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
                    <div className={classes.formrow} style={marginTopHalf}>
                        <Tooltip disableFocusListener disableTouchListener title="Method for dividing the text">
                            <IconButton size="small"
                                        className={classes.helpericon}
                            >
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                        <FormControl component="fieldset">
                            <InputLabel>Summarizer Method</InputLabel>
                            <Select
                                labelId="summarizer-method"
                                id="summarizer-method"
                                open={open.summarizermethod}
                                onClose={() => setOpen("summarizermethod")(false)}
                                onOpen={() => setOpen("summarizermethod")(true)}
                                name="summarizermethod"
                                value={fields.summarizermethod}
                                onChange={handleFieldChange}
                            >
                                <MenuItem value={1} style={verticalPadding}>
                                    <ListItemText primary="Summary for the entire document selection" />
                                </MenuItem>
                                <MenuItem value={2} style={verticalPadding}>
                                    <ListItemText primary="Summary for each section" />
                                </MenuItem>
                                <MenuItem value={3} style={verticalPadding}>
                                    <ListItemText primary="Summary for each paragraph" />
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </>
            );
        }
        // view 2 (flow chart)
        else if (contentView === 2) {
            return (
                <>
                    <div className={classes.formrow} style={marginTop}>
                        <Tooltip disableFocusListener disableTouchListener title="Select User Directed Decision Tree to find a path through the decision tree based on additional information">
                            <IconButton size="small"
                                        className={classes.helpericon}
                            >
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                        <FormControl component="fieldset">
                            <InputLabel>Chart Type</InputLabel>
                            <Select
                                labelId="flowchart-type"
                                id="flowchart-type"
                                open={open.flowcharttype}
                                onClose={() => setOpen("flowcharttype")(false)}
                                onOpen={() => setOpen("flowcharttype")(true)}
                                name="flowcharttype"
                                value={fields.flowcharttype}
                                onChange={handleFieldChange}
                            >
                                <MenuItem value="decisionTree">Decision Tree</MenuItem>
                                <MenuItem value="userDirectedDecisionTree">User Directed Decision Tree</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={classes.formrow}>
                        <Tooltip disableFocusListener disableTouchListener title="Input the name for your new file">
                            <IconButton size="small"
                                        className={classes.helpericon}
                            >
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="flowchart-filter"
                            label="Filter"
                            type="text"
                            placeholder=""
                            name="flowChartFilter"
                            value={flowChartFilter}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleFlowChartFilterChange}
                            fullWidth
                            autoComplete="off"
                        />
                    </div>
                    {
                        flowChartFilterSuggestions.length > 0 ?
                        <Paper className={classes.suggestionsList} elevation={3} >
                            {flowChartFilterSuggestions.map((suggestion, i) => {
                                return (
                                    <MenuItem key={i} onClick={() => handleAddFlowChartFilterChoice(suggestion)}>{ suggestion.word }</MenuItem>
                                );
                            })}
                        </Paper> : (null)
                    }
                    <Paper className={classes.choicesList} >
                        <List dense>
                            {
                                flowChartFilterChoices.map((choice, i) => {
                                    return(
                                        <ListItem key={i}>
                                            <IconButton size="small" onClick={() => handleDeleteFlowChartFilterChoice(choice)}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <ListItemText className={classes.choiceItemText} primary={ choice.word } />
                                        </ListItem>
                                    );
                                })
                            }
                        </List>
                    </Paper>
                </>
            );
        }
        // view 3 (user input variable/value form)
        else if (contentView === 3) {
            return (
                <>
                    <div className={classes.formrow} style={marginTop}>
                        This will be a dynamic form for the user to fill out.
                    </div>
                </>
            );
        }
    }

    const renderActions = () => {
        return (
            <>
                {contentView === 0 ? (
                    <Fade in={contentView === 0}>
                        <>
                            <Button onClick={handleModalClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSave}
                                    color="primary"
                                    variant="contained"
                                    disabled={(fields.operationtype === "" || fields.configurationtype === "")}
                            >
                                {
                                    fields.configurationtype === "manual" ?
                                        ("Next") : ("Process")
                                }
                            </Button>
                        </>
                    </Fade>
                ) : (null)}
                {contentView === 1 ? (
                    <Fade in={contentView === 1}>
                        <>
                            <Button onClick={handleModalBack} color="primary">
                                Back
                            </Button>
                            <Button onClick={handleSave}
                                    color="primary"
                                    variant="contained"
                                    disabled={(fields.operationtype === "" || fields.configurationtype === "")}
                            >
                                Process
                            </Button>
                        </>
                    </Fade>
                ) : (null)}
                {contentView === 2 ? (
                    <Fade in={contentView === 2}>
                        <>
                            <Button onClick={handleModalBack} color="primary">
                                Back
                            </Button>
                            <Button onClick={handleSave}
                                color="primary"
                                variant="contained"
                                disabled={(fields.flowcharttype === "")}
                            >
                                {
                                    fields.flowcharttype === "userDirectedDecisionTree" ?
                                        ("Next") : ("Process")
                                }
                            </Button>
                        </>
                    </Fade>
                ) : (null)}
            </>
        );
    }

    return (
        <Dialog
            open={props.aioperation.bool}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleModalClose}
            onChange={handleFieldChange}
            aria-labelledby="ai-operation-dialog"
            aria-describedby="ai operation"
            ref={modalRef}
        >
            <DialogTitle id="create-case-dialog-title">
                AI Operation
            </DialogTitle>
            <DialogContent style={{overflowX: "hidden"}}>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                {renderActions()}
            </DialogActions>
        </Dialog>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AIOperationModal);
