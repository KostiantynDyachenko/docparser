import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getPhraseColor } from "../utils/getPhraseColor";
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { WordBlockMouseOver, WordBlockMouseOut } from "../../modules/eventManager/eventManager";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
    return {
        WordBlockMouseOver: phrase_id => dispatch(WordBlockMouseOver(phrase_id)),
        WordBlockMouseOut: () => dispatch(WordBlockMouseOut())
    }
}

const mapStateToProps = (state) => {
    return {
        current_word_mouse_hover: state.eventManager.current_word_mouse_hover,
    }
}

const useStyles = makeStyles((theme) => ({
    root: props => {
        const color = getPhraseColor(props.data?.phrase_type_str);
        if (color) return {
            color: color,
            borderBottom: `2px solid ${color}`
        };
        else return {}
    },
    hover: props => {
        const color = getPhraseColor(props.data?.phrase_type_str);
        if (color) return {
            background: lighten(color, 0.7),
        };
        else return {}
    },
    definitionButton: {
        position: "absolute",
        left: "5px",
        background: "#fff",
        border: "1px solid #000",
        padding: "4px 2px"
    }
}));

function WordBlock(props) {
    const classes = useStyles(props);

    const onMouseOver = () => {
        props.WordBlockMouseOver(props?.data?.phrase_id)
    }

    const onMouseOut = () => {
        props.WordBlockMouseOut();
    }

    const setWordRef = (props.setWordRef && typeof props.setWordRef === 'function') ? props.setWordRef(props.data) : null;
    return (
        <span className={`${classes.root} ${props.current_word_mouse_hover === props?.data?.phrase_id ? classes.hover : ""}`}
              onMouseEnter={onMouseOver}
              onMouseLeave={onMouseOut}
              ref={setWordRef}
        >
            {
                props.data.text
            }
        </span>
    );
}

function check(prev, next) {
    if (next.current_word_mouse_hover === next.data.phrase_id || prev.current_word_mouse_hover === prev.data.phrase_id) {
        let prevnextidcheck = prev.current_word_mouse_hover !== next.current_word_mouse_hover;
        let idmatch = next.current_word_mouse_hover === next.data.phrase_id;
        let check = !(prevnextidcheck && idmatch);
        let previdmatch = prev.current_word_mouse_hover === prev.data.phrase_id;
        let revertcheck = !(prevnextidcheck && previdmatch);
        let finalcheck = (check && revertcheck);
        return finalcheck;
    }
    else return true;
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(WordBlock, check));
