import { useState, useEffect } from 'react';
import ReactFlow, { MarkerType, MiniMap } from 'react-flow-renderer';
import {connect} from "react-redux";
import { SetCurrentNodes, SetEdges } from "../../modules/flowChartManager/flowChartManager";

const initialNodes = [
    {
        id: '1',
        type: 'input', // Node connection set to input
        data: { label: 'Input Node' }, // Text within node
        position: { x: 250, y: 25 } // Position of node in chart
    },
    {
        id: '2',
        type: 'default', // Node connection set to input and output
        data: { label: <div>Default Node</div> }, // Component within node
        position: { x: 100, y: 125 }, // Position of node in chart
        style: {
            width: 175,
            height: 175
        }
    },
    //Children
    {
        id: '2a',
        type: 'input',
        data: { label: 'Child 1' },
        position: { x: 10, y: 10 },
        parentNode: '2'
    },
    {
        id: '2b',
        type: 'output',
        data: { label: 'Child 2' },
        position: { x: 10, y: 100 },
        parentNode: '2'
    },
    {
        id: '3',
        type: 'output', // Node connection set to output
        data: { label: 'Output Node' }, // Text within node
        position: { x: 250, y: 350 } // Position of node in chart
    },
    {
        id: '4',
        type: 'output',
        data: { label: 'Output 1' },
        position: { x: 350, y: 125 }
    },
    {
        id: '5',
        type: 'output',
        data: { label: 'Output 2' },
        position: { x: 50, y: 350 }
    }
];

const initialEdges = [
    {
        id: 'e1-2', // String id
        type: 'step', // Connecting line type: 'bezier', 'step', 'smoothstep', 'straight', 
        source: '1', // Id of node the connecting line starts from
        target: '2', // Id of node the connecting line goes to
        animated: true,
        markerEnd: {
            type: MarkerType.ArrowClosed
        },
        style: { stroke: 'green' },
        label: 'True'
    },
    {
        id: 'e2-3',
        type: 'step',
        source: '2',
        target: '3',
        animated: true, // Marching ants animation
        markerEnd: {
            type: MarkerType.ArrowClosed
        },
        style: { stroke: 'red' },
        label: 'False'
    },
    {
        id: 'e1-4',
        type: 'step',
        source: '1',
        target: '4',
        markerEnd: {
            type: MarkerType.ArrowClosed
        },
        label: 'False'
    },
    {
        id: 'e2-5',
        type: 'step',
        source: '2',
        target: '5',
        markerEnd: {
            type: MarkerType.ArrowClosed
        },
        label: 'False'
    },
    {
        id: 'e2a-2b',
        type: 'step',
        source: '2a',
        target: '2b', 
        markerEnd: {
            type: MarkerType.ArrowClosed
        }
    }
];

const mapStateToProps = (state) => {
    return {
        nodesHierarchy: state.flowChartManager.nodesHierarchy,
        currentNodes: state.flowChartManager.currentNodes,
        edges: state.flowChartManager.edges
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        SetCurrentNodes: nodes => dispatch(SetCurrentNodes(nodes)),
        SetEdges: edges => dispatch(SetEdges(edges))
    }
}

