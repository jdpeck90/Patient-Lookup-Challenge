import React, { Component } from "react";
import "./App.scss";
import BodyCopy from './BodyCopy';
import SearchForm from './SearchForm';

class App extends Component {
  render() {

    return (
      <div className="App">
        <BodyCopy text="Patient Condition Search" size="l" />
        <SearchForm />
      </div>
    );
  }
}

export default App;
