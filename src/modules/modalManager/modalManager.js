import newCreateModalProps from "../../components/NewProps/newCreateModalProps";
import newEditModalProps from "../../components/NewProps/newEditModalProps";
import newMoveModalProps from "../../components/NewProps/newMoveModalProps";
import newCopyModalProps from "../../components/NewProps/newCopyModalProps";
import newAiOperationModalProps from "../../components/NewProps/newAiOperationModalProps";
import newUploadModalProps from "../../components/NewProps/newUploadModalProps";
import newFlowChartProps from "../../components/NewProps/newFlowChartProps";

const SET_MODAL = 'SET_MODAL';

export function SetModal(name) {
    return (props) => {
        return {
            type: SET_MODAL,
            payload: {
                name: name,
                props: props
            }
        }
    }
}

const initialState = {
    create: newCreateModalProps(false),
    edit: newEditModalProps(false, null),
    move: newMoveModalProps(false, []),
    copy: newCopyModalProps(false, null),
    aioperation: newAiOperationModalProps(false, []),
    upload: newUploadModalProps(false, []),
    flowchart: newFlowChartProps(false)
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_MODAL: {
            return Object.assign({}, state, {
                [action.payload.name]: action.payload.props
            });
        }
        default: {
            return state;
        }
    }
}
