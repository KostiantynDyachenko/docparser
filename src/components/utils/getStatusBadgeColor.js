import { green, lightBlue, yellow, red } from "@material-ui/core/colors";

function getStatusBadgeColor(status) {
    switch (status) {
        case "uploading":
            return lightBlue["600"];
        case "processing":
            return yellow["600"];
        case "failed":
            return red["600"];
        case "complete":
        default:
            return green["600"];
    }
}

export { getStatusBadgeColor };