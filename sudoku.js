"use strict";

let GRID = null
let other = null
let iID = null
let count = 0
const STUCK = 2

let  SOK_NUMBERS = []

class DecisionTree {
  constructor(new_grid){
    this.grid = new_grid
  }
  // NEEDS REFACTORING
  // O Notation is shit
  resolve(layer) {
    console.log("Computing tree...")
    let stuck = false
    let solved =  false
    while(!solved && !stuck) {
      let grid = this.grid
      forEveryCell.call(this.grid, function(x){
        let returnValue =  this.evaluate(grid)
      })
      solved = isResolved(grid)
      stuck = isStuck(grid)
    }

    if(stuck && !solved) {
      let lowestCell = lowestPot(this.grid)
      let arrayform = Array.from(lowestCell.potential)
      let success = false
      arrayform.forEach((val, i) => {
        if(!success) {
           let lowestCell = lowestPot(this.grid)
          let copy = clone.call(this.grid)
          copy[lowestCell.x][lowestCell.y].setValue(val)
          reCluster(copy)
          let newDecTree = new DecisionTree(copy)
          let calculated = newDecTree.resolve(layer+1)
          if(isResolved(calculated)) {
            this.grid = calculated
          }
        }
        success = isResolved(this.grid)
      })
    }
    return this.grid
  }
}

class Cell {
  constructor(x, y, gridsize, val) {
    this.x = x;
    this.y = y;
    this.potential = new Set(possible(gridsize))
    this.val = val
    this.cluster = []
    this.unchangeable = val > 0
    this.sinceChange = 0
    this.userSetValue = false
  }
  constant() {
    return this.getValue() > 0
  }
  userSet(newValue) {
    this.setValue(newValue)
    this.userSetValue = newValue > 0
    this.unchangeable = newValue > 0
  }
  solved() {
    return this.getValue() > 0
  }
  show() {
    return this.solved() ? this.val : ""
  }
  evaluate(grid) {
    if (!this.solved()) {
      let lastsize = this.potential.size
      this.getCluster().forEach((neighbour) => {
        if (neighbour != this && neighbour.solved()) {
          this.removePotential(neighbour.getValue())
        }
      })

      for (let neighbour of this.getAllIntersecting(grid)) {
        if (neighbour.solved()) {
          this.removePotential(neighbour.getValue())
        }
      }
      if(this.sinceChange > STUCK) {

      }
      if (this.potential.size === 1) {
        let val = this.potential[Symbol.iterator]().next().value
        this.potential = new Set()
        this.setValue(val)
      }

      if(lastsize === this.potential.size){
        this.sinceChange++
      } else {
        this.sinceChange = 0
      }
    }
    return [this.solved(), this.sinceChange > STUCK]
  }
  addPotential(val) {
    this.potential.delete(val)
  }
  removePotential(val) {
    this.potential.delete(val)
  }
  getCluster() {
    return this.cluster
  }
  setCluster(newCluster) {
    this.cluster = newCluster
  }
  getValue() {
    return this.val
  }
  setValue(newvalue) {
    this.val = newvalue
  }
  copy(){
    let newCell = new Cell(this.x, this.y, gridSelector()**2, this.val)
    newCell.potential = new Set(this.potential)
    return newCell
  }
  getAllIntersecting(grid) {
    let otherCell = []
    for (let i = 0; i < grid.length; i++) {
      otherCell.push(grid[i][this.y])
    }
    for (let i = 0; i < grid.length; i++) {
      otherCell.push(grid[this.x][i])
    }
    otherCell = otherCell.filter(cell => cell !== this)
    return otherCell
  }
  isStuck() {
    return this.sinceChange > STUCK || this.solved()
  }
}


// Helper //--------------------------------------------------------------------

function isResolved(grid) {
  return forEachHas.call(grid, function(x) {return x.solved()})
}

function isStuck(grid) {
  return forEachHas.call(grid, function(x) {return x.isStuck()})
}

function lowestPot(grid){
    return grid.reduce((top, row) => {
      let lowestCell = row.reduce((acc, cell) => {
        if(!cell.solved()) {
          if(acc) {
            return acc.potential.size > cell.potential.size ? cell : acc
          }
          return cell
        }
        return acc
      }, undefined)

      if(top && lowestCell) {
         return top.potential.size > lowestCell.potential.size ? lowestCell : top
      } else if( top && !lowestCell) {
        return top
      } else if( !top && lowestCell) {
        return lowestCell
      } else {
      }
    }, undefined)
}

function calc(grid) {
  forEveryCell.call(grid, function(x,y,z){
      this.evaluate(grid)
  })
}

