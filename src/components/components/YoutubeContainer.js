import React from 'react';

import ProfileContainer from  './youtubecomponents/ProfileCard';
import PlayListContainer from './youtubecomponents/PlaylistContainer';

import {getYoutubePlaylists, getYoutubePlayListItems} from './utils/api';

export default class YoutubeContainer extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            playlists: {},
            playlistitems: {
                loading: false,
                "data": {}
            }
        }
    }

    componentWillMount() {
        
        const _this = this;
        getYoutubePlaylists(this.props.google.accessToken).then((data) => {
            console.log("Youtube playlists data : ", data);
            _this.setState({playlists: data});
        });
    }

    fetchplayListitems(playListid) {
        const _this = this;
        const playlistItems = this.state.playlistitems;
        playlistItems.loading  = true;
        this.setState({playlistitems: playlistItems}, () => {
            getYoutubePlayListItems(this.props.google.accessToken, playListid).then((data) => {
                console.log(": Youtube playlist items: " );
                const playlistItems = _this.state.playlistitems;
                playlistItems.loading = false;
                playlistItems.data[playListid] = data;
                _this.setState({playlistitems: playlistItems});
            })
        });
       
    }


    render() {

        console.log(this.state.playlistItems, this.state);

        return (
            <div>
                {/*<ProfileContainer profile={this.props.google.profileObj} />*/}
                {(this.state.playlists.items && this.state.playlists.items.length > 0) ?
                    <PlayListContainer 
                        profile={this.props.google.profileObj}
                        access_token={this.props.google.accessToken}
                        playlists = {this.state.playlists} 
                        playlistitems = {this.state.playlistitems}  
                        fetchplayListitems={(playListId) => this.fetchplayListitems(playListId)}  
                    /> : <div className="alert alert-info">
                        No playlist found
                    </div>
                }
                            
            </div>
        )
    }

}