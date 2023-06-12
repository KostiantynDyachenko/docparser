import React  from "react";
import Nav from "../Nav/Nav";
import { withStyles } from '@material-ui/core/styles';
import { rootContainerFullWithTheme } from "../styles/styles";
import PortfolioRoute from "./PortfolioRoute";
import { UploadFile } from "../../modules/fileManager/fileManager";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
    return {
        UploadFile: file => dispatch(UploadFile(file))
    }
}

const styles = (theme) => ({
    root: { ...rootContainerFullWithTheme(theme) }
});

export class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this._props = {...props};
        delete this._props.classes;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Nav title={"Portfolio"} {...this._props} full={true} />
                <PortfolioRoute {...this.props} />
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Portfolio));
