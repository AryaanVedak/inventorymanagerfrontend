import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu.js";
import Typography from "@mui/material/Typography";
import ExitToAppIcon from "@mui/icons-material/ExitToApp.js";
import ChevronRightIcon from "@mui/icons-material/ChevronRight.js";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft.js";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Dashboard from "../dashboard/Dashboard.jsx";
import Analytics from "../analytics/Analytics.jsx";
import Box from "@mui/material/Box";
import * as React from "react";
import {styled, useTheme, createTheme} from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import {Route, Routes} from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SellIcon from '@mui/icons-material/Sell';
import Inventory from '../inventory/Inventory.jsx'
import {useNavigate} from "react-router-dom";
import InventoryState from "../../context/inventory/inventoryState.jsx";
import StorageIcon from '@mui/icons-material/Storage';
import Database from '../database/Database.jsx';
import Sale from '../sale/Sale.jsx';
import { ThemeProvider } from 'styled-components';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function MainApp() {

  const history = useNavigate()

  const theme = createTheme({
    typography: {
      fontFamily: [
        'poppins',
        'sans-serif'
      ].join(','),
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
          {/* Top Bar */}
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    marginRight: 5,
                    ...(open && { display: 'none' }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                  Inventory Manager
                </Typography>
                <IconButton aria-label="logout">
                  <ExitToAppIcon style={{color: 'white'}}/>
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* Left Nav Bar */}
            <Drawer variant="permanent" open={open}>
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                <ListItem key='dashboard' disablePadding sx={{ display: 'block' }}>
                  <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}} onClick={() => history('/')}>
                    <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                      <DashboardIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Dashboard' sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                <ListItem key='inventory' disablePadding sx={{ display: 'block' }}>
                  <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}} onClick={() => history('/inventory')}>
                    <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                      <InventoryIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Inventory' sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                <ListItem key='database' disablePadding sx={{ display: 'block' }}>
                  <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}} onClick={() => history('/database')}>
                    <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                      <StorageIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Database' sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                <ListItem key='analytics' disablePadding sx={{ display: 'block' }}>
                  <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}} onClick={() => history('/analytics')}>
                    <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                      <AnalyticsIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Analytics' sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem key='shop' disablePadding sx={{ display: 'block' }}>
                  <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}} onClick={() => history('/sale')}>
                    <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',}}>
                      <SellIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Shop' sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Drawer>
            <Routes>
              <Route path="/" element={
                <Dashboard/>
              }/>
              <Route path="/inventory" element={
                <Inventory/>
              }/>
              <Route path="/database" element={
                <Database/>
              }/>
              <Route path="/analytics" element={
                <Analytics/>
              }/>
              <Route path="/sale" element={
                <Sale/>
              }/>
            </Routes>
          </Box>
      </ThemeProvider>
    </>
  )
}

export default MainApp
