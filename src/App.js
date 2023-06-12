import Router from "./components/Router/Router";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { green, blue, grey, red } from "@material-ui/core/colors";
import { edgelessBorder, borders } from "./components/styles/styles";
import '@progress/kendo-theme-default/dist/all.css';
import Toast from "./components/Toast/Toast";
import UploadProgress from "./components/UploadProgress/UploadProgress";
import AIOperationModal from "./components/Modal/AIOperationModal";
import React from "react";
import AppProgress from "./components/UploadProgress/AppProgress";
import UploadModal from "./components/Modal/UploadModal";
import ContextMenu from "./components/ContextMenu/ContextMenu";
// import GroupManager from "./components/GroupManager/GroupManager";
// import newAiOperationModalProps from "./components/NewProps/newAiOperationModalProps";
// import FolderTreeModal from "./components/Modal/FolderTreeModal";

const light = {
    overrides: {
        MuiDialogTitle: {
            root: {
                height: "32px",
                padding: "0 16px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                fontSize: "12px"
            }
        },
        MuiTableRow: {
            root: {
                "& .MuiTableCell-sizeSmall.MuiTableCell-paddingCheckbox": {
                    padding: "0 12px"
                }
            }
        },
        MuiTableCell: {
            root: {
                fontSize: "0.8rem"
            },
            body: {
                background: "inherit"
            },
            sizeSmall: {
                padding: "10px 24px 10px 16px"
            }
        },
        MuiTable: {
            stickyHeader: {
                borderCollapse: "collapse"
            }
        },
        MuiDialog: {
            paper: {
                "& .MuiFilledInput-input": {
                    minWidth: "400px"
                },
                "& .MuiSelect-select": {
                    minWidth: "366px",
                    maxWidth: "366px"
                },
                "& .MuiFormLabel": {
                    color: "rgba(0, 0, 0, 0.54)"
                },
                "& .MuiMenuItem-root": {
                    paddingTop: "0",
                    paddingBottom: "0",
                }
            }
        },
        MuiDialogContent: {
            root: {
                padding: "8px 16px",
            }
        },
        MuiButton: {
            root: {
                padding: "4px 8px",
                backgroundColor: '#208d68',
                color: '#fff',
            },
            startIcon: {
                marginRight: "4px"
            },
        },
        MuiBreadcrumbs: {
            li: {
                "& a:hover": {
                    textDecoration: "underline"
                }
            }
        }
    },
    palette: {
        green: green,
        blue: blue,
        red: red,
        border: borders,
        edgelessBorder: edgelessBorder,
        common: {
            link: blue[800]
        },
        primary: {
            main: "#000"
        },
        secondary: {
            main: grey[400]
        },
        lightGreen: {
            main: "#81dbba"
        },
        background: {
            header: grey[600]
        },
        text: {
            header: "#fff"
        }
    }
};

// const dark = {
//     palette: {
//         type: "dark",
//         green: green,
//         blue: blue,
//         border: borderLight,
//         common: {
//             link: blue[800]
//         },
//         primary: {
//             main: "#4098d6"
//         },
//         secondary: {
//             main: green[800]
//         }
//     }
// };

function App() {
    return (
        <ThemeProvider theme={createTheme(light)}>
            {/*<GroupManager />*/}
            <Router />
            <Toast />
            <UploadProgress />
            <AIOperationModal />
            <AppProgress />
            <UploadModal />
            <ContextMenu />
        </ThemeProvider>
    );
}

export default App;
