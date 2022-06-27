import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { updatePassword } from 'firebase/auth';
import React, { useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PasswordField from '../PasswordField';
import SubmitButton from '../SubmitButton';

const ChangePassword = () => {
  const { currentUser, setLoading, setAlert, setModal, modal } = useAuth();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (passwordRef.current.value !== confirmPasswordRef.current.value) {
        throw new Error("Passwords don't match");
      }
      await updatePassword(currentUser, passwordRef.current.value);
      setModal({ ...modal, isOpen: false });
      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'Your password has been updated',
        timeout: 5000,
        location: 'main',
      });
    } catch (error) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: error.message,
        timeout: 4000,
        location: 'modal',
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <DialogContentText>Please enter your new password</DialogContentText>
        <PasswordField {...{ passwordRef, autoFocus: false }} />
        <PasswordField
          {...{
            passwordRef: confirmPasswordRef,
            id: 'confirmPassword',
            label: 'confirmPassword',
            autoFocus: false,
          }}
        />
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};

export default ChangePassword;
