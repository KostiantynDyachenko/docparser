import { fileTypes } from "../../models/fileTypes";

export function getFiletypeColor(type) {
    const filetype = fileTypes.find(ft => ft.filetype === type);
    return filetype?.color;
}