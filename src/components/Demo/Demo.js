import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { rootContainerFullWithTheme, rootContainerWithTheme } from "../styles/styles";
import Nav from "../Nav/Nav";
import Dropzone from "../Dropzone/DropZone";
import FileUploadCards from "./FileUploadCards";
import FileModal from "../Modal/FileModal";

const styles = (theme) => ({
    root: { ...rootContainerFullWithTheme(theme) },
    content: {
        ...rootContainerWithTheme(theme)
    },
    container: {
        height: "auto",
        maxHeight: "calc(100% - 36px)",
        width: "calc(100% - 80px)",
        margin: "18px 36px",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.background.paper,
        borderRadius: "8px",
        boxShadow: theme.shadows[2],
        "& h2": {
            margin: "16px 16px 0"
        }
    },
    dropzone: {
        height: "332px",
        width: "calc(100% - 32px)",
        display: "flex",
        flexDirection: "column",
        margin: "0 16px 16px"
    },
    filezone: {
        height: "auto",
        maxHeight: "calc(100% - 364px)",
        padding: "8px 16px",
        overflow: "auto"
    }
});

export class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            displayFile: false,
            selectedFile: -1
        }
        this.fileTimer = null;
    }

    getDisplayFile = () => {
        const file = this.state.files[this.state.selectedFile];
        return file ?? {};
    }

    setDisplayFile = (index) => {
        this.setState({
            displayFile: (index !== -1),
            selectedFile: index
        });
    }

    stopFile = (index) => {
        this.setState(state => {
            let files = state.files;
            files[index].status = "failed";
        });
    }

    retryFile = (index) => {
        this.setState(state => {
            let files = state.files;
            files[index].status = "uploading";
            files[index].time = 0;
        });
    }

    componentWillUnmount() {
        this.state.files.forEach(file => {
            URL.revokeObjectURL(file.preview)
        });
    }

    addFiles = (files) => {
        files = files.map(file => {
            file.status = "uploading";
            file.uploadTime = 6;
            file.processTime = 10;
            file.time = 0;
            file.filetype = file.name.split(".").pop();
            return file;
        });
        this.setState({
            files: [...this.state.files, ...files]
        }, this.handleFileTimer);
    }

    handleFileTimer = () => {
        if (this.fileTimer === null) {
            this.fileTimer = setInterval(this.countdown, 1000);
        }
    }

    clearFileTimer = () => {
        clearInterval(this.fileTimer);
        this.fileTimer = null;
    }

    countdown = () => {
        this.setState(state => {
            state.files.forEach(file => {
                if (file.status === "complete" || file.status === "failed") return;
                file.time += 1;
                if (file.status === "uploading" && file.time === file.uploadTime) {
                    file.status = "processing";
                    file.time = 0;
                }
                if (file.status === "processing" && file.time === file.processTime) {
                    file.status = "complete";
                }
            });
            return state;
        }, () => {
            if (this.state.files.every(file => file.status === "complete" || file.status === "failed")) {
                this.clearFileTimer();
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Nav />
                <div className={classes.content}>
                    <div className={classes.container}>
                        <div className={classes.dropzone}>
                            <h2>
                                File Upload
                            </h2>
                            <Dropzone addFiles={this.addFiles} />
                        </div>
                        <div className={classes.filezone}>
                            <FileUploadCards files={this.state.files} viewFile={this.setDisplayFile} stopFile={this.stopFile} retryFile={this.retryFile} />
                        </div>
                    </div>
                </div>
                <FileModal open={this.state.displayFile} viewFile={this.setDisplayFile} getDisplayFile={this.getDisplayFile} />
            </div>
        );
    }
}

export default withStyles(styles)(Demo);