function FlowChart(props) {

    useEffect(() => {
        // Set nodes and edges from nodesHierarchy
        let currentNodesList = [];
        let edgesList = [];
        let sourceNode, targetNode;
        let longestTextLength = 0;

        // Create start node
        let isStartNode = true;
        let startNode = {
            id: "startNode",
            type: "input",
            data: { label: "Start" }
        };

        // Create end node
        let endNode = {
            id: "endNode",
            type: "output",
            data: { label: "End" }
        };

        props.nodesHierarchy.forEach(nodeHierarchy => {
            // Nodes
            let nodeText;
            if (nodeHierarchy.children.length > 0) {
                // Node has children. Combine texts of children and operator to get full subcondition text.
                nodeText = "";
                nodeHierarchy.children.forEach(child => {
                    if (nodeText == "") {
                        nodeText = child[0].text; // Using child[0] as it is the condition node of the list
                    } else {
                        nodeText = `${nodeText} ${nodeHierarchy.text} ${child[0].text}`;
                    }
                });
            } else {
                nodeText = nodeHierarchy.text;
            }
            if (nodeText.length > longestTextLength) {
                longestTextLength = nodeText.length;
            }
            let node = {
                id: nodeHierarchy.id,
                type: nodeHierarchy.type,
                targetPosition: nodeHierarchy.type == "output" ? "left" : "top",
                data: { label: nodeText },
                position: nodeHierarchy.position,
                isWarning: nodeHierarchy.isWarning
            };

            // Check if this is the first node to determine where the startNode should be placed
            // if (isStartNode) {
            //     let startNodePos = {...nodeHierarchy.position};
            //     startNodePos.y = 0;
            //     startNode.position = startNodePos;
            //     currentNodesList.push(startNode);
            // }

            currentNodesList.push(node);

            // Add start edge if needed
            // if (isStartNode) {
            //     let startEdge = {
            //         id: `eStart-${nodeHierarchy.id}`,
            //         type: 'step',
            //         source: "startNode",
            //         target: `${nodeHierarchy.id}`,
            //         animated: false,
            //         markerEnd: {
            //             type: MarkerType.ArrowClosed
            //         },
            //         style: { stroke: 'orange' }
            //     };
            //     edgesList.push(startEdge);
            //     isStartNode = false;
            // }

            // Edges
            // **************************** TODO: ERIC - For formulas, we are creating an edge linking a node that doesn't exist (i.e e372-372_resultA) to result a. This causes no Start node to be created. Fix it!
            if (nodeHierarchy.source.length > 0) {
                nodeHierarchy.source.forEach(source => {
                    let label = '';
                    // if (nodeHierarchy.text === "true" || nodeHierarchy.text === "false") {
                    //     label = nodeHierarchy.text
                    // }
                    // console.log("nodeHierarchy id: ", nodeHierarchy.id)
                    if (nodeHierarchy.id.indexOf("resultB") != -1) {
                        label = "False";
                        // console.log("False");
                    } else {
                        label = "True"
                    }
                    let edge = {
                        id: `e${source}-${nodeHierarchy.id}`, // String id
                        type: 'step', // Connecting line type: 'bezier', 'step', 'smoothstep', 'straight', 
                        source: `${source}`, // Id of node the connecting line starts from
                        target: `${nodeHierarchy.id}`, // Id of node the connecting line goes to
                        animated: false,
                        markerEnd: {
                            type: MarkerType.ArrowClosed
                        },
                        style: { stroke: 'orange' },
                        label: label
                    };
                    edgesList.push(edge);
                });
            }
            if (nodeHierarchy.target.length > 0) {
                nodeHierarchy.target.forEach(target => {
                    let label = '';
                    // console.log("target: ", target)
                    if (target.indexOf("resultB") != -1) {
                        label = "False";
                        // console.log("False");
                    } else {
                        label = "True"
                    }
                    // if (nodeHierarchy.text === "true" || nodeHierarchy.text === "false") {
                    //     label = nodeHierarchy.text;
                    // }
                    let edge = {
                        id: `e${nodeHierarchy.id}-${target}`, // String id
                        type: 'step', // Connecting line type: 'bezier', 'step', 'smoothstep', 'straight', 
                        source: `${nodeHierarchy.id}`, // Id of node the connecting line starts from
                        target: `${target}`, // Id of node the connecting line goes to
                        animated: false,
                        markerEnd: {
                            type: MarkerType.ArrowClosed
                        },
                        style: { stroke: 'orange' },
                        label: label
                    };
                    edgesList.push(edge);
                });
            }
        });

        // ****************** TODO: Complete Start and End Nodes ******************************************
        // let endNodeId = 1;
        // let startNodeId = 1;
        // let startAndEndNodesList = [];
    
        currentNodesList.forEach(node => {
            let labelText = node.data.label;
            // node.style = {...nodeStyle};
            let borderColor = "";
            let backgroundColor = "";

            if (labelText === "Failure" || labelText === "False" || labelText === "false") {
                borderColor = "Red";
                backgroundColor = "#f5b5b5";
            } else if (labelText === "Start" || labelText === "End") {
                borderColor = "Black";
                backgroundColor = "White";
            } else if (node.isWarning) {
                borderColor = "#999720";
                backgroundColor = "#f7f09e";
            } else {
                borderColor = "Green";
                backgroundColor = "#b7f5b5";
            }


            let nodeStyle = {
                width: 400,
                borderColor: borderColor,
                backgroundColor: backgroundColor
            };
            node.style = nodeStyle;

            // Create Start and End nodes dynamically
            // If no edge has this node id as a source, it needs an End Node added to it
        //     let sourceEdge = edgesList.find(e => e.source === node.id);
        //     if (!sourceEdge && node.type == "default") {
        //         let newEndNode = {...endNode};
        //         let newPosY = node.position.y + 100;
        //         newEndNode.id = "endNode" + endNodeId;
        //         newEndNode.position = {
        //             x: node.position.x,
        //             y: newPosY
        //         };
        //         startAndEndNodesList.push(newEndNode);

        //         // Add end edge to end node
        //         let newEndEdge = {
        //             id: `e${node.id}-${newEndNode.id}`,
        //             type: 'step',
        //             source: node.id,
        //             target: newEndNode.id,
        //             animated: false,
        //             markerEnd: {
        //                 type: MarkerType.ArrowClosed
        //             },
        //             style: { stroke: 'orange' }
        //         };
        //         edgesList.push(newEndEdge);

        //         endNodeId++;
        //     }

        //     // If no edge has this node id as a target, it needs a Start Node added to it
        //     let targetEdge = edgesList.find(e => e.target === node.id);
        //     if (!targetEdge && node.type == "default") {
        //         let newStartNode = {...startNode};
        //         let newPosY = node.position.y - 100;
        //         newStartNode.id = "startNode" + startNodeId;
        //         newStartNode.position = {
        //             x: node.position.x,
        //             y: newPosY
        //         };
        //         startAndEndNodesList.push(newStartNode);

        //         // Add start edge to start node
        //         let newStartEdge = {
        //             id: `e${newStartNode.id}-${node.id}`,
        //             type: 'step',
        //             source: newStartNode.id,
        //             target: node.id,
        //             animated: false,
        //             markerEnd: {
        //                 type: MarkerType.ArrowClosed
        //             },
        //             style: { stroke: 'orange' }
        //         };
        //         edgesList.push(newStartEdge);

        //         startNodeId++;
        //     }
        });

        // currentNodesList = currentNodesList.concat(startAndEndNodesList);
        //************************************************************************************************ */

        // console.log("currentNodesList", currentNodesList);
        // console.log("edgesList", edgesList);
        props.SetCurrentNodes(currentNodesList);
        props.SetEdges(edgesList);
    }, [props.nodesHierarchy]);

    const nodeColor = (node) => {
        switch (node.type) {
            case 'input':
                return '#6ede87';
            case 'output':
                return '#6865A5';
            default:
                return '#ff0072';
        }
    };

    return (
        <ReactFlow nodes={ props.currentNodes } edges={ props.edges } /*nodesDraggable={ false }*/ fitView >
            <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
        // <ReactFlow nodes={ initialNodes } edges={ initialEdges } nodesDraggable={ false } fitView />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowChart);