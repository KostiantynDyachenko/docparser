import CsvIcon from "../Svg/CsvIcon";
import SvgFolder from "../Svg/SvgFolder";
import DocIcon from "../Svg/DocIcon";
import SvgPdf from "../Svg/SvgPdf";


export function getDocumentIcon(documenttype) {
    let Icon, type;
    switch (documenttype) {
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
    return [Icon, type];
}
