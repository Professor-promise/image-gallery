import { Send } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { deleteUser } from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';
import deleteUserRecords from '../../../firebase/deleteUserRecords';

const DeleteAccount = () => {
  const { currentUser, setLoading, setAlert, setModal, modal } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteUserRecords('gallery', currentUser);
      await deleteUser(currentUser);
      setModal({ ...modal, isOpen: false });
      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'Your account was successfully deleted',
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
        <DialogContentText>
          Are you sure you want to delete your account? Deleting your account
          will completely erase all your data/records
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' endIcon={<Send />} type='submit'>
          Confirm
        </Button>
      </DialogActions>
    </form>
  );
};

export default DeleteAccount;
