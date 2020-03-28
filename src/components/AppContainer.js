import React from 'react';

import LoginContainer from './components/LoginContainer';
import YoutubeContainer from './components/YoutubeContainer';
import {getRefreshTokenDetails} from './components/utils/api';

export default class AppContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            googleResponse: null,
            accessDetails: {}
        }

        this.responseGoogle = this.responseGoogle.bind(this);
    }

    responseGoogle(loginResponse) {
        const _this = this;

        this.setState({googleResponse: loginResponse}, () => {
            console.log("Google response : ", this.state.googleResponse);
            // getRefreshTokenDetails(this.state.googleResponse.code).then((data) => {
            //     _this.setState({accessDetails:  data});
            // });
        });
    }

    getComponent() {

        if(this.state.googleResponse === null) {
            return (<LoginContainer responseGoogle={(response) => this.responseGoogle(response)} />);
        } else {
            return (<YoutubeContainer google={this.state.googleResponse} />)
        }

        return (<div></div>)
    }

    render() {

        console.log("Access Details : ", this.state.accessDetails);

        return (
            <div className="container-fluid bg-light h-100">
                {this.getComponent()}
            </div>
        )
    }
}