function fillGrid(grid, abbild) {
  grid.forEach((row, x) => {
    row.forEach((element, y) => {
      grid[x][y] = new Cell(x, y, gridSelector()**2, abbild[x][y])
    })
  })
  reCluster(grid)
}

function getChunk(v, chunk){
  return Math.floor(v / chunk) % chunk
}

function clustering(x, y, grid) {
  let cluster = [];
  let chunk = sqroot(grid.length)
  let value_x = getChunk(x, chunk)
  let value_y = getChunk(y, chunk)
  forEveryCell.call(grid, function(x,y, list){
    if (value_x == getChunk(x, chunk) && value_y == getChunk(y, chunk)) {
      cluster.push(this)
    }
  })
  return cluster
}

function getClusterChunks(grid) {
  let cluster = []
  let chunk = sqroot(grid.length)
  for (let i = 0; i < grid.length; i += chunk) {
    let temp = []
    for (let j = 0; j < grid.length; j += chunk) {
      temp.push(grid[i][j])
    }
    cluster.push(temp)
  }
  return cluster
}

function reCluster(grid) {
  forEveryCell.call(grid, function(x,y,list) {this.setCluster(clustering(x,y,list))})
}


// List Helper //--------------------------------------------------------------------
function forEachHas(funct){
  return this.every(row => row.every(cell => funct(cell)))
}
function sqroot(va) {
  return Math.pow(va, .5)
}
function fill(segments, val) {
  for (let i = 0; i < segments; i++) {
    let temp = []
    for (let j = 0; j < segments; j++) {
      temp.push(val)
    }
    this.push(temp)
  }
}
function realign() {
  let newGrid = []
  fill.call(newGrid, this.length, 0)
  forEveryCell.call(this, function(x,y, list) {
    newGrid[y][x] = this
  })
  return newGrid
}
function clone() {
  let newVal = []
  this.forEach((row, x) =>{
      let newRow = []
      row.forEach((cell, y)=>{
          newRow.push(cell.copy())
      })
      newVal.push(newRow)
  })
  reCluster(newVal)
  return newVal
}
function forEveryCell(funct){
  this.forEach((row, x, parent) => {
      row.forEach((cell, y) => funct.call(cell, x, y, this))
  })
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
function possible(val){
  let allowedElements = []
  for (let i = 1; i <= val; i++) {
    allowedElements.push(i)
  }
  return shuffle(allowedElements)
}
// Setup //---------------------------------------------------------------------

let  init = () => {
  console.clear()
  let amount = gridSelector() * gridSelector()
  let values =  SOK_NUMBERS
  updateCanvasSize()
  let grid = create2DGRID(amount, amount)
  let newGrid = []
  fill.call(newGrid, amount, 0)
  fillGrid(grid,newGrid)

  let other = create2DGRID(amount, amount, values)
  return [grid, other]
}

// Cycle //-------------------------------------------------------------------------------------------

let update = (grid, other) => {
  let a = grid[0][0]
  calc(grid)
  draw(getContext(), getGrid())
  nextRound()
  let _solved = isResolved(grid)
  let _stuck = isStuck(grid)
  if( _solved || _stuck){
    stop()
    if (_solved) {
      console.log("Done")
    } else {
      console.log("PUTINS SLEDGE HAMMER ! => BRUTEFORCING")
      const now = new Date()
        let a = new DecisionTree(getGrid())
        let b = a.resolve(0)
        setGrid(b)
        apply()
      const passed = new Date()
      console.log("Done in ", Math.abs(passed-now), "ms")
    }
  }
}

let reset = (grid, other) => {
  stop()
  let grids = init()
  setGrid(grids[0])
  setOtherGrid([1])
  draw(getContext(), getGrid())
  resetRound()
}


function apply() {
  let a = iID !== null
  myClearInterval()
  resizeCanvas(getContext(), widthSelector(), heightSelector())
  reCluster(getGrid())
  draw(getContext(), getGrid())
  if (a) {
    setIntervalID(start(determineInterval()))
  }
}

// Controller //-------------------------------------------------------------------------------------------

function start(interval) {
  let id = setInterval(() => {
    next()
  }, interval);
  return id
}

function next() {
  update(getGrid(), getOGrid())
}

function stop() {
  switch (stopButton.value) {
    case "STOP":
      stopButton.click()
      return true
      break;
    default:
      return false
  }
}

// Grid Constructor //-------------------------------------------------------------------------------------------

function create2DGRID(dimensionX, dimensionY, values) {
  if (!dimensionY) {
    dimensionY = dimensionX
  }
  let grid = []
  for (let i = 0; i < dimensionX; i++) {
    let tempGrid = []
    for (let j = 0; j < dimensionY; j++) {
      tempGrid.push(values)
    }
    grid.push(tempGrid)
  }
  return grid
}

// Canvas Interactor // -------------------------------------------------------------------------------------------

function updateCanvasSize() {
  resizeCanvas(getContext(), widthSelector(), heightSelector())
}

function getCanvas() {
  return document.getElementById("canvas")
}

function getContext() {
  return getCanvas().getContext("2d");
}

function resizeCanvas(ctx, x, y) {
  ctx.canvas.width = x
  ctx.canvas.height = y
}

function draw(ctx, grid) {
  dropCanvas(ctx)
  drawGrid(ctx, grid, ctx.canvas.width, ctx.canvas.height)
}

function random() {
  return (x, y) => {
    let seed = Math.random()
    let val = Math.round(seed)
    return (val == 1)
  }
}

function dropCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.stroke();
}

