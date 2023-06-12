import DocIcon from "../Svg/DocIcon";
import CsvIcon from "../Svg/CsvIcon";
import XmlIcon from "../Svg/XmlIcon";
import SvgFolder from "../Svg/SvgFolder";
import React from "react";

const getFileTypeIcon = (filetype) => {
    switch (filetype) {
        case 1: {
            return DocIcon;
        }
        case 2: {
            return CsvIcon;
        }
        case 3: {
            return XmlIcon;
        }
        case 0:
        case 4: {
            return SvgFolder;
        }
        default: {
            return <></>
        }
    }
}

export { getFileTypeIcon };
