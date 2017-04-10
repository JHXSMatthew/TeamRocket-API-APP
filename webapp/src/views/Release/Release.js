import React, { Component } from 'react';


class Release extends Component {

  constructor() {
     super();
     this.state = null;
   }

  componentDidMount() {
    var that = this;
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    var url = 'http://45.76.114.158/data?type=release.json'

    fetch(proxyUrl + url)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      that.setState = response.json();
      console.log(response);
    })
    .then(function(data) {
      that.setState({ person: data.person });
    });
  }


  render() {
    return (
        <div className="row">
            this.state
        </div>
    )
  }
}

export default Release;
