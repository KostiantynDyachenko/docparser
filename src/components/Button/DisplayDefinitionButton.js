import React, { memo, useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import DefinitionSvg from "../Svg/DefinitionSvg";
import IconButton from "@material-ui/core/IconButton";

const mapStateToProps = (state) => {
    return {
        current_word_mouse_hover: state.eventManager.current_word_mouse_hover,
    }
}

const useStyles = makeStyles(() => ({
    root: {
        position: "absolute",
        background: "#fff",
        border: "1px solid #000",
        padding: "4px 2px",
        zIndex: "100",
        "& .MuiIconButton-label": {
            background: "#fff",
            borderRadius: "50%"
        }
    }
}));

function DisplayDefinitionButton(props) {
    const classes = useStyles(props);
    const [word, setWord] = useState(false);
    const timeoutref = useRef(null);

    useEffect(() => {
        console.log("useEffect");
        // word exists update word
        if (props.current_word_mouse_hover && props.word_list && Array.isArray(props.word_list) && props.word_list.length > 0) {
            let _word = props.word_list.find(w => w.phrase_id === props.current_word_mouse_hover);
            if (_word && _word.phrase_type_str === "dictionary" && !!_word.ref) {
                setWord(_word);
                if (timeoutref) {
                    clearTimeout(timeoutref);
                    timeoutref.current = null;
                }
            }
        }
        // word changed remove word
        if (!!word && !props.current_word_mouse_hover) {
            timeoutref.current = setTimeout(() => {
                setWord(null);
                timeoutref.current = null;
            }, 1000);
        }
    }, [props.current_word_mouse_hover]);

    if (word && !!word.ref) {
        let ref = word.ref;
        let top = ref.parentElement.offsetTop + ref.offsetHeight + props.containerRef.offsetTop - props.containerRef.scrollTop;
        let left = ref.offsetLeft + ref.offsetWidth + props.containerRef.offsetLeft;
        return (
            <IconButton size="small" className={classes.root} style={{ top: top + 65, left: left + 40 }} onClick={() => props?.displayDefinition(word, { x: left, y: top + 100 })}>
                <DefinitionSvg />
            </IconButton>
        );
    }
    else return (null);
}

const check = (prev, next) => {
    return !(!!next.current_word_mouse_hover || !!prev.current_word_mouse_hover);
}

DisplayDefinitionButton.propTypes = {
    word_list: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(memo(DisplayDefinitionButton, check));
