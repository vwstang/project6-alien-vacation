import React, { Component } from "react";
import axios from "axios";
import apiKeys from "../data/secrets";

class EarthPhotos extends Component {
  constructor() {
    super();
    this.state = {
      photoList: []
    };
  }

  constructFlickrURL = objPhoto => {
    const farmID = objPhoto.farm;
    const serverID = objPhoto.server;
    const photoID = objPhoto.id;
    const secret = objPhoto.secret;

    // Flickr URL constructing using photo data as per Flickr documentation
    return `https://farm${farmID}.staticflickr.com/${serverID}/${photoID}_${secret}.jpg`
  }

  getPhotos = () => {
    const apiKey = apiKeys.flickr;
    const apiURL = "https://api.flickr.com/services/rest/";
    const coordsLon = -79.355685;
    const coordsLat = 43.641114;

    axios.get(apiURL, {
      params: {
        api_key: apiKey,
        method: "flickr.photos.search",
        format: "json",
        nojsoncallback: 1,
        safe_search: 1,
        lat: coordsLat,
        lon: coordsLon,
        per_page: 20
      }
    }).then(res => {
      console.log(res.data);
      const urlList = res.data.photos.photo.map(photo => this.constructFlickrURL(photo))
      this.setState({
        photoList: urlList
      })
    });
  }

  componentDidMount() {
    this.getPhotos();
  }

  render() {
    return (
      <section>
        <ul>
          {
            this.state.photoList.map(photo => {
              return (
                <li>
                  <img src={photo} />
                </li>
              )
            })
          }
        </ul>
      </section>
    )
  }
}

export default EarthPhotos;