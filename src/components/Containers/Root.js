import { rootContainerFullWithTheme } from "../styles/containerStylesWithTheme";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        ...rootContainerFullWithTheme(theme)
    }
}));

export default function Root(props) {
    const classes = useStyles(props);
    return (
        <div className={classes.root}>
            {props.children}
        </div>
    );
}
