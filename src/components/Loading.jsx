import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Loading = () => {
  const { loading } = useAuth();
  return (
    <Backdrop
      open={loading}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 999,
      }}
    >
      <CircularProgress
        sx={{
          color: 'white',
        }}
      ></CircularProgress>
    </Backdrop>
  );
};

export default Loading;
