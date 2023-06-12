import { Routes } from "./routes";
import { HashRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import NoPage from '../Error/NoPage';

export default function Router() {
    return (
        <HashRouter basename="/">
            <Switch>
                {Routes.map((r, i) => {
                    if (r.private) return <PrivateRoute exact={!!r.exact} path={r.path} component={r.component} key={i} />
                    else return <Route exact={!!r.exact} path={r.path} component={r.component} key={i} />
                })}
                <Route component={NoPage} />
            </Switch>
        </HashRouter>
    );
}