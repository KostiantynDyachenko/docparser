import React, { useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { LoginRegisterFormStyleWithTheme } from "../styles/LoginRegisterFormStyleWithTheme";

const useStyles = makeStyles(theme => ({
    ...LoginRegisterFormStyleWithTheme(theme)
}));

function PasswordRecoverForm(props) {
    const [email, setEmail] = useState();
    const classes = useStyles(props);

    const onTextChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    };

    const recover = async (e) => {

    };


    return (
        <div className={`${classes.form}`}>
            <div className={`${classes.formHeader}`}>
                <Typography variant="h4">
                    Password Recovery
                </Typography>
            </div>

            <ValidatorForm onSubmit={recover} onError={errors => (console.log(errors))}>
                <div className="form-content">
                    <TextValidator className={`${classes.formField}`}
                                   variant="filled"
                                   margin="none"
                                   label="Email"
                                   onChange={onTextChange}
                                   name="email"
                                   value={email}
                                   type="text"
                                   validators={['required']}
                                   errorMessages={['Email is required']}
                                   fullWidth
                    />
                    <Button className={`${classes.formButton}`}
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                    >
                        Reset
                    </Button>
                </div>
            </ValidatorForm>
            <div className={`${classes.formFooter}`}>
                <div>
                    You will be sent instructions on how to reset your password by Email.
                </div>
            </div>
        </div>
    );
}

export default PasswordRecoverForm;

PasswordRecoverForm.propTypes = {
};
