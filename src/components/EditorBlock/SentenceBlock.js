import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import WordBlock from "./WordBlock";
import { SentenceBlockMouseOver, SentenceBlockMouseOut } from "../../modules/eventManager/eventManager";
import {connect} from "react-redux";

const mapDispatchToProps = (dispatch) => {
    return {
        SentenceBlockMouseOver: sentence_id => dispatch(SentenceBlockMouseOver(sentence_id)),
        SentenceBlockMouseOut: () => dispatch(SentenceBlockMouseOut()),
    }
}

const mapStateToProps = (state) => {
    return {
        //current_word_mouse_hover: state.eventManager.current_word_mouse_hover,
        current_sentence_mouse_hover: state.eventManager.current_sentence_mouse_hover,
    }
}

const useStyles = makeStyles((theme) => ({
    root: {},
    hover: {
        background: "rgba(245, 235, 111, 0.29)"
    }
}));

function SentenceBlock(props) {
    const classes = useStyles(props);

    const onMouseOver = () => {
        props.SentenceBlockMouseOver(+props.data.sentence_id)
    }

    const onMouseOut = () => {
        props.SentenceBlockMouseOut();
    }

    const elements = props.data?.elements ?? [];
    const setSentenceRef = (props.setSentenceRef && typeof props.setSentenceRef === 'function') ? props.setSentenceRef(props.data) : null;
    return (
        <span className={`${classes.root} ${props.current_sentence_mouse_hover === props?.data?.sentence_id ? classes.hover : ""}`}
              contentEditable
              suppressContentEditableWarning={true}
              onMouseEnter={onMouseOver}
              onMouseLeave={onMouseOut}
              ref={setSentenceRef}
        >
            {
                elements.map((element, index) => {
                    let el;
                    if (typeof element === 'string') {
                        el = element;
                    }
                    else if (typeof element === 'object') {
                        el = (
                            <WordBlock data={element}
                                       setWordRef={props?.setWordRef}
                            />
                        );
                    }
                    else {
                        el = null;
                    }
                    return <React.Fragment key={`sentence_block_${index}`}>
                        {el} {" "}
                    </React.Fragment>
                })
            }
        </span>
    );
}

function check(prev, next) {
    if (next.current_sentence_mouse_hover === next.data.sentence_id || prev.current_sentence_mouse_hover === prev.data.sentence_id) {
        let prevnextidcheck = prev.current_sentence_mouse_hover !== next.current_sentence_mouse_hover;
        let idmatch = next.current_sentence_mouse_hover === next.data.sentence_id;
        let check = !(prevnextidcheck && idmatch);
        let previdmatch = prev.current_sentence_mouse_hover === prev.data.sentence_id;
        let revertcheck = !(prevnextidcheck && previdmatch);
        let finalcheck = (check && revertcheck);
        return finalcheck;
    }
    else return true;
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(SentenceBlock, check));
