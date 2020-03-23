import React, {Component} from 'react';
import { ThemeProvider } from 'styled-components';
import ChatBot, { Loading } from 'react-simple-chatbot';
import { Button } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import firebase from '../firebase'
import { withRouter } from 'react-router-dom'

import avatar from '../../assets/images/watson_analytics_avatar.png'

// all available props
const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#1E90FF',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#1E90FF',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
};

const styles = theme => ({
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

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
        const { steps, username } = this.props;
        const { userInput } = steps;
        const url = "http://localhost:8080/api/messaging";
        let requestBody = {
            "recipientId": username,
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
    const { classes } = props;

    if(!firebase.getCurrentUsername()) {
        // not logged in
        alert('Please login first');
        props.history.replace('/login');
        return null
    }

    const username = firebase.getCurrentUsername();

    return (
        <div>
            <ThemeProvider theme={theme}>
                <ChatBot
                    headerTitle={ "Welcome " + username + "!"}
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
                            component: <Chat username={username}/>,
                            asMessage: true,
                            trigger: 'userInput',
                        }
                    ]}
                />
            </ThemeProvider>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                onClick={logout}
                className={classes.submit}>
                Logout
            </Button>
        </div>
    );

    async function logout() {
        await firebase.logout();
        props.history.push('/')
    }
}

export default withRouter(withStyles(styles)(Dashboard))