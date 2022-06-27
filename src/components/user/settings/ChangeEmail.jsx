import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { updateEmail } from 'firebase/auth';
import React, { useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import EmailField from '../EmailField';
import SubmitButton from '../SubmitButton';

const ChangeEmail = () => {
  const { currentUser, setLoading, setAlert, modal, setModal } = useAuth();
  const emailRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEmail(currentUser, emailRef.current.value);
      setModal({ ...modal, isOpen: false });
      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'Your email has been updated',
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
        <DialogContentText>Plese enter your current password</DialogContentText>
        <EmailField {...{ emailRef, defaultValue: currentUser?.email }} />
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};

export default ChangeEmail;
