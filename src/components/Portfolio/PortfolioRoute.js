import React, { useState, useEffect } from "react";
import { Redirect, Route, useLocation, useParams, useRouteMatch, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { UploadFile } from "../../modules/fileManager/fileManager";
import DocumentView from "./DocumentViewContentQuery";
import PortfolioView from "./PortfolioView";
import AiTrainer from "./AiTrainer";
import SearchView from "./SearchView";

const mapDispatchToProps = (dispatch) => {
    return {
        UploadFile: file => dispatch(UploadFile(file))
    }
}

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings
    }
}

function PortfolioRoute(props){
    const { url, path } = useRouteMatch();
    const { pathname, search } = useLocation();
    const history = useHistory();
    const [redirect, setRedirect] = useState(false);
    // match name
    const [match, setMatch] = useState(false);
    const [view, setView] = useState("portfolio");

    const getQueryFormat = (query) => query.split("?")
        .filter(q => q.length > 0)
        .map(s => {
            const [param, value] = s.split("=");
            return {
                param: param,
                value: value
            }
        });

    const queryCheck = (qs, param) => {
        return qs.some(q => q.param === param);
    }

    const checkRoute = (_pathname = pathname, _search = search) => {

        // route matches, render document or portfolio view
        if (_pathname === url) {
            setMatch(true);
            let queries = getQueryFormat(_search);
            // queries exist & user is viewing document
            if (queries.length > 0 && queryCheck(queries, "view")) {
                setView("document");
            }
            // queries exist & user is training ai
            else if (queries.length > 0 && queryCheck(queries, "train")) {
                setView("aitrainer");
            }
            // queries exist & user is in search
            else if (queries.length > 0 && queryCheck(queries, "search")) {
                setView("search");
            }
            else {
                setView("portfolio");
            }
        }
        // route doesnt match, render PortfolioRoute
        else {
            setMatch(false);
        }
    }

    useEffect(() => {
        checkRoute();

        let unlisten = history.listen((ev) => {
            const { pathname, search } = ev;
            checkRoute(pathname, search);
        });

        return () => {
            unlisten();
        }
    }, []);

    useEffect(() => {
    }, [view, match]);

    return (
        <>
            {
                (redirect) ? (<Redirect to="/portfolio" />) : (null)
            }
            {
                (match && view === "portfolio") ? (
                    <PortfolioView />
                ) : (null)
            }
            {
                (match && view === "aitrainer") ? (
                    <AiTrainer {...props} />
                ) : (null)
            }
            {
                (match && view === "document") ? (
                    <DocumentView />
                ) : (null)
            }
            {
                (match && view === "search") ? (
                    <SearchView />
                ) : (null)
            }
            {
                !match ? (
                    <Route path={`${path}/:id`}>
                        <PortfolioRoute {...props} />
                    </Route>
                ) : (null)
            }
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioRoute);
