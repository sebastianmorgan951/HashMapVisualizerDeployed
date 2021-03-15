import React, {Component} from 'react';
import {useState} from 'react';
import Entry from './Entry/Entry';
import {put, replace, set, remove} from '../algorithm/hashmap';
import InfoPanel from './InfoPanel/InfoPanel';
import Switch from './ToggleSwitch';
import classnames from 'classnames';
import OperationsTracer from './OperationsTracer/OperationsTracer';

import './HashMapVisualizer.css';
import './InfoPanel/InfoPanel.css';


//For me tomorrow:

//The general idea is HINT YOU CAN RETURN CSS FORMATTED STUFF IN JS FUNCTIONS WTF
//Use this to update your info panel, then put in two text boxes for key and value inputs, then use vid to find how to do that

//In case of notaFunction error: Remember to use this.state.someInstanceVar


const DEFAULT_CAPACITY = 2;

export default class HashMapVisualizer extends Component {

  constructor() {
    super();
    this.state = {
      grid: [],
      infoPanel: new InfoPanel("", "", true),
      lastKeyUsed: "",
      lastValueUsed: "",
      lastWasSuccessful: false,
      size: 0,
      operations: [],
    };
  }

  handleKeyInput = event => {
    this.setState({ lastKeyUsed: event.target.value });
  };

  handleValueInput = event => {
    this.setState({ lastValueUsed: event.target.value });
  }

  clearBoxes = () => {

  }

  componentDidMount() {
    const grid = getInitialGrid();
    const operations = getInitialActions();
    this.setState({grid: grid, operations: operations});
  }

  addElement() {
    this.state.infoPanel.state.isEmpty = false;
    let grid = this.state.grid;
    let addOutput = put(grid, this.state.lastKeyUsed, this.state.lastValueUsed,this.state.size);
    if(!(addOutput[3].length === 1)){
      this.state.infoPanel.state.methodCallInfo = (<div><p>Both your key and value inputs must be non-empty</p></div>);
      this.setState({});
      return;
    }
    if(addOutput[6]){
      let success = this.expandCapacity();
      if(!(success)){
        this.state.infoPanel.state.methodCallInfo = (<div>
          <p>To add this element, we need to expand capacity, but this is not possible as we are
          limited to 16 slots to make everything visual. You can remove some elements or reload this page!</p>
          </div>);
        this.setState({});
        return;
      }
      let afterExpandGrid = this.state.grid;
      let nowOutput = put(afterExpandGrid, this.state.lastKeyUsed, this.state.lastValueUsed,this.state.size);
      this.state.size = nowOutput[5];
      this.state.lastWasSuccessful = nowOutput[4];
      this.state.infoPanel.state.methodCallInfo = (<div><p>We had to expand capacity, as we surpassed our load capacity, by doing so
        we rehashed all key-value pairs.</p>
        <p>Last Method Call: Attempted Put Element</p>
        <p>Key: {this.state.lastKeyUsed}</p><p>Value: {this.state.lastValueUsed}</p>
        <p>Success: {this.state.lastWasSuccessful.toString()}</p></div>);
      this.fillOperations(nowOutput[2], nowOutput[1]);
      this.setState({});
      return;
    }
    this.state.lastWasSuccessful = addOutput[4];
    this.state.infoPanel.state.methodCallInfo = (<div><p>Last Method Call: Attempted Put Element</p>
      <p>Key: {this.state.lastKeyUsed}</p><p>Value: {this.state.lastValueUsed}</p>
      <p>Success: {this.state.lastWasSuccessful.toString()}</p></div>);
    this.state.size = addOutput[5];
    this.fillOperations(addOutput[2], addOutput[1]);
    this.setState({});
  }

