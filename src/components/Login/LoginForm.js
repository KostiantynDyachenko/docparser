import React, { useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { LoginRegisterFormStyleWithTheme } from "../styles/LoginRegisterFormStyleWithTheme";
import { Link } from 'react-router-dom';
import { Api } from "../Api";
import ToastService from "../Toast/ToastService";
import { connect } from "react-redux";
import { userLogin } from "../../modules/sessionManager/sessionManager";
import SvgFLRDAI from "../Svg/SvgFLRDAI";

const mapDispatchToProps = (dispatch) => {
    return {
        userLogin: user => dispatch(userLogin(user))
    }
}

const initLoginForm = {
    username: "",
    password: ""
}

const useStyles = makeStyles(theme => ({
    ...LoginRegisterFormStyleWithTheme(theme)
}));

function LoginForm(props) {
    const [loginForm, setLoginForm] = useState(initLoginForm);
    const classes = useStyles(props);

    // useEffect(() => {
    //     // ValidatorForm.addValidationRule('emailTaken', (value) => validEmail);
    //     // ValidatorForm.addValidationRule('incorrectPassword', (value) => validPassword);
    //     return () => {
    //         // ValidatorForm.removeValidationRule('emailTaken');
    //         // ValidatorForm.removeValidationRule('incorrectPassword');
    //     }
    // }, []);

    const onTextChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setLoginForm(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    };

    const login = async (e) => {
        let response = await Api.login(loginForm);
        // login successful
        if (response && response?._json.status === true) {
            props.userLogin(response._json.user);
            props.history.push("/");
        }
        // login failed
        else if (response && response?._json.status === false) {
            ToastService.Toast({ icon: "error", message: response._json.result });
        }
    };

    return (
        <div className={`${classes.form}`}>
            <div className={`${classes.formHeader}`}>
                <div className={`${classes.headerLogo}`}>
                    <span>
                        <SvgFLRDAI height="100px" width="350px"/>
                    </span>
                </div>
                <Typography variant="h6">
                    Use Your Username or Email to Login
                </Typography>
            </div>

            <ValidatorForm onSubmit={login} onError={errors => (console.log(errors))}>
                <div className="form-content">
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="Username or Email"
                                   onChange={onTextChange}
                                   name="username"
                                   value={loginForm.username}
                                   type="text"
                                   validators={['required']}
                                   errorMessages={['Email is required']}
                                   fullWidth
                    />
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="Password"
                                   onChange={onTextChange}
                                   name="password"
                                   value={loginForm.password}
                                   type="password"
                                   autoComplete='password'
                                   validators={['required']}
                                   errorMessages={['Password is required']}
                                   fullWidth
                    />
                    <Button className={`${classes.formButton}`}
                            variant="contained"
                            type="submit"
                            color="primary"
                            fullWidth
                    >
                        Login
                    </Button>
                </div>
            </ValidatorForm>
            <div className={`${classes.formFooter}`}>
                <div>
                    <Link to="/recover">
                        Forgot your password?
                    </Link>
                </div>
                <div>
                    Don't have an account?&nbsp;
                    <Link to="/register">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

LoginForm.propTypes = {
};


export default connect(null, mapDispatchToProps)(LoginForm);
