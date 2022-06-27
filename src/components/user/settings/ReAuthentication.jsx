import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import React, { useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PasswordField from '../PasswordField';
import SubmitButton from '../SubmitButton';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';

const ReAuthentication = ({ action }) => {
  const { currentUser, setLoading, setAlert, setModal, modal } = useAuth();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const credential = EmailAuthProvider.credential(
      currentUser?.email,
      passwordRef.current.value
    );
    try {
      await reauthenticateWithCredential(currentUser, credential);
      switch (action) {
        case 'changeEmail':
          setModal({
            ...modal,
            title: 'Update Email',
            content: <ChangeEmail />,
          });
          break;
        case 'changePassword':
          setModal({
            ...modal,
            title: 'Update Password',
            content: <ChangePassword />,
          });
          break;
        case 'deleteAccount':
          setModal({
            ...modal,
            title: 'Delete Account',
            content: <DeleteAccount />,
          });
          break;

        default:
          throw new Error('No matching action');
      }
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
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <DialogContentText>
          Please enter your current password:
        </DialogContentText>
        <PasswordField {...{ passwordRef }} />
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};

export default ReAuthentication;
