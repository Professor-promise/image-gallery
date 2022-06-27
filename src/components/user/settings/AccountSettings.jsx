import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import ReAuthentication from './ReAuthentication';

const AccountSettings = () => {
  const { currentUser, setModal, setAlert, modal } = useAuth();
  const isPasswordProvider =
    currentUser?.providerData[0].providerId === 'password';
  console.log(isPasswordProvider);

  const handleActions = async (action) => {
    if (isPasswordProvider) {
      setModal({
        ...modal,
        title: 'Re-Login',
        content: <ReAuthentication {...{ action }} />,
      });
    } else {
      try {
        await reauthenticateWithPopup(currentUser, new GoogleAuthProvider());
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
    }
  };

  return (
    <>
      <DialogContent dividers>
        <DialogContentText>
          For security reasons you need to provide your current password to
          proceed
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          fontSize: '1.4rem',
        }}
      >
        {isPasswordProvider && (
          <Button onClick={() => handleActions('changePassword')}>
            Change Password
          </Button>
        )}
        <Button onClick={() => handleActions('changeEmail')}>
          Change Email
        </Button>
        <Button onClick={() => handleActions('deleteAccount')}>
          Delete Account
        </Button>
      </DialogActions>
    </>
  );
};

export default AccountSettings;
