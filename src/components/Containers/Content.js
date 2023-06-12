import { rootContainerFullWithTheme } from "../styles/containerStylesWithTheme";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    content: props => ({
        ...rootContainerFullWithTheme(theme),
        height: "calc(100% - 96px)",
        width: "100%",
        margin: props.margin ?? "0",
        padding: props.padding ?? "4px 32px",
        overflow: props.overflow ?? "hidden",
        justifyContent: "flex-start",
        boxSizing: "border-box",
    })
}));

export default function Content(props) {
    const classes = useStyles(props);
    const style = props.style ?? {};
    return (
        <div className={classes.content} style={style}>
            {props.children}
        </div>
    );
}
