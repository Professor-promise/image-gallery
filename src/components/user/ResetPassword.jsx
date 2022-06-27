import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import React, { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import EmailField from './EmailField';
import SubmitButton from './SubmitButton';

const ResetPassword = () => {
  const emailRef = useRef();
  const { setModal, modal, setAlert, setLoading, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(emailRef.current.value);
      setModal({ ...modal, isOpen: false });
      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'reset link has been set to your email address',
        location: 'main',
        timeout: 3000,
      });
    } catch (error) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: error.message,
        location: 'modal',
        timeout: 3000,
      });
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <DialogContentText>Please enter your email address:</DialogContentText>
        <EmailField {...{ emailRef }} />
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};

export default ResetPassword;
