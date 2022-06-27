import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Delete from '@mui/icons-material/Delete';
import { Download, MoreVert } from '@mui/icons-material';
import deleteDocument from '../../firebase/deleteDocument';
import deleteFile from '../../firebase/deleteFile';
import { useAuth } from '../../context/AuthContext';

export default function Options({ imageId, uid, imageURL }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { currentUser, setAlert } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await deleteDocument('gallery', imageId);
      await deleteFile(`gallery/${currentUser.uid}/${imageId}`);
    } catch (error) {
      setAlert({
        isAlert: true,
        message: error.message,
        severity: 'error',
        location: 'main',
        timeout: 5000,
      });
      console.log(error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageURL);
      const data = await response.blob();
      const blob = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blob;
      link.download = imageId;
      link.click();
      URL.revokeObjectURL(blob);
      link.remove();
    } catch (error) {
      setAlert({
        isAlert: true,
        message: error.message,
        severity: 'error',
        location: 'main',
        timeout: 5000,
      });
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title='Options'>
          <IconButton
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              color: 'white',
              background: 'rgba(0,0,0,.3)',
            }}
            onClick={handleClick}
          >
            <MoreVert fontSize='large' />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <Download fontSize='small' />
          </ListItemIcon>
          Download
        </MenuItem>
        {currentUser?.uid === uid && (
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <Delete fontSize='small' />
            </ListItemIcon>
            Delete
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
