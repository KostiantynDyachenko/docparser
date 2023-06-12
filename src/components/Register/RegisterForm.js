import React, { useState, useEffect } from 'react';
//import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/styles";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { LoginRegisterFormStyleWithTheme } from "../styles/LoginRegisterFormStyleWithTheme";
import { Link } from 'react-router-dom';
import {Api} from "../Api";
import ToastService from "../Toast/ToastService";
import { connect } from "react-redux";
import { userLogin } from "../../modules/sessionManager/sessionManager";
import SvgFLRDAI from "../Svg/SvgFLRDAI";

const mapDispatchToProps = (dispatch) => {
    return {
        userLogin: user => dispatch(userLogin(user))
    }
}

const initSignupForm = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
}

const useStyles = makeStyles(theme => ({
    ...LoginRegisterFormStyleWithTheme(theme)
}));

function SignupForm(props) {
    const [signupForm, setSignupForm] = useState(initSignupForm);
    // const [validEmail, setValidEmail] = useState(true);
    // const signupFormRef = useRef(null);
    const classes = useStyles(props);

    useEffect(() => {
        // ValidatorForm.addValidationRule('emailTaken', (value) => validEmail);
         ValidatorForm.addValidationRule('passwordsMatch', (value) => (value === signupForm.password));
        return () => {
            // ValidatorForm.removeValidationRule('emailTaken');
             ValidatorForm.removeValidationRule('passwordsMatch');
        }
    });

    const onTextChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setSignupForm(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    };

    const signup = async (e) => {
        const form = { ...signupForm };
        delete form.confirmPassword;
        let response = await Api.createUser(form);
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
                    Create Your Account
                </Typography>
            </div>

            <ValidatorForm onSubmit={signup} onError={errors => console.log(errors)}>
                <div className="form-content">
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="Username"
                                   onChange={onTextChange}
                                   name="username"
                                   value={signupForm.username}
                                   validators={['required']}
                                   errorMessages={['Username is required']}
                                   fullWidth
                    />
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="Email"
                                   onChange={onTextChange}
                                   name="email"
                                   value={signupForm.email}
                                   validators={['required', 'isEmail']}
                                   errorMessages={['Email is required', 'Must be a valid email']}
                                   fullWidth
                    />
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="First Name"
                                   onChange={onTextChange}
                                   name="first_name"
                                   value={signupForm.first_name}
                                   validators={['required']}
                                   errorMessages={['First Name is required']}
                                   fullWidth
                    />
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="Last Name"
                                   onChange={onTextChange}
                                   name="last_name"
                                   value={signupForm.last_name}
                                   validators={['required']}
                                   errorMessages={['Last Name is required']}
                                   fullWidth
                    />
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="Password"
                                   onChange={onTextChange}
                                   name="password"
                                   value={signupForm.password}
                                   type="password"
                                   autoComplete='password'
                                   validators={['required', 'minStringLength:4', 'matchRegexp:.*[a-z].*', 'matchRegexp:.*[A-Z].*', 'matchRegexp:.*\\d.*']}
                                   errorMessages={['Password is required', 'Password must be at least 4 characters', "Password must contain at least 1 lowercase character", "Password must contain at least 1 uppercase character", "Password must contain at least 1 number"]}
                                   fullWidth
                    />
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="Confirm Password"
                                   onChange={onTextChange}
                                   name="confirmPassword"
                                   value={signupForm.confirmPassword}
                                   type="password"
                                   autoComplete='password'
                                   validators={['required', 'passwordsMatch']}
                                   errorMessages={['Password is required', 'Passwords must match']}
                                   fullWidth
                    />
                    <Button className={`${classes.formButton}`}
                            variant="contained"
                            type="submit"
                            color="primary"
                            fullWidth
                    >
                        Signup
                    </Button>
                </div>
            </ValidatorForm>
            <div className={`${classes.formFooter}`}>
                <div>
                    Already have an account?&nbsp;
                    <Link to="/login">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

SignupForm.propTypes = {
};

export default connect(null, mapDispatchToProps)(SignupForm);

