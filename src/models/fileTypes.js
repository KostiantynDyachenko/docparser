import { deepOrange, blue, red } from "@material-ui/core/colors";

const colors = {
    red: red["800"],
    blue: blue["700"],
    orange: deepOrange["700"]
}

export const fileTypes = [
    {
        filetype: "doc",
        color: colors.blue
    },{
        filetype: "docx",
        color: colors.blue
    },{
        filetype: "odt",
        color: colors.blue
    },{
        filetype: "txt",
        color: colors.blue
    },{
        filetype: "pdf",
        color: colors.red
    },{
        filetype: "ppt",
        color: colors.orange
    },{
        filetype: "pptx",
        color: colors.orange
    }
];