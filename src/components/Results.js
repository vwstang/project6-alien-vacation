import React, { Component } from "react";
import { Link } from "react-router-dom";
import NASAPhotos from "./NASAPhotos";
import EarthPhotos from "./EarthPhotos";
import EarthWeather from "./EarthWeather";
import firebase from "../data/firebase"
import textFit from "textfit";

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class Results extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      user: null,
      newPlace: {},
      placeEntries: {},
    };
  }

  getName = name => {
    this.setState({ name })
  }

  login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user: user
        });
      });
  }

  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  handleNewPlace = e => {
    const newPlace = {
      name: this.props.match.params.name,
      lat: this.props.match.params.lat,
      lng: this.props.match.params.lng,
      };

    const dbRef = firebase.database().ref(`/${this.state.user.uid}`);

    dbRef.push(newPlace);

  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user
        }, () => {
          // create reference specific to user
          this.dbRef = firebase.database().ref(`${this.state.user.uid}`);

          this.dbRef.on('value', (snapshot) => {

          });
        })
      }
    })
    textFit(document.getElementsByClassName('place-heading'));
  }

  render() {
    return (
      <div>
        <main className="results">
          <div className="results-header">
            <h2>Visit...</h2>
            <h1 className="place-heading">{this.state.name}</h1>
          </div>

          <Link className="searchAgain" to="/">Search Again</Link>
          <div className="details clearfix">
            <div className="stats">
              <div className="share">
                  <button onClick={this.handleNewPlace}>
                    <img src="/assets/save-icon.png" alt=""/>
                  </button>
                  <img src="/assets/twitter-icon.png" alt=""/>
              </div>
            </div>
            <div className="sat">
              <NASAPhotos
                lng={this.props.match.params.lng}
                lat={this.props.match.params.lat}
              />
            </div>
          </div>
          <EarthPhotos
            lng={this.props.match.params.lng}
            lat={this.props.match.params.lat}
          />
          <EarthWeather
            getName={this.getName}
            lng={this.props.match.params.lng}
            lat={this.props.match.params.lat}
          />
        </main>
        <footer>
          <h3>Intergalactic Visitors System: Earth</h3>
          <p>Developed by Iman, Sally and Vincent</p>
        </footer>
      </div>
    )
  }
}

export default Results;
