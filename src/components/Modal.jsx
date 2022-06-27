import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Notify from './Notify';

const Modal = () => {
  const {
    modal,
    setModal,
    setAlert,
    alert: { location, isAlert },
  } = useAuth();
  const handleClose = () => {
    setModal({ ...modal, isOpen: false });
  };

  useEffect(() => {
    if (!modal.isOpen) {
      if (isAlert && location === 'modal') {
        setAlert({ ...alert, isAlert: false });
      }
    }
  }, [modal?.isOpen]);

  return (
    <Dialog open={modal.isOpen}>
      <DialogTitle>
        {modal.title}
        <IconButton
          aria-label='Close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 0,
            right: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      {location === 'modal' && <Notify />}
      {modal.content}
    </Dialog>
  );
};

export default Modal;
