// grabs file type from the file name; example: document_name.docx returns docx
export function getFileTypeFromName(name) {
    const strings = name.split(".");
    return strings[strings.length - 1];
}
