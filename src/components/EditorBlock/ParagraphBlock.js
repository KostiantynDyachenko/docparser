import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import SentenceBlock from "./SentenceBlock";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "calc(100% - 128px)",
        height: "auto",
        margin: "0 64px",
        boxSizing: "border-box"

    },
    content: {
        width: "100%",
        height: "auto",
        fontSize: "14px",
        padding: "0.4em 0",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
        position: "relative"
    },
    timeline: {
        fontWeight: 600,
        fontSize: "16px",
    }
}));

function ParagraphBlock(props) {
    const classes = useStyles(props);

    const renderSentences = (sentence_list) => {
        return sentence_list.map((sentence, index) => {
            return <SentenceBlock data={sentence}
                                  setSentenceRef={props?.setSentenceRef}
                                  setWordRef={props?.setWordRef}
                                  key={`sentence_block_${index}`}
                                  selected={props.current_sentence_mouse_hover === sentence.sentence_id}
            />;
        });
    }

    const render = props?.sentences ? renderSentences(props.sentences) : props.children;
    const setParagraphRef = (props.setParagraphRef && typeof props.setParagraphRef === 'function') ? props.setParagraphRef(props.data) : null;
    return (
        <div className={classes.root}
             ref={setParagraphRef}>
            <div className={classes.content}>
                {
                    props?.data?.time_line_header ? (
                        <div className={classes.timeline}>
                            { props.data.time_line_header }
                        </div>
                    ) : (null)
                }
                { render }
            </div>
        </div>
    );
}

export default connect(null, null, null, { forwardRef: true })(ParagraphBlock);