  replaceElement() {
    this.state.infoPanel.state.isEmpty = false;
    let grid = this.state.grid;
    let addOutput = replace(grid, this.state.lastKeyUsed, this.state.lastValueUsed);
    if(!(addOutput[3].length === 1)){
      this.state.infoPanel.state.methodCallInfo = (<div><p>Both your key and value inputs must be non-empty</p></div>);
      this.setState({});
      return;
    }
    this.state.lastWasSuccessful = addOutput[4];
    this.state.infoPanel.state.methodCallInfo = (<div><p>Last Method Call: Attempted Replace Element</p>
      <p>Key: {this.state.lastKeyUsed}</p><p>New Value: {this.state.lastValueUsed}</p>
      <p>Success: {this.state.lastWasSuccessful.toString()}</p></div>);
    this.fillOperations(/* Hashed val*/ addOutput[2], /* Actions arr */ addOutput[1]);
    this.setState({});
  }

  setElement() {
    this.state.infoPanel.state.isEmpty = false;
    let grid = this.state.grid;
    let addOutput = set(grid, this.state.lastKeyUsed, this.state.lastValueUsed,this.state.size);
    if(!(addOutput[3].length === 1)){
      this.state.infoPanel.state.methodCallInfo = (<div><p>Both your key and value inputs must be non-empty</p></div>);
      this.setState({});
      return;
    }
    if(addOutput[5]){
      let success = this.expandCapacity();
      if(!(success)){
        this.state.infoPanel.state.methodCallInfo = (<div>
          <p>To add this element, we need to expand capacity, but this is not possible as we are
          limited to 16 slots to make everything visual. You can remove some elements or reload this page!</p>
          </div>);
        this.setState({});
        return;
      }
      let afterExpandGrid = this.state.grid;
      let nowOutput = set(afterExpandGrid, this.state.lastKeyUsed, this.state.lastValueUsed,this.state.size);
      this.state.size = nowOutput[4];
      this.state.infoPanel.state.methodCallInfo = (<div><p>We had to expand capacity, as we surpassed our load capacity, by doing so
        we rehashed all key-value pairs.</p>
        <p>Last Method Call: Set Element</p>
        <p>Key: {this.state.lastKeyUsed}</p><p>Value: {this.state.lastValueUsed}</p>
        <p>Success: true</p></div>);
      this.fillOperations(/* Hashed val*/ nowOutput[2], /* Actions arr */ nowOutput[1]);
      this.setState({});
      return;
    }
    this.state.size = addOutput[4];
    this.state.infoPanel.state.methodCallInfo = (<div><p>Last Method Call: Set Element</p>
      <p>Key: {this.state.lastKeyUsed}</p><p>Value: {this.state.lastValueUsed}</p>
      <p>Success: true</p></div>);
    this.fillOperations(/* Hashed val*/ addOutput[2], /* Actions arr */ addOutput[1]);
    this.setState({});
  }

  removeElement() {
    this.state.infoPanel.state.isEmpty = false;
    let grid = this.state.grid;
    let addOutput = remove(grid, this.state.lastKeyUsed,this.state.size);
    if(!(addOutput[3].length === 1)){
      this.state.infoPanel.state.methodCallInfo = (<div><p>Both your key and value inputs must be non-empty</p></div>);
      this.setState({});
      return;
    }
    this.state.lastWasSuccessful = addOutput[5];
    this.state.infoPanel.state.methodCallInfo = (<div><p>Last Method Call: Attempted Remove Element</p>
      <p>Key: {this.state.lastKeyUsed}</p>
      <p>Success: {this.state.lastWasSuccessful.toString()}</p></div>);
    this.state.size = addOutput[4];
    this.fillOperations(/* Hashed val*/ addOutput[2], /* Actions arr */ addOutput[1]);
    this.setState({});
  }

  expandCapacity() {
    if((this.state.grid.length * 2) > 16){
      /*RETURN SOMETHING HERE */   ///////////////////////////////////////////////////////////////////////////////
      return false;
    }
    let grid = this.state.grid;
    let newGrid = [];
    let newOperations = [];
    for(let col = 0; col < grid.length*2; col ++){
      newGrid.push(new Entry("","","",false,true,col));
      newOperations.push(new OperationsTracer("",col));
    }
    for(let col = 0; col < grid.length; col ++){
      if(grid[col].state.isEmpty){
        continue;
      }
      if(grid[col].state.isTombstone){
        continue;
      }
      put(newGrid, grid[col].state.key, grid[col].state.value, 0);
    }
    this.state.grid = newGrid;
    this.state.operations = newOperations;
    return true;
  }

