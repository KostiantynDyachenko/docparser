import React from "react";
import { rootContainerFullWithTheme, rootContainerWithTheme } from "../styles/styles";
import { withStyles } from "@material-ui/core/styles";
import NavLoggedOut from "../Nav/NavLoggedOut";
import Typography from "@material-ui/core/Typography";
import creampaper from "../../images/creampaper.png";

const styles = (theme) => ({
    root: { ...rootContainerFullWithTheme() },
    content: {
        ...rootContainerWithTheme(theme),
        display: "block",
        height: "calc(100% - 64px)",
        width: "100%",
        margin: "16px 64px 32px",
        overflow: "auto",
        justifyContent: "flex-start"
    },
    card1: {
        width: "100%",
        height: "70%",
        minHeight: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    card1content: {
        width: "1080px",
        height: "100%",
    },
    mainTitle: {
        textAlign: "center",
        ...theme.typography.h3,
        padding: theme.spacing(6, 0, 4)
    },
    mainDescription: {
        textAlign: "center",
        ...theme.typography.body1,
        padding: theme.spacing(0, 0, 4)
    },
    card2: {
        width: "100%",
        height: "50%"
    }
});


export class HomeLoggedOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this._props = {...props};
        delete this._props.classes;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <NavLoggedOut displayLogo={true} displayLogin={true} {...this._props}/>
                <div className={classes.content}>
                    <div className={classes.card1}
                         style={{ backgroundImage: `url(${creampaper})` }}
                    >
                        <div className={classes.card1content}>
                            <div className={classes.mainTitle}>
                            </div>
                            <div className={classes.mainDescription}>
                            </div>
                        </div>
                    </div>
                    <div className={classes.card2}>

                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(HomeLoggedOut);
