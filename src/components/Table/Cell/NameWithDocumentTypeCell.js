import * as React from "react";
import CsvIcon from "../../Svg/CsvIcon";
import SvgFolder from "../../Svg/SvgFolder";
import DocIcon from "../../Svg/DocIcon";
import SvgPdf from "../../Svg/SvgPdf";
import {makeStyles} from "@material-ui/styles";


const useStyles = makeStyles(theme => ({
    algorithmBadge: {
        fontSize: "9.5px",
        fontWeight: "600",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        marginLeft: "8px",
        border: "1px solid #000",
        padding: "2px 6px",
        borderRadius: "6px",
        color: "#000"
    },
    noClick: {
        pointerEvents: "none"
    }
}));

const NameWithDocumentTypeCell = (props) => {
    const classes = useStyles(props);
    let type, Icon, badge;
    switch (props.dataItem.documenttype) {
        case 1: {
            type = "docx";
            Icon = DocIcon;
            break;
        }
        case 2: {
            type = "csv";
            Icon = CsvIcon;
            break;
        }
        case 3: {
            type = "pdf";
            Icon = SvgPdf;
            break;
        }
        case 0:
        case 4: {
            type = "folder";
            Icon = SvgFolder;
            break;
        }
    }
    if (props.dataItem.algorithmtype > 1) {
        let backgroundColor, color;
        switch (props.dataItem.algorithmtype) {
            default: {
                backgroundColor = "rgba(0, 0, 0, 0.35";
                color = "#000";
                break;
            }
            case 2: {
                backgroundColor = "rgba(205, 0, 0, 0.7";
                color = "#fff";
                break;
            }
            case 3: {
                backgroundColor = "rgba(0, 205, 0, 0.7";
                color = "#000";
                break;
            }
            case 4: {
                backgroundColor = "rgba(0, 0, 205, 0.7";
                color = "#fff";
                break;
            }
        }
        badge = (
            <div className={`${classes.algorithmBadge} ${classes.noClick}`} style={{backgroundColor: backgroundColor, color: color}}>
                {props.dataItem?.algorithmtypestr}
            </div>
        );
    }
    return (
        <td style={{ display: "flex", alignItems: "center" }}>
            <Icon className={classes.noClick} style={{width: "40px", height: "40px", marginRight: "6px"}} /> {props.dataItem.name} {badge ?? null}
        </td>
    );
}

export default NameWithDocumentTypeCell;
