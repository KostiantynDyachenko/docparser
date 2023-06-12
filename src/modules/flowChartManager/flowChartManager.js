const SET_NODES_HIERARCHY = "SET_NODES_HIERARCHY";
const SET_CURRENT_NODES = "SET_CURRENT_NODES";
const SET_EDGES = "SET_EDGES";

export function SetNodesHierarchy(nodes) {
    console.log("SetNodesHierarchy: ", nodes);
    return {
        type: SET_NODES_HIERARCHY,
        payload: {
            nodes: nodes
        }
    }
}

export function SetCurrentNodes(nodes) {
    return {
        type: SET_CURRENT_NODES,
        payload: {
            nodes: nodes
        }
    }
}

export function SetEdges(edges) {
    return {
        type: SET_EDGES,
        payload: {
            edges: edges
        }
    }
}

const initialState = {
    nodesHierarchy: [], // Hierarchy for all nodes
    currentNodes: [], // Flowchart nodes
    edges: []  // Connection lines between nodes
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_NODES_HIERARCHY: {
            return Object.assign({}, state, {
                nodesHierarchy: action.payload.nodes
            });
        }
        case SET_CURRENT_NODES: {
            return Object.assign({}, state, {
                currentNodes: action.payload.nodes
            });
        }
        case SET_EDGES: {
            return Object.assign({}, state, {
                edges: action.payload.edges
            });
        }
        default: {
            return state;
        }
    }
}