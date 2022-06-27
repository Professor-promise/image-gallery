import {
  Avatar,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import { useAuth } from '../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import uploadFile from '../../firebase/uploadFile';
import { updateProfile } from 'firebase/auth';
import deleteFile from '../../firebase/deleteFile';
import updateUserRecords from '../../firebase/updateUserRecords';

const Profile = () => {
  const { currentUser, setLoading, setAlert } = useAuth();
  const [name, setName] = useState(currentUser?.displayName);
  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let userObj = { displayName: name };
    let imagesObj = { name };
    try {
      if (file) {
        const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop();
        const url = await uploadFile(
          file,
          `profile/${currentUser?.uid}/${imageName}`
        );

        if (currentUser?.photoURL) {
          const prevImage = currentUser?.photoURL
            ?.split(`${currentUser?.uid}%2F`)[1]
            .split('?')[0];
          if (prevImage) {
            try {
              await deleteFile(`profile/${currentUser?.uid}/${prevImage}`);
            } catch (error) {
              console.log(error);
            }
          }
        }

        userObj = { ...userObj, photoURL: url };
        imagesObj = { ...imagesObj, photo: url };
      }
      await updateProfile(currentUser, userObj);

      await updateUserRecords('gallery', currentUser?.uid, imagesObj);

      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'image uploaded',
        timeout: 3000,
        location: 'modal',
      });
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
          You can update your profile by updating the fields
        </DialogContentText>
        <TextField
          autoFocus
          margin='normal'
          type='text'
          inputProps={{ minLength: 2 }}
          fullWidth
          variant='standard'
          value={name || ''}
          required
          onChange={(e) => setName(e.target.value)}
        ></TextField>
        <label htmlFor='profileImage'>
          <input
            type='file'
            accepts='image/*'
            id='profileImage'
            style={{ display: 'none ' }}
            onChange={handleChange}
          />
          <Avatar
            src={photoURL}
            sx={{ width: 75, height: 75, cursor: 'pointer' }}
          />
        </label>
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};

export default Profile;
