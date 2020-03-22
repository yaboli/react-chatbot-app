import React, {Component} from 'react';
import { ThemeProvider } from 'styled-components';
import ChatBot, { Loading } from 'react-simple-chatbot';

import avatar from './assets/images/watson_analytics_avatar.png'

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

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
        };
    }

    componentWillMount() {
        const self = this;
        const { steps } = this.props;
        const text = steps.userInput.value;
        const url = "http://localhost:8080/api/messaging";
        let requestBody = {
            "recipientId": "7eeafc3e-f6d1-4490-9988-1dc7b15422d9",
            "text": text
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

const Dialog = () => (
    <ThemeProvider theme={theme}>
        <ChatBot
            headerTitle={ "Watson Assistant" }
            recognitionEnable={ true }
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
                    component: <App />,
                    asMessage: true,
                    trigger: 'userInput',
                }
            ]}
        />
    </ThemeProvider>
);

export default Dialog;