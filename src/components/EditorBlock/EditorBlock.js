import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import HeaderBlock from "./HeaderBlock";
import ParagraphBlock from "./ParagraphBlock";

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100%",
        overflow: "auto",
    }
}));

function EditorBlock(props) {
    const classes = useStyles(props);

    const data = props?.data || [];

    const ref = props?.setDocRef || null;

    return (
        <div className={classes.root} ref={ref}>
            {
                data.map((row, index) => {
                    return row.type === "header" ?
                        <HeaderBlock data={row.data} text={row.data.text} key={`header_block_${index}`} /> :
                        <ParagraphBlock data={row.data}
                                        sentences={row.data.summary_sentence_list}
                                        key={`paragraph_block_${index}`}
                                        setParagraphRef={props?.setParagraphRef}
                                        setSentenceRef={props?.setSentenceRef}
                                        setWordRef={props?.setWordRef}
                        />
                })
            }
        </div>
    );
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(EditorBlock);
