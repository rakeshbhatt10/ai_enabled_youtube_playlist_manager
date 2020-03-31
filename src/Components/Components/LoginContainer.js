import React from 'react';

import GoogleLogin from 'react-google-login';

export default class LoginContainer extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            "googleClientId": "649381324429-enf35sme5dkn9shto6hf3b1stlmgqogd.apps.googleusercontent.com"
        }
    }

    render() {
        return (
            <div className="loginContainer">
                <div className="col-md-12">
                    <div className="row h-100 justify-content-center align-items-center">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title text-center">
                                        <h3>Tensflowjs (Demo) [NER/Toxicity]</h3>
                                        <h5>YouTube Playlist Manager</h5>
                                    </div>
                                    <div className="card-body text-center">
                                        <div className="inner"> 
                                            <GoogleLogin 
                                                clientId={this.state.googleClientId}
                                                scope="https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl"
                                                icon={true}
                                                accessType="offline"
                                                responseType="permissions"
                                                offline={true}
                                                onSuccess={(response) => this.props.receiveGoogleAuth(response)}
                                                onFailure={(response) => this.props.receiveGoogleAuth(response)}
                                            />
                                        </div>            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>       
        )
    }
}