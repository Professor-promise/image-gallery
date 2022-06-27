import { Google } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import ResetPassword from './ResetPassword';
import SubmitButton from './SubmitButton';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const {
    modal,
    setModal,
    signup,
    login,
    loginWithGoogle,
    setAlert,
    setLoading,
  } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (isRegister) {
      const confirmPassword = confirmPasswordRef.current.value;
      try {
        if (password !== confirmPassword) {
          throw new Error(`Password don't match`);
        }
        await signup(email, password);
        setModal({ ...modal, isOpen: false });
      } catch (error) {
        setAlert({
          isAlert: true,
          severity: 'error',
          message: error.message,
          timeout: 3000,
          location: 'modal',
        });
        console.log(error);
      }
    } else {
      try {
        await login(email, password);
        setModal({ ...modal, isOpen: false });
      } catch (error) {
        setAlert({
          isAlert: true,
          severity: 'error',
          message: error.message,
          timeout: 3000,
          location: 'modal',
        });
        console.log(error);
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setModal({ ...modal, isOpen: false });
    } catch (error) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: error.message,
        timeout: 3000,
        location: 'modal',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    if (isRegister) {
      setModal({ ...modal, title: 'Register' });
    } else {
      setModal({ ...modal, title: 'Login' });
    }
  }, [isRegister]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <DialogContentText>
            Please enter your email and password here:
          </DialogContentText>
          <EmailField {...{ emailRef }} />
          <PasswordField {...{ passwordRef, autoFocus: false }} />
          {isRegister && (
            <PasswordField
              {...{
                passwordRef: confirmPasswordRef,
                id: 'confirmPassword',
                label: 'confirmPassword',
                autoFocus: false,
              }}
            />
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: '19px',
          }}
        >
          <Button
            size='small'
            onClick={() =>
              setModal({
                ...modal,
                title: 'Reset Password',
                content: <ResetPassword />,
              })
            }
          >
            Forgot Password?
          </Button>

          <SubmitButton />
        </DialogActions>
      </form>
      <DialogActions
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: '5px 24px',
        }}
      >
        {isRegister
          ? 'Do have an Account? Sign in now'
          : "Don't have an account? Create one now"}
        <Button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Login' : 'Register'}
        </Button>
      </DialogActions>
      <DialogActions
        sx={{
          justifyContent: 'center',
          py: '24px',
        }}
      >
        <Button
          variant='outlined'
          startIcon={<Google />}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
      </DialogActions>
    </>
  );
};

export default Login;
