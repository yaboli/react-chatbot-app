import React, {Component} from 'react';
import { ThemeProvider } from 'styled-components';
import ChatBot, { Loading } from 'react-simple-chatbot';
import firebase from '../firebase'
import { withRouter } from 'react-router-dom'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LogoutIcon from '@material-ui/icons/ExitToApp'

import avatar from '../../assets/images/watson_analytics_avatar.png'

// all available props
const botTheme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#3f51b5',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#3f51b5',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
};

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
        };
    }

    componentWillMount() {
        const self = this;
        const { steps, uid } = this.props;
        const { userInput } = steps;
        const url = "http://ec2-35-170-203-171.compute-1.amazonaws.com:8080/api/messaging";
        let requestBody = {
            "recipientId": uid,
            "text": userInput.value
        };
        const xmlHttpRequest = new XMLHttpRequest();

        xmlHttpRequest.addEventListener('readystatechange', readyStateChange);

        function readyStateChange() {
            if (this.readyState === 4) {
                const data = JSON.parse(xmlHttpRequest.response);
                self.setState({ loading: false, result: data.text });
            }
        }

        xmlHttpRequest.open('POST', url);
        xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttpRequest.send(JSON.stringify(requestBody));
    }

    render() {
        const { loading, result } = this.state;
        return (
            <div>{ loading ? <Loading /> : result }</div>
        );
    }
}

function Dashboard(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    if(!firebase.getCurrentUsername()) {
        // not logged in
        alert('Please login first');
        props.history.replace('/login');
        return null
    }

    const userName = firebase.getCurrentUsername();
    const uid = firebase.getCurrentUserUid();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key={ 'Log out' } onClick={logout}>
                        <ListItemIcon>{ <LogoutIcon /> }</ListItemIcon>
                        <ListItemText primary={ 'Log out' } />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div>
                    <ThemeProvider theme={botTheme}>
                        <ChatBot
                            headerTitle={ "Welcome back " + userName + "!"}
                            recognitionEnable={ true }
                            width={ "500px" }
                            style={{
                                position: 'absolute', left: '50%', top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                            botAvatar={avatar}
                            steps={[
                                {
                                    id: '1',
                                    message: "Let's chat!",
                                    trigger: 'userInput',
                                },
                                {
                                    id: 'userInput',
                                    user: true,
                                    trigger: 'botResponse',
                                },
                                {
                                    id: 'botResponse',
                                    component: <Chat uid={uid}/>,
                                    asMessage: true,
                                    trigger: 'userInput',
                                }
                            ]}
                        />
                    </ThemeProvider>
                </div>
            </main>
        </div>
    );

    async function logout() {
        await firebase.logout();
        props.history.push('/')
    }
}

export default withRouter(Dashboard)