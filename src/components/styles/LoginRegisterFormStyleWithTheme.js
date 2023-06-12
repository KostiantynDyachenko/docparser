import { borders } from "./globalStyles";

const LoginRegisterFormStyleWithTheme = (theme) => ({
    form: {
        width: "600px",
        padding: "40px 100px",
        boxSizing: "border-box",
        background: theme.palette.background.paper,
        border: borders.border,
        borderRadius: "8px",
        boxShadow: theme.shadows[4]
    },
    formField: {
        marginTop: "10px"
    },
    formButton: {
        marginTop: "20px",
        "&:hover": {
            backgroundColor: "#191919"
        }
    },
    formHeader: {
        textAlign: "center",
        marginBottom: "8px",
        "& .MuiTypography-root": {
            display: "inline-block"
        }
    },
    headerLogo: {
        display: "flex",
        justifyContent: "center",
        "& span": {
            display: "flex"
        }
    },
    formFooter: {
        marginTop: "20px",
        "& div": {
            fontSize: "13px"
        },
        "& a": {
            color: theme.palette.common.link
        }
    },
    forgotPassword: {
        fontSize: "13.3333px",
        fontWeight: "400px",
        color: "#3f51b5",
        "&:hover": {
            cursor: "pointer",
            textDecoration: "underline"
        }
    },
    flexSpace: {
        display: "flex",
        justifyContent: "space-between"
    }
});

export { LoginRegisterFormStyleWithTheme };
