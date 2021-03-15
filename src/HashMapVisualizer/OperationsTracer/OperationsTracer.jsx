import React, { Component } from 'react';
import './OperationsTracer.css'
import ArrowDown from './Images/arrow_box_down.png';
import ArrowUp from './Images/arrow_box_up.png';
import Empty from './Images/empty.png';
import StartArrowUp from './Images/arrow_box_up_green.png';
import StartArrowDown from './Images/arrow_box_down_green.png';
import EndArrowUp from './Images/arrow_box_up_black.png';
import EndArrowDown from './Images/arrow_box_down_black.png';



export default class OperationsTracer extends Component {

  constructor(action, col){
    super();
    this.state={
      text: action,
      col: col,
      isEmpty: true,
      isStart: false,
      isEnd: false,
    }
  }

  clearStartEndProps() {
    this.state.isEnd = false;
    this.state.isStart = false;
  }

  setAction(action) {
    this.state.isEmpty = false;
    this.state.text = action;
  }

  setEnd() {
    this.state.isEnd = true;
  }

  setStart() {
    this.state.isStart = true;
  }

  setEmpty() {
    this.state.isEmpty = true;
  }

  toDisplay() {
    if(this.state.isEmpty){
      return (
        <div>
          <img className="op_tracer_top" src={Empty}/>
        </div>
      );
    }
    if(this.state.col%2 == 0){
      if(this.state.isStart){
        return (
          <div>
            <img className="op_tracer_top" src={StartArrowDown}/>
            <div className="centered"> {this.state.text} </div>
          </div>
        );
      }
      if(this.state.isEnd){
        return (
          <div>
            <img className="op_tracer_top" src={EndArrowDown}/>
            <div className="centered"> {this.state.text} </div>
          </div>
        );
      }
      return (
        <div>
          <img className="op_tracer_top" src={ArrowDown}/>
          <div className="centered"> {this.state.text} </div>
        </div>
      );
    }
    else{
      if(this.state.isStart){
        return (
          <div>
            <img className="op_tracer_top" src={StartArrowUp}/>
            <div className="centered"> {this.state.text} </div>
          </div>
        );
      }
      if(this.state.isEnd){
        return (
          <div>
            <img className="op_tracer_top" src={EndArrowUp}/>
            <div className="centered"> {this.state.text} </div>
          </div>
        );
      }
      return (
        <div>
          <img className="op_tracer_bot" src={ArrowUp}/>
          <div className="centered"> {this.state.text} </div>
        </div>
      );
    }
  }

}