function drawGrid(ctx, grid, width, height) {
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  const resolutionX = width / grid.length;
  const resolutionY = height / grid.length;
  let drawOffset = 1;

  let flipper = false;
  grid.forEach((column, x) => {
    column.forEach((element, y) => {
      const drawLine = function(x, y, _x, _y) {
        this.moveTo(x, y);
        this.lineTo(_x, _y);
        this.stroke();
        this.moveTo(0, 0)
      }
      let root  = sqroot(grid.length)
      let superGridX = Math.floor(x / root)
      let superGridY = Math.floor(y / root)

      let left  = (superGridX % 2) == 0
      let right = (superGridY % 2) == 0

      if (left == right && x%root == 0 && y % root == 0) {
        ctx.fillStyle = "rgba(200,222,255)"
        ctx.fillRect((x * resolutionX - drawOffset), (y * resolutionY - drawOffset), resolutionX * root, resolutionY*root)
        ctx.fillStyle = "black";
      }


      if (y !== 0) {
       // drawLine.call(ctx, 0, y * resolutionY, width, y * resolutionY)
      }
      if (x !== 0) {
       // drawLine.call(ctx, x * resolutionX, 0, x * resolutionX, height)
      }

      ctx.font = "1em Arial ";
      if (element) {
        if(element.constant()) {
          ctx.fillStyle = ""
          ctx.font = "bold "+ (width / (100*root)) +"em Arial";
        } else {
          ctx.font = (width / (100*root)) +"em Arial bold";
        }

        ctx.fillText(element.show(), (x * resolutionX - drawOffset) + (resolutionX / 2) - root, (y * resolutionY - drawOffset) + resolutionY / 2 + root * root)
        ctx.fillStyle = "black"
      }
    })

  })
  ctx.moveTo(0, 0)
  ctx.stroke();
  ctx.closePath();
}

function drawCurrentField(){
    let x = selected[0]
    let y = selected[1]
    let size = gridSelector()**2
    let width = widthSelector()
    let height = heightSelector()
    const resolutionX = width / size;
    const resolutionY = height / size;
    let drawOffset = 1;
    let ctx = getContext()
    ctx.beginPath();
    ctx.globalAlpha = 0.1;
    ctx.fillRect((x * resolutionX - drawOffset), (y * resolutionY - drawOffset), resolutionX, resolutionY)
    ctx.fillStyle = "black";
    ctx.globalAlpha =1;
    ctx.moveTo(0, 0)
    ctx.stroke();
    ctx.closePath();
  }


// HTML Queries // -------------------------------------------------------------------------------------------

let keyAction = function(keyId, action) {
  this.addEventListener("keydown", (event) => {
    if (event.keyCode == keyId) {
        action()
    }
  })
}

let determineInterval = () => {
  return 1000 / refreshesSelector()
}
let fetchId = (id) => {
  return document.getElementById(id)
}
let fetchValue = (id) => {
  return fetchId(id).value
}
let widthSelector = () => {
  return fetchValue("width")
}
let heightSelector = () => {
  return fetchValue("height")
}
let refreshesSelector = () => {
  return fetchValue("cycles")
}
let gridSelector = () => {
  return fetchValue("grid-size")
}
let modifyContent = () => {
  return fetchId("enter")
}
let coordinateSelector = () => {
  return fetchId("coordinate")
}
let valueSelector = () => {
  return fetchId("change_value")
}
let newValueSelector = () => {
  return fetchValue("change_value")
}
let resetButtonSelector = () => {
  return fetchId("resetButton")
}
let stopButtonSeletor = () => {
  return fetchId("stopButton")
}
let submitinputSeletor = () => {
  return fetchId("submit_input")
}
let loadSelector = () => {
  return fetchId("load")
}
let loadValueSelector = () => {
  return fetchValue("load")
}

