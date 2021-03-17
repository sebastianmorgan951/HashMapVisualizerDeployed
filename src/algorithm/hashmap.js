/* When checking outputs in HashMapVisualizer.jsx, we can first check for an error message, then continue on
 */
import Entry from '../HashMapVisualizer/Entry/Entry';
import '../HashMapVisualizer/InfoPanel/InfoPanel.css';

export function put(grid, key, value, size) { // return map and actions taken
  let actions = [];
  let hashed = hash(key) % grid.length;
  if(!key || !value || 0==key.length || 0==value.length) { //Checks for null, empty, or undefined inputs
    return [grid, actions, hashed, "Both your key and value inputs must be non-empty", false, size, false];
  }   //Returns grid, steps of actions, hashed value of key, error msg, if success, new size of map, if we need to expand capacity
  let errormsg="1";
  if(((size + 1)/grid.length) > 0.75){
    return [grid, actions, hashed, errormsg, false, size, true];
  }
  let tombInd = -1;
  let index = hashed;
  let noInfiniteLoop = 0;
  while(!(grid[index].state.isEmpty)){
    if(noInfiniteLoop >= grid.length){
      break;
    }
    if(grid[index].state.isTombstone && (tombInd == -1)){
      tombInd = index;
      actions.push(<div><p className="tracer_text">Check index {index}</p>
                  <p className="tracer_text">Has entry</p><p className="tracer_text">Is tombstone</p>
                  <p className="tracer_text">Replace tomb</p></div>);
      index = (index + 1)%grid.length;
      continue;
    }
    if(grid[index].state.key==key){
      if(tombInd != -1){
        if(hashed <= tombInd){
          actions[tombInd - hashed] = <div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Is tombstone</p><p className="tracer_text">Continue</p></div>;
        }
        else{
          actions[grid.length - hashed + tombInd] = <div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Is tombstone</p><p className="tracer_text">Continue</p></div>;
        }
      }
      actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p>
                        <p className="tracer_text">Matches key</p><p className="tracer_text">Exit, failure</p></div>);
      return [grid, actions, hashed, errormsg, false, size, false];
    }
    actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">No key match</p><p className="tracer_text">Not tombstone</p><p className="tracer_text">Keep Searching</p></div>);
    index = (index + 1)%grid.length;
    noInfiniteLoop = noInfiniteLoop + 1;
  }
  if(tombInd != -1){
    let diff = tombInd - hashed + 1;
    if(tombInd < hashed){
      diff = grid.length - hashed + tombInd + 1;  //Amount of action elements to keep
    }
    actions = actions.slice(0, diff);
    grid[tombInd] = new Entry(/*Key*/key, /*Key*/value, /*hashValue*/hashed, /*isTomb*/false, /*isEmpty*/false, /*whereItEndsUp*/tombInd);
    return [grid, actions, hashed, errormsg, true, size + 1, false];
  }
  actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Is empty</p><p className="tracer_text">Can put</p></div>);
  grid[index] = new Entry(/*Key*/key, /*Key*/value, /*hashValue*/hashed, /*isTomb*/false, /*isEmpty*/false, /*whereItEndsUp*/index);
  return [grid, actions, hashed, errormsg, true, size + 1, false];
}

export function replace(grid, key, value) { // return map and actions taken
  let actions = [];
  let hashed = hash(key) % grid.length;
  if(!key || !value) { //Checks for null, empty, or undefined inputs
    return [grid, actions, hashed, "Both your key and value inputs must be non-empty", false];
  }   //Returns grid, steps of actions, hashed value of key, error msg, if success`
  let errormsg="1";
  let index = hashed;
  let noInfiniteLoop = 0;
  while(!(grid[index].state.isEmpty)){
    if(noInfiniteLoop >= grid.length){
      break;
    }
    if(grid[index].state.isTombstone){
      if(grid[index].state.key==key){
        actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Is tombstone</p><p className="tracer_text">Matches key</p><p className="tracer_text">Exit, failure</p></div>);
        return [grid, actions, hashed, errormsg, false];
      }
      actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Is tombstone</p><p className="tracer_text">No key match</p><p className="tracer_text">Keep Searching</p></div>);
      continue;
    }
    if(grid[index].state.key===key){
      grid[index] = new Entry(/*Key*/key, /*Key*/value, /*hashValue*/hashed, /*isTomb*/false, /*isEmpty*/false, /*whereItEndsUp*/index);
      actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Matches key</p><p className="tracer_text">Replace</p></div>);
      return [grid, actions, hashed, errormsg, true];
    }
    actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">No key match</p><p className="tracer_text">Not tombstone</p><p className="tracer_text">Keep Searching</p></div>);
    index = (index + 1)%grid.length;
    noInfiniteLoop = noInfiniteLoop + 1;
  }
  actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Is empty</p><p className="tracer_text">Probing Failed</p><p className="tracer_text">Exit</p></div>);
  return [grid, actions, hashed, errormsg, false];
}

