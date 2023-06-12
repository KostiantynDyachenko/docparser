import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    footer: {
        height: "32px",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        fontSize: "12px",
        textTransform: "uppercase",
    }
}));

export default function Footer(props) {
    const classes = useStyles(props);
    const style = props.style ?? {};
    return (
        <div className={classes.footer} style={style}>
            ©FLRD Associates
        </div>
    );
}