// Grid Helper // -------------------------------------------------------------------------------------------

let selected = [0,0]
let LEFT_KEY = 37;
let RIGHT_KEY = 39;
let UP_KEY = 38;
let DOWN_KEY = 40;

stopButtonSeletor().addEventListener("click", () => {
  let stopButton = stopButtonSeletor()
  switch (stopButton.value) {
    case "STOP":
      stopButton.value = "START"
      myClearInterval()
      break;
    case "START":
      stopButton.value = "STOP"
      setIntervalID(start(determineInterval()))
    default:
  }
})

resetButtonSelector().addEventListener("click", () => {
  reset(getGrid(), getOGrid())
})

getCanvas().addEventListener("click", (event) => {
  let width = widthSelector()
  let height = heightSelector()
  let size = gridSelector()
  size *= size
  let fieldWidth = width / size
  let fieldHeight = height / size
  let gridPosX = Math.floor(event.offsetX / fieldWidth )
  let gridPosY = Math.floor(event.offsetY / fieldHeight)
  select(gridPosX, gridPosY)
})

valueSelector().addEventListener("keydown", (event) => {
  if (event.keyCode == 13) {
    change()
  }
})



keyAction.call(window, LEFT_KEY, ()=>{
    selectNext(-1, 0)
  })
keyAction.call(window, RIGHT_KEY, ()=>{
    selectNext(1, 0)
  })
keyAction.call(window, UP_KEY, ()=>{
    selectNext(0, -1)
  })
keyAction.call(window, DOWN_KEY, ()=>{
    selectNext(0, 1)
  })

function selectNext(offsetX, offsetY) {
    let x = selected[0]
    let y = selected[1]
    let size = gridSelector()**2
    x = (x + offsetX + size) % size
    y = (y + offsetY + size) % size
    select(x,y)
}

function select(x,y){
  showInput()

  coordinateSelector().textContent= "("+x +"; " + y + ")"
  valueSelector().click()
  selected = [x, y]
  apply()
  drawCurrentField()
}

function showInput() {
  modifyContent().classList.remove("hide")
}

function hideInput(){
  modifyContent().classList.add("hide")
}

function change() {
  let newDigit = newValueSelector()
  let grid = getGrid()
  grid[selected[0]][selected[1]].setValue(parseInt(newDigit))
  setGrid(grid)
  hideInput()
  apply()
}

function newSet() {
  reset(getGrid(), getOGrid())
}

function setGrid(nGrid) {
  GRID = nGrid
}

function setOtherGrid(oGrid) {
  other = oGrid
}

function setIntervalID(id) {
  iID = id
}

function getGrid() {
  return GRID
}

function getOGrid() {
  return other
}

function getIntervalID() {
  return iID
}

function myClearInterval() {
  clearInterval(getIntervalID())
  iID = null
}

function nextRound() {
  count++;
}

function getRound() {
  return count
}

function resetRound() {
  count = 0
}

function spitout(grid) {
  if(!grid) {
    grid = getGrid()
  }
  grid = grid.map( row => row.map(cell => cell.getValue()))
  grid = realign.call(grid)

  let output = ""
  grid.forEach((row, x) => {
    output += "["
    row.forEach((item, i) => {
      output += ""+item
      if (i < (row.length-1)) {
          output += ", "
      }
    });
    if (x < (grid.length-1)) {
        output += "],\n"
    } else {
        output += "]\n"
    }
  })

  console.log("[\n"+output+"]")
}

function loadGrid(){
    let cont = loadSelector()
    cont = '{"cont": '+ cont.value +"}"
    let a = JSON.parse(cont)
    let newGrid = []
    fill.call(newGrid, gridSelector()**2, 0)
    fillGrid(newGrid, realign.call(a.cont))
    setGrid(newGrid)
    apply()
    console.log("Loading Successful")
}


// Start // -------------------------------------------------------------------------------------------

document.onkeydown = function(e) {
    switch(e.which) {
        case 37: // left
        break;

        case 38: // up
        break;

        case 39: // right
        break;

        case 40: // down
        break;
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};

SOK_NUMBERS = possible(gridSelector()**2)
let otherGrid = init()
setGrid(otherGrid[0])
setOtherGrid(otherGrid[1])
draw(getContext(), getGrid())
