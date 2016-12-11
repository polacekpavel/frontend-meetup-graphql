import React, { Component } from "react";
import "./App.css";
import UserScreen from "./UserScreen";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={'./strvLogo.jpg'} className="App-logo" alt="logo"/>
          <h2>Awesome app in GraphQL</h2>
        </div>
        <div className="App-intro">
          <UserScreen />
        </div>
      </div>
    );
  }
}

export default App;