  fillOperations(hashed, actions) {
    let index = 0;
    let trueOpVal = hashed;
    for(let i = hashed; i < hashed + this.state.operations.length; i ++){
      trueOpVal = i % this.state.operations.length;
      //Adding to the correct pos on our operations, stopping after we exceed the length of our actions
      if(index < actions.length){
        this.state.operations[trueOpVal].setAction(actions[index]);
        this.state.operations[trueOpVal].clearStartEndProps();
        if(index == 0){
          console.log("On first action");
          this.state.operations[trueOpVal].setStart();
        }
        else if(index == (actions.length - 1)){
          this.state.operations[trueOpVal].setEnd();
        }
        index++;
        continue;
      }
      this.state.operations[trueOpVal].setEmpty();
    }
  }

  handleMouseUpPanel() {

  }

  handleMouseEnterPanel() {

  }

  handleMouseDownPanel() {

  }

  toggleNotifications = ({ enabled }) => {
    this.state.infoPanel.state.wantIndexInfo = 1 - this.state.infoPanel.state.wantIndexInfo;
    this.setState({});
  }

  handleOnClick = (ev) => {
    if(this.state.infoPanel.state.wantIndexInfo == 1){
      this.state.infoPanel.setIndexInfo(this.state.grid[ev.currentTarget.dataset.div_id]);
    }
    this.setState({});
    console.log("Here in the: " + ev.currentTarget.dataset.div_id);
  }

  getData(val){

  }

  render() {
    const {grid, infoPanel, lastKeyUsed, lastValueUsed, lastWasSuccessful, size, operations} = this.state;

    const { wantIndexPanel } = this.state.infoPanel.state.wantIndexInfo;

    const headingClasses = classnames(
      'font-weight-light h2 mb-0 pl-4',
      wantIndexPanel ? 'text-dark' : 'text-secondary'
    );

    return (
      <>
        <div className="button_panel">
          <div className="button" onClick={() => this.addElement()}>
            Put Element
          </div>
          <div className="button" onClick={() => this.replaceElement()}>
            Replace Element
          </div>
          <div className="button" onClick={() => this.setElement()}>
            Set Element
          </div>
          <div className="button" onClick={() => this.removeElement()}>
            Remove Element
          </div>
        </div>
        <div className="info_panel">
          {infoPanel.toDisplay()}
        </div>
        <div className="input_fields">
          <div className="box_description">
            Key:
          </div>
          <input className="text_box" placeholder="key" type="text" onChange={this.handleKeyInput}>
          </input>
          <div className="box_description">
            Value:
          </div>
          <input className="text_box" placeholder="val" type="text" onChange={this.handleValueInput}>
          </input>
        </div>
        <div className="op_grid_top">
          {operations.map((enty, ind) => {
            if(ind%2 == 0){
            return (
              <div className="op_single_container" key={this.state.col}>
                {operations[ind].toDisplay()}
              </div>
              );
            }
            })}
        </div>
        <div className="grid">
          {grid.map((enty, ind) => {
            const col = enty.state.col;
            return (
              <div className="entry" key={col} data-div_id={col} onClick={ this.handleOnClick }>
                {grid[ind].toDisplay()}
              </div>
            );
          })}
        </div>
        <div className="op_grid_bot">
        {operations.map((enty, ind) => {
          if(ind%2 == 1){
          return (
            <div className="op_single_container" key={this.state.col}>
              {operations[ind].toDisplay()}
            </div>
            );
          }
          })}
        </div>
        <div  className="switch_box_panel">
          <p>Change Panel Contents</p>
          <Switch theme="default"
            className="d-flex"
            enabled={wantIndexPanel}
            onStateChanged={this.toggleNotifications}
          />
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let col = 0; col < DEFAULT_CAPACITY; col++) {
    grid.push(new Entry("", "", "", false, true, col));
  }
  return grid;
};

const getInitialActions = () => {
  const ops = [];
  for (let col = 0; col < DEFAULT_CAPACITY; col++) {
    ops.push(new OperationsTracer("", col));
  }
  return ops;
};
