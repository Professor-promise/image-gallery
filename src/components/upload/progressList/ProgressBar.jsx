import { Stack, Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

const ProgressBar = ({ value }) => {
  return (
    <Stack>
      <CircularProgress
        size={60}
        thickness={5}
        variant='determinate'
        value={value}
      />
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant='caption'
          component='div'
          color='white'
          fontSize='1rem'
        >
          {Math.round(value) + '%'}
        </Typography>
      </Box>
    </Stack>
  );
};

export default ProgressBar;
