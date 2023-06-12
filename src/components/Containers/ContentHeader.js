import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    contentheader: {
        width: "100%",
        height: "40px",
        ...theme.typography.h6,
        fontSize: "22px"
    }
}));

export default function ContentHeader(props) {
    const classes = useStyles(props);
    const style = props.style ?? {};
    return (
        <div className={classes.contentheader} style={style}>
            {props.children}
        </div>
    );
}
