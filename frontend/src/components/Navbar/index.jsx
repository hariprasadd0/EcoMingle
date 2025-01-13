import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {
  LuShoppingCart,
  LuUserCircle,
  LuSearch,
  LuHeart,
  LuShoppingBag,
} from 'react-icons/lu';
import { CiShop } from 'react-icons/ci';

import { Search, StyledInputBase } from './navbar.style';
import logo from '../../assets/images/logo.svg';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice.js';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
export default function PrimarySearchAppBar() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const role = user?.data?.user?.role || user?.user.role || null;

  const [notAllowed, setNotAllowed] = useState(false);
  useEffect(() => {
    if (role === 'admin') {
      setNotAllowed(true);
    } else {
      setNotAllowed(false);
    }
  }, [role]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(items?.length);

  useEffect(() => {
    setCartCount(items?.length);
  }, [items]);

  const handleSubmit = () => {
    let searchQuery = search.trim();
    navigate(`/catalog?search=${searchQuery}`);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    navigate('/profile');
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem disableRipple>
        <IconButton size="medium" aria-label="show 4 new mails" color="inherit">
          <Badge
            badgeContent={cartCount}
            color="error"
            sx={{ '& .MuiBadge-badge': { fontSize: '10px' } }}
          >
            <LuShoppingCart color="secondary" fontSize={24} strokeWidth={1.5} />
          </Badge>
        </IconButton>
        <p>cart</p>
      </MenuItem>
      <MenuItem disableRipple>
        <IconButton
          size="medium"
          aria-label=" new notifications"
          color="inherit"
        >
          <Badge
            badgeContent={cartCount}
            color="error"
            sx={{ '& .MuiBadge-badge': { fontSize: '10px' } }}
          >
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen} disableRipple>
        <IconButton
          size="medium"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <LuUserCircle fontSize={24} strokeWidth={1.5} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #e0e0e0',
          borderLeft: 'none',
          borderRight: 'none',
          borderRadius: 0,
          margin: '0px 8px',
          maxWidth: 'calc(100% - 16px)',
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '50px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <img
              onClick={() => navigate('/dashboard')}
              src={logo}
              alt="logo"
              width={80}
              height={50}
            />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {notAllowed ? (
              <div></div>
            ) : (
              <Search sx={{ borderRadius: '50px' }}>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e) => setSearch(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <IconButton
                  disabled={search === ''}
                  disableRipple
                  size="small"
                  type="submit"
                  variant="contained"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '35px',
                    width: '35px',
                    marginRight: '2px',
                    my: '1px',
                    minHeight: '35px',
                    fontSize: '12px',
                    fontWeight: 'medium',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '50px',

                    ':hover': {
                      backgroundColor: '#2E7D32',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#e0e0e0',
                    },
                  }}
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  <LuSearch color="white" fontSize={18} strokeWidth={1.5} />
                </IconButton>
              </Search>
            )}
          </Box>

          <Box
            sx={{
              display: {
                xs: 'flex',
                md: 'flex',
                gap: '10px',
                alignItems: 'center',
                justifyContent: 'flex-end',
              },
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              <>
                {!role ? (
                  <IconButton
                    size="small"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={() => navigate('/vendor-register')}
                    color="inherit"
                    disableRipple
                  >
                    <CiShop />
                    <Typography fontSize={12}> Become a seller</Typography>
                  </IconButton>
                ) : (
                  <div></div>
                )}

                {notAllowed ? (
                  <div></div>
                ) : (
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={
                      isAuthenticated
                        ? () => navigate('/wishlist')
                        : () => navigate('/login')
                    }
                    color="inherit"
                    disableRipple
                  >
                    <LuHeart fontSize={22} strokeWidth={1.5} />
                  </IconButton>
                )}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  disableRipple
                >
                  <LuUserCircle fontSize={22} strokeWidth={1.5} />
                </IconButton>

                {notAllowed ? (
                  <></>
                ) : (
                  <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                    disableRipple
                    onClick={() => navigate('/cart')}
                  >
                    <Badge
                      size="small"
                      badgeContent={cartCount}
                      color="primary"
                    >
                      <LuShoppingBag fontSize={22} strokeWidth={1.5} />
                    </Badge>
                  </IconButton>
                )}
              </>
            </Box>

            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' } }}
              disableRipple
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
