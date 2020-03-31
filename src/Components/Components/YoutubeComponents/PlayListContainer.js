import React from 'react';

import {predictArtist} from '../Utils/TfUtils/TfNer';
import {predictToxicElements} from '../Utils/TfUtils/TfToxicity';
import {getVideoComments, deleteVideoElement} from '../Utils/Api'


export default class PlaylistContainer extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            playListId: null,
            categoryData: {},
            names: [],
            is_processing: false,
            videoToxicity: {},
            videoElementId: null
        }
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.playlistitems.data[this.state.playListId]) {
            this.setState({is_processing: true}, () => {
                this.categorizePlaylist(nextProps.playlistitems.data[this.state.playListId].items);
            });
        }
    }

    openPlaylists(playListId) {
        this.setState({playListId}, () =>  {
            this.props.fetchplayListitems(playListId);
        });
    }

    getTotalVideos() {
        return this.props.playlistitems.data[this.state.playListId].pageInfo.totalResults;
    }

    async categorizePlaylist(items) {
        const categorizedData = await items.reduce(async (allItems, item) => {
            const accumulator = await allItems;
            const name = await predictArtist(item.snippet.title);
            let nameItems = [];

            if (accumulator[name]) {
                nameItems = accumulator[name];
            }  

            nameItems.push(item);
            accumulator[name] = nameItems;

            return accumulator;
        }, {});

        const names = Object.keys(categorizedData);
        const index = names.indexOf('other');
        if (index > -1) {
            names.splice(index, 1);
        }

        names.push('other');
        this.setState(({is_processing: false, categoryData: categorizedData, names}));
    }

    checkToxicity(videoId) {

        const videoToxicity = this.state.videoToxicity;
        videoToxicity[videoId] = {
            "processing": true,
            "deductions": {}
        }

        this.setState({videoToxicity}, () => {
            const _this = this;
            getVideoComments(this.props.access_token, videoId).then((data) => {
                const comments = data.items.map(({snippet}) =>  {
                    return snippet.topLevelComment.snippet.textOriginal;
                });
                predictToxicElements(comments).then((predictions) => {
                    console.log(predictions);
                    videoToxicity[videoId] = {
                        "processing": false,
                        "deductions": predictions
                    };

                    _this.setState({videoToxicity});
                });
    
            });
        })
    }

    selectVideoElementId(videoElementId) {

        console.log("Video Element Id: ", videoElementId);

		this.setState({videoElementId});
    }

    isVideoElementChecked(videoElementId) {
        return this.state.videoElementId === videoElementId;
    }

    

    applyAction(e) {
        if(e.target.value === "delete") {
            deleteVideoElement(this.props.access_token, this.state.videoElementId).then((data) => {
                this.props.fetchplayListitems(this.state.playListId);
            });
        }
    }

    render() {
        
        return (
            <div className="">
                <div className="">
                    <div className="row mb-5">
                        <div className="col-6">
                            <div className="h3 mt-3">Playlists</div>
                            <div>
                                You have {this.props.playlists.pageInfo.totalResults} youtube playlists
                            </div>
                        </div>
                        <div className="col-6 text-right">
                            {this.props.profile.email}
                            <img className="ml-3 img-thumbnail"  src={this.props.profile.imageUrl}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-${this.state.playListId === null ? "12": "2"}`}>
                            <div className="">
                                {this.props.playlists.items.map((item) => {
                                    return (
                                            <div style={{cursor: "pointer"}} className={`card ${this.state.playListId=== item.id ? "text-white bg-info":""}`} onClick={() => this.openPlaylists(item.id)}>
                                                <div className="card-body">    
                                                    <h5 className="card-title" style={{"textDecoration": "underline"}}>{item.snippet.title}</h5>
                                                    <p className="card-text">{item.contentDetails.itemCount} videos.</p>
                                                </div>
                                            </div>
                                    )
                                })}
                            </div>
                        </div>
                        {this.state.playListId !== null && <div className="col-10">

                            {(this.props.playlistitems && this.props.playlistitems.loading === true) && 
                                <div className="text-center mt-5 mb-5">
                                    <div className="spinner-border text-primary text-center" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div>Getting playlist songs...</div>
                                </div>
                            }

                            {this.state.is_processing === true && 
                                <div className="text-center mt-5 mb-5">
                                    <div className="spinner-border text-primary text-center" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div>Processing...</div>
                                </div> 
                            }
                            <div style={{maxHeight: "900px", overflowY:'auto'}}>
                                {this.props.playlistitems.data[this.state.playListId] && <table className="table table-dark">
                                        <tr>
                                            <th colSpan="5" className="text-center">
                                                Total videos: {this.getTotalVideos()}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>S.No</th>
                                            <th> 
                                                <select onChange={(e) => this.applyAction(e)} className="form-control" name="" id="">
                                                    <option style={{'display': 'none'}}>Select Action</option>
                                                    <option value="delete">
                                                        Delete
                                                    </option>
                                                </select>
                                            </th>
                                            <th>Song Title</th>
                                            <th>Position</th>
                                            <th>Comment Toxicity</th>
                                            <th>Video Url</th>
                                        </tr>
                                            {this.state.names.map((key, i) => {
                                            
                                                const keys = [
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            {key.toUpperCase()}
                                                        </td>
                                                    </tr>
                                                ];

                                                this.state.categoryData[key].map((item) =>  {
                                                    const videoId = item.contentDetails.videoId;
                                                    keys.push(
                                                        <tr>
                                                            <td>{i+1}</td>
                                                            <td><input checked={this.isVideoElementChecked(item.id)} type="checkbox" onClick={() => this.selectVideoElementId(item.id)} /></td>
                                                            <td>{item.snippet.title}</td>
                                                            <td>{item.snippet.position}</td>
                                                            <td>
                                                                {this.state.videoToxicity[videoId] &&  this.state.videoToxicity[videoId].processing === true ? 
                                                                    <div className="row">
                                                                        <div className="col-md-12 text-center">
                                                                            <div className="spinner-border text-center" role="status">
                                                                                <span className="sr-only">Loading...</span>
                                                                            </div>
                                                                        </div>
                                                                    </div> :
                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            {this.state.videoToxicity[videoId] ? Object.keys(this.state.videoToxicity[videoId].deductions).map((key) => {
                                                                                return (
                                                                                    <span className="badge badge-pill  badge-danger text-md">
                                                                                        <strong>{key} comments:</strong>
                                                                                        {this.state.videoToxicity[videoId].deductions[key]} 
                                                                                    </span>
                                                                                )
                                                                            }):  <button onClick={() => this.checkToxicity(videoId)} className="btn btn-primary">
                                                                                    Check Toxicity
                                                                                </button>
                                                                            }
                                                                            {this.state.videoToxicity[videoId] && this.state.videoToxicity[videoId].processing === false && Object.keys(this.state.videoToxicity[videoId].deductions).length === 0 &&
                                                                                <div className="badge badge-pill badge-info text-md">
                                                                                    No toxic comments
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </td>
                                                            <td>
                                                                <a className="btn btn-info" target="_blank" href={`https://youtu.be/${videoId}`}>View</a>
                                                            </td>
                                                        </tr>
                                                    )
                                                });
                                            return keys;
                                        })}
                                    </table>
                                }
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}