export function set(grid, key, value, size) {
  let replaceOutput = replace(grid, key, value);
  if(!(replaceOutput[3].length === 1)){
    return [grid, [], replaceOutput[2], "Both your key and value inputs must be non-empty", size, false];
  }   //Returns grid, steps of actions, hashed value of key, error msg, new size of map, if we need to expand capacity
  if(replaceOutput[4]){
    return [replaceOutput[0], replaceOutput[1], replaceOutput[2], replaceOutput[3], size, true];
  }
  let putOutput = put(grid, key, value, size);
  if(putOutput[6]){
    return [grid, [], putOutput[2], putOutput[3], size, true];
  }
  return [putOutput[0], putOutput[1], putOutput[2], putOutput[3], putOutput[5], putOutput[6]];
}

/*
export function set(grid, key, value, size) { // return map and actions taken
  let actions = [];
  let hashed = hash(key) % grid.length;
  if(!key || !value) { //Checks for null, empty, or undefined inputs
    return [grid, actions, hashed, "Both your key and value inputs must be non-empty", size, false];
  }   //Returns grid, steps of actions, hashed value of key, error msg, new size of map, if we need to expand capacity
  let errormsg="1";
  if(((size + 1)/grid.length) > 0.75){
    return [grid, actions, hashed, errormsg, size, true];
  }
  let index = hashed;
  while(!(grid[index].state.isEmpty)){ //First check for replacement so that we don't accidentally go to
    //replace a tombstone before we reach an existing element with replacement
    if(grid[index].state.key==key){
      grid[index] = new Entry(key, value, hashed, false, false, index);
      actions.push(<p className="tracer_text"><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Matches key</p><p className="tracer_text">Replace value</p></p>);
      return [grid, actions, hashed, errormsg, size, false];
    }
    actions.push(<p className="tracer_text"><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">No key match</p><p className="tracer_text">Keep Searching</p></p>);
    index = (index + 1)%grid.length;
    if(index === hashed){
      break;
    }
  }
  let replaceIndex = hashed;
  while(!(grid[replaceIndex].state.isEmpty)){
    if(grid[replaceIndex].state.isTombstone){
      grid[replaceIndex] = new Entry(key, value, hashed, false, false, replaceIndex);
      actions.push(<p className="tracer_text"><p className="tracer_text">Check index {replaceIndex}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Is tombstone</p><p className="tracer_text">Replace</p></p>);
      return [grid, actions, hashed, errormsg, size + 1, false];
    }
    actions.push(<p className="tracer_text"><p className="tracer_text">Check index {replaceIndex}</p><p className="tracer_text">Has entry</p><p className="tracer_text">No key match</p><p className="tracer_text">Not tombstone</p><p className="tracer_text">Keep Searching</p></p>);
    replaceIndex = (replaceIndex + 1)%grid.length;
  }
  actions.push(<p className="tracer_text"><p className="tracer_text">Check index {replaceIndex}</p><p className="tracer_text">Is empty</p><p className="tracer_text">Can set</p></p>);
  grid[replaceIndex] = new Entry(key, value, hashed, false, false, replaceIndex);
  return [grid, actions, hashed, errormsg, size + 1, false];
}
*/
export function remove(grid, key, size) { // return map and actions taken
  let actions = [];
  let hashed = hash(key) % grid.length;
  if(!key) { //Checks for null, empty, or undefined inputs
    return [grid, actions, hashed, "Both your key and value inputs must be non-empty", size, false];
  }   //Returns grid, steps of actions, hashed value of key, error msg, new size of map, is successful
  let errormsg="1";
  let index = hashed;
  let noInfiniteLoop = 0;
  while(!(grid[index].state.isEmpty)){
    if(noInfiniteLoop >= grid.length){
      break;
    }
    if(grid[index].state.key==key){
      if(grid[index].state.isTombstone){
        actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Matching key</p><p className="tracer_text">Is tombstone</p><p className="tracer_text">Failed, exit</p></div>);
        return [grid, actions, hashed, errormsg, size, false];
      }
      grid[index] = new Entry(/*Key*/key, /*Val*/grid[index].state.value, /*hashValue*/hashed, /*isTomb*/true, /*isEmpty*/false, /*whereItEndsUp*/index);;
      actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">Matching key</p><p className="tracer_text">Remove key</p></div>);
      return [grid, actions, hashed, errormsg, size - 1, true];
    }
    actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Has entry</p><p className="tracer_text">No key match</p><p className="tracer_text">Keep Searching</p></div>);
    index = (index + 1)%grid.length;
    noInfiniteLoop = noInfiniteLoop + 1;
  }
  actions.push(<div><p className="tracer_text">Check index {index}</p><p className="tracer_text">Is empty</p><p className="tracer_text">Failed, exit</p></div>);
  return [grid, actions, hashed, errormsg, size, false];
}

function hash(val) {
  return val.length;
}
