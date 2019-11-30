import React, { useState, useEffect } from 'react';
import { useAuth0 } from './Auth0Wrapper';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Menu from 'mdi-material-ui/Menu';
import AccountCircle from 'mdi-material-ui/AccountCircle';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import logo from './images/logo.jpg';
import Logout from 'mdi-material-ui/Logout';
import FileMultiple from 'mdi-material-ui/FileMultiple';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import RouteHandler from './RouteHandler';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden'
  },
}));

function App(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState(window.innerHeight - 46);
  const { isAuthenticated, loginWithRedirect, logout, loading, user } = useAuth0();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <React.Fragment>
      <List disablePadding style={{ height: drawerHeight }}>
        <div>
          <ListItem
            dense
            style={{ height: 64 }}
          >
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText
              primary={user ? user.nickname : null}
              primaryTypographyProps={{ noWrap: true, variant: "button" }}
            />
          </ListItem>
        </div>
        <Divider />
        <ListItem button component={Link} to='/reservations'>
          <ListItemIcon>
            <FileMultiple />
          </ListItemIcon>
          <ListItemText primary='Reservations' />
        </ListItem>
      </List>
      <Divider />
      <List disablePadding>
        <ListItem button onClick={logout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </List>
    </React.Fragment>
  );

  const updateDrawerHeight = () => {
    setDrawerHeight(window.innerHeight - 46);
  }

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      if (props.history.location.search) {
        let parsedQueryString = queryString.parse(props.history.location.search);
        if (parsedQueryString.error) {
          logout();
          return;
        }
      }
      loginWithRedirect({});
      return;
    }
  }, [isAuthenticated, loading, loginWithRedirect, logout, props.history.location.search]);

  useEffect(() => {
    window.addEventListener("resize", updateDrawerHeight);
    return () => window.removeEventListener("resize", updateDrawerHeight);
  }, []);

  if (!user) return <LinearProgress />

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} color='default'>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            Management
          </Typography>
          <div style={{ flex: 1 }}></div>
          <img src={logo} height={64} alt='Hotel435 Logo' />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container>
          <Paper>
            <RouteHandler />
          </Paper>
        </Container>
      </main>
    </div>
  );
}

export default withRouter(App);