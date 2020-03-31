import fetch from 'isomorphic-fetch';
const BASE_API_URL = "https://www.googleapis.com/youtube/v3/"

export function getYoutubePlayListItems( access_token, playListId ) {

    const params = {
        "part": "snippet,contentDetails,id,status",
        "playlistId": playListId,
        "maxResults": 50
    }

    return get_api(access_token, "playlistItems", params);
}

export function getYoutubePlaylists(access_token) {

    const params = {
        "part": "snippet,contentDetails,id,localizations,player,snippet,status",
        "mine": true,
        "maxResults": 50
    }

    return get_api(access_token, "playlists", params);
}

export function getVideoComments( access_token, videoId ) {

    const params = {
        "part": "id,snippet",
        "videoId": videoId,
        "maxResults": 30,
        textFormat: "plainText"
    }

    return get_api(access_token, "commentThreads", params);
}

export function deleteVideoElement( access_token, videoItemId ) {

    const params = {
        "id": videoItemId
    }

    console.log("Params : ", params);

    return delete_api(access_token, "playlistItems", params);
}

function post_api(url, data) {

    return fetch(url, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        }).then((response) => {
            return response.json();
        });
}

function delete_api(access_token, end_point, params) {

    let apiUrl = `${BASE_API_URL}${end_point}?access_token=${access_token}`;

    Object.keys(params).map((key) => {
        apiUrl = apiUrl + `&${key}=${decodeURIComponent(params[key])}`;
    });

    return fetch(apiUrl, 
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
        });
}

function get_api(access_token, end_point, params) {

    let apiUrl = `${BASE_API_URL}${end_point}?access_token=${access_token}`;

    Object.keys(params).map((key) => {
        apiUrl = apiUrl + `&${key}=${decodeURIComponent(params[key])}`;
    });

    return fetch(apiUrl, 
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        });
}
