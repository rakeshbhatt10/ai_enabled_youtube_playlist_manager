import React from 'react';

import LoginContainer from './Components/LoginContainer';
import YoutubeContainer from './Components/YoutubeContainer';

export default class AppContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            googleAuth: null,
        }

        this.receiveGoogleAuth = this.receiveGoogleAuth.bind(this);
    }

    receiveGoogleAuth(loginResponse) {
        
        console.log("Google login response : ", loginResponse);

        this.setState({googleAuth: loginResponse});
    }

    getComponent() {
        if(this.state.googleAuth === null) {
            return (<LoginContainer receiveGoogleAuth={(response) => this.receiveGoogleAuth(response)} />);
        } else {
            return (<YoutubeContainer google={this.state.googleAuth} />)
        }
    }

    render() {
        return (
            <div className="container-fluid bg-light h-100">
                {this.getComponent()}
            </div>
        )
    }
}