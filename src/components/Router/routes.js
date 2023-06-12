import HomeRouter from "../Home/HomeRouter";
import Login from '../Login/Login';
import Register from '../Register/Register';
import PasswordRecover from '../PasswordRecover/PasswordRecover';
import Portfolio from '../Portfolio/Portfolio';
import Demo from '../Demo/Demo';

/** Dynamic Route Setup
 * path String - Url path
 * name String - Display name
 * component React.Component - Template to load
 * exact Boolean - React router exact path match
 */

let Routes = [
    {
        path: "/",
        name: "Home",
        component: HomeRouter,
        exact: true,
        private: false,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        private: false
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        private: false
    },
    {
        path: "/recover",
        name: "Password Recover",
        component: PasswordRecover,
        private: false,
    },
    {
        path: "/portfolio",
        name: "Portfolio",
        component: Portfolio,
        private: true
    },
    {
        path: "/demo",
        name: "Demo",
        component: Demo,
        private: false,
    }
];
export { Routes };
