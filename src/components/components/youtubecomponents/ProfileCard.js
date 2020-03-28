import React from 'react';

export default class ProfileCard extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <div className="media">
                <img src={this.props.profile.imageUrl} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">
                        {this.props.profile.name}
                    </h5>
                    <p className="card-text">
                        <div className="text-info">
                            Email: {this.props.profile.email}
                        </div>
                    </p>
                </div>
            </div>
        )
    }
}