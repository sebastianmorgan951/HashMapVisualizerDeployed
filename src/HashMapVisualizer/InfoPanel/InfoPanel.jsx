import React, {Component} from 'react';

import './InfoPanel.css';

export default class InfoPanel extends Component {

  constructor(methodCall, mapIndexInfo, isEmpty) {
    super();
    this.state = {
      methodCallInfo : methodCall,
      mapIndexInfo: <p>This will display extra information about the hash map entry you click on.
                      If you want to get back to having general method call information being
                      displayed on this panel, click on the switch on the right side of your screen.</p>,
      isEmpty: isEmpty,
      wantIndexInfo: 0,
    }
  }

  setIndexInfo(entry) {
    this.state.mapIndexInfo = entry.deepInfo();
  }

  toggleDisplayData() {
    if(this.state.wantIndexInfo === 0){
      this.state.wantIndexInfo = 1;
      return;
    }
    this.state.wantIndexInfo = 0;
    return;
  }

  setNotEmpty() {
    this.setState({isEmpty: false});
  }

  toDisplay() {
    if(this.state.isEmpty){
      return <p>This panel will be used to display your last attempted action, or information about any specific Hash Map index you click on!</p>;
    }
    if(this.state.wantIndexInfo == 0) {
      return (
        <div>
          {this.state.methodCallInfo}
        </div>
      );
    }
    else {
      return (
        <div>
          {this.state.mapIndexInfo}
        </div>
      );
    }
  }
}
