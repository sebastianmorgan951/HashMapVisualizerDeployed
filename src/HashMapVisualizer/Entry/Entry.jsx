import React, {Component} from 'react';

import './Entry.css';
import '../InfoPanel/InfoPanel.css';

export default class Entry extends Component {

  constructor(k, v, hV, iT, iE, c) {
    super();
    this.state = {
      key : k,
      value : v,
      hashValue : hV,
      isTombstone : iT,
      isEmpty : iE,
      col : c,
    }
  }

  deepInfo() {
    if(this.state.isEmpty){
      return <p>Empty Index</p>;
    }
    return (
      <div>
        <p>Index: {this.state.col}</p>
        <p>Key: {this.state.key}</p>
        <p>Value: {this.state.value}</p>
        <p>Key hashed to: {this.state.hashValue}</p>
        <p>Is pending deletion: {this.state.isTombstone.toString()}</p>
      </div>
    )
  }

  toDisplay() {
    if(this.state.isEmpty){
      return <p></p>;
    }
    else{
      return (
        <div>
          <p>K: {this.state.key}</p>
          <p>V: {this.state.value}</p>
          <p>T: {this.state.isTombstone.toString()}</p>
        </div>
      );
    }
  }
}
