import React, { useContext, useState } from 'react';
import './../ScreensCss/WelcomeScreen.css';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillDashboard, AiOutlineUser, AiFillShopping } from 'react-icons/ai';

import { BsGraphUp } from 'react-icons/bs';
import CartProvider from './../contextApi';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default function LeftDrawer() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cookies, setCookie } = useContext(CartProvider);

  const [open, setOpen] = React.useState(false);
  const [getUsersFromBackend, setUsersFromBackend] = React.useState({});
  const [getProductsFromBackend, setProductsFromBackend] = React.useState({});
  const [loadingCondition1, setLoadingCondition1] = React.useState(true);
  const [loadingCondition2, setLoadingCondition2] = React.useState(true);

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List className="DrawerIcons">
          {['DashBoard', 'All User', 'All Product', 'Analysis', 'Users', 'Products'].map(
            (text, index) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5
                  }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center'
                    }}>
                    {text === 'DashBoard' ? (
                      <Link to="/">
                        <AiFillDashboard style={{ fontSize: '25px' }} />
                      </Link>
                    ) : text === 'All Users' ? (
                      <Link to="AllUsers">
                        <BsGraphUp style={{ fontSize: '25px' }} />
                      </Link>
                    ) : text === 'All Products' ? (
                      <Link to="/AllProducts">
                        <BsGraphUp style={{ fontSize: '25px' }} />
                      </Link>
                    ) : text === 'Analysis' ? (
                      <BsGraphUp style={{ fontSize: '25px' }} />
                    ) : text === 'Users' ? (
                      <AiOutlineUser style={{ fontSize: '25px' }} />
                    ) : (
                      <AiFillShopping style={{ fontSize: '25px' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center'
                  }}>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
