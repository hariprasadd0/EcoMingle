import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import logo from '../../../assets/images/logo.svg';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/api';
const Appbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    handleMenuClose();
    try {
      const res = await logout();

      if (res.data.status === 200) {
        localStorage.removeItem('vendor');
        window.location.href = '/login';
      }
    } catch (error) {
      throw new Error('Error logging out', error);
    } finally {
      localStorage.removeItem('vendor');
      window.location.href = '/login';
    }
  };
  const navigate = useNavigate();
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        border: '1px solid #e0e0e0',
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        borderRadius: 0,
        margin: '0px 8px',
        maxWidth: 'calc(100% - 16px)',
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <img src={logo} alt="logo" width={80} height={50} />
        </Box>{' '}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => navigate('/vendor/profile')}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
