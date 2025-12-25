//intial game setup..
const gameState ={
    //it is a placement phase or movement phase
    phase : 'placement',

    //intially its that red will start the game
    currentPlayer : 'red',

    //for traversing around the titans the player had
    titans : {
        red: [
          { id: 'red1', nodeId: null, placed: false },
          { id: 'red2', nodeId: null, placed: false },
          { id: 'red3', nodeId: null, placed: false },
          { id: 'red4', nodeId: null, placed: false }
        ],
        blue: [
          { id: 'blue1', nodeId: null, placed: false },
          { id: 'blue2', nodeId: null, placed: false },
          { id: 'blue3', nodeId: null, placed: false },
          { id: 'blue4', nodeId: null, placed: false }
        ]
    },

    //for stating the circuit which are unlocked
    unlockedCircuits : [3],

    //for the time and time for each round
    timers : {
        overAllTime :360,
        eachTurn :15,
        currentTurnTime :15
    },

    //used during the movement phase
    selectedTitan : null,
    //scores of the players
    scores :{
        red :0, blue :0
    },

    //if the game is over then to restart or what ??
    isGameOver : false,
    winner :null,

    //for the control on the flow of teh game
    isGameActive : false,
    isPaused : false,
};

//for recording the time interval
let gameInterval = null;

// Graph structure - all edges with weights
const edges = [
  // Inner ring (ring 1)
  { node1: '01', node2: '02', weight: 9 },
  { node1: '02', node2: '03', weight: 8 },
  { node1: '03', node2: '04', weight: 8 },
  { node1: '04', node2: '05', weight: 9 },
  { node1: '05', node2: '06', weight: 8 },
  { node1: '06', node2: '01', weight: 8 },
  
  // Middle ring (ring 2)
  { node1: '07', node2: '08', weight: 4 },
  { node1: '08', node2: '09', weight: 6 },
  { node1: '09', node2: '10', weight: 5 },
  { node1: '10', node2: '11', weight: 4 },
  { node1: '11', node2: '12', weight: 6 },
  { node1: '12', node2: '07', weight: 5 },
  
  // Outer ring (ring 3)
  { node1: '13', node2: '14', weight: 2 },
  { node1: '14', node2: '15', weight: 1 },
  { node1: '15', node2: '16', weight: 2 },
  { node1: '16', node2: '17', weight: 3 },
  { node1: '17', node2: '18', weight: 1 },
  { node1: '18', node2: '13', weight: 1 },
  
  // Connecting edges (between rings)
  { node1: '01', node2: '07', weight: 1 },
  { node1: '03', node2: '09', weight: 1 },
  { node1: '05', node2: '11', weight: 1 },
  { node1: '08', node2: '14', weight: 1 },
  { node1: '10', node2: '16', weight: 1 },
  { node1: '12', node2: '18', weight: 1 }
];

//To start the game when clicked on the start button
function startGame(){
    if(gameState.isGameActive) return;

    console.log("Let The Game begin !!!")
    gameState.isGameActive = true;
    gameState.isPaused =false;

    gameInterval =setInterval(startTimer,1000);

    document.getElementById('start-btn').disabled = true;
    document.getElementById('pause-btn').disabled = false;
    document.getElementById('reset-btn').disabled = false;
    
}

//to pause the game when clciked and have a resume button on that to resume 
function pauseGame(){
    if(!gameState.isGameActive || gameState.isPaused) return;

    console.log("Game is Paused")
    gameState.isPaused = true;
    clearInterval(gameInterval);

    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('resume-btn').style.display = 'inline-block';

}

// function to resume the game ..
function resumeGame() {
    if (!gameState.isGameActive || !gameState.isPaused) return;

    console.log("Game Resumed");
    gameState.isPaused = false;
    gameInterval = setInterval(startTimer, 1000); // Restart timer
    
    // Update Buttons UI: Show Pause, Hide Resume
    document.getElementById('pause-btn').style.display = 'inline-block';
    document.getElementById('resume-btn').style.display = 'none';
}

//function to reset the game..
function resetGame(){
    const confirmReset = confirm("Are you sure you need to restart the game?");
    if(!confirmReset) return;

    clearInterval(gameInterval);
    gameState.isGameActive = false;
    gameState.isGameOver = false;
    gameState.isPaused = false;

    gameState.phase = 'placement';
    gameState.currentPlayer = 'red';
    gameState.unlockedCircuits =[3];
    gameState.scores = { red: 0, blue: 0 };
    gameState.timers.overAllTime = 360;
    gameState.timers.currentTurnTime = 15; // Reset turn timer
    
    // Reset Titans State
    gameState.titans.red.forEach(t => { t.placed = false; t.nodeId = null; });
    gameState.titans.blue.forEach(t => { t.placed = false; t.nodeId = null; });

    // Reset Visuals
    // 1. Remove all titan classes from board
    document.querySelectorAll('.node').forEach(node => {
        node.classList.remove('red-titan', 'blue-titan', 'selected', 'possible-move');
    });
    // 2. Reset Buttons
    document.getElementById('start-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
    document.getElementById('pause-btn').style.display = 'inline-block';
    document.getElementById('resume-btn').style.display = 'none';
    
    // 3. Reset UI Displays
    updateScoreDisplay();
    updateTimerDisplay(); // Ensure this function exists from previous steps

}

//get a specific titan for the player
function getTitan(player){
    return gameState.titans[player];
}

//finding the titans which are not placed
function getUnplacedTitan(player){
    return gameState.titans[player].filter((titans) =>{
        return !titans.placed;
    });
}

//getting the specfic titan
function getTitanById(titan){
    const player =titan.startsWith('red')? 'red':'blue';
    return gameState.titans[player].find((t) =>{
        return t.id === titan;
    });
}

//checking whether there is a titan at a particular node
function titanAtANode(node){
    for(let titan of gameState.titans.red){
        if(titan.nodeId === node){
            return {...titan};
        }
    }

    for(let titan of gameState.titans.blue){
        if(titan.nodeId === node){
            return {...titan};
        }
    }
    return null;
}

//return whether a titan is there or not..
function isNodeEmpty(node){
    return titanAtANode(node) === null;
}

//for stwiching the player after each turn
function switchPlayer(){
    gameState.timers.currentTurnTime = gameState.timers.eachTurn;
    gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'blue' : 'red';
    
    // Update the visual indicator
    const indicator = document.getElementById('turn-indicator');
    if(indicator) {
        indicator.innerText = `${gameState.currentPlayer.toUpperCase()}'S TURN`;
        // Change background color based on player
        indicator.style.backgroundColor = gameState.currentPlayer === 'red' ? '#ef4444' : '#3b82f6';
    }
    
    updateTimerDisplay(); // Snap timer back to 15 immediately
}

//for the completion of placement phase..
function allPlaced(){
    const redPlaced = gameState.titans.red.every((t) => t.placed);
    const bluePlaced = gameState.titans.blue.every((t) => t.placed);

    return redPlaced && bluePlaced;
}

//for debugging the game..
function debugState() {
  console.log('=== GAME STATE ===');
  console.log('Phase:', gameState.phase);
  console.log('Current Player:', gameState.currentPlayer);
  console.log('Scores:', gameState.scores);
  console.log('Unlocked Circuits:', gameState.unlockedCircuits);
  console.log('Red Titans:', gameState.titans.red);
  console.log('Blue Titans:', gameState.titans.blue);
  console.log('==================');
}

//--------------------------------------------------------------------------------------------------------------------------
//function to get the specfic node in the game
function getNodeElement(nodeId){
    return document.querySelector(`[data-node-id="${nodeId}"]`);
}

//fetching the node data of the node that is the id
function getNodeData(nodeId){
    return boardNodes.find(node => node.id === nodeId);
}

//when a player clicks on the node the to update the node like
//removing the ownership of the player from the node and all
function updateVisual(nodeId , player){
    const circle =getNodeElement(nodeId);
    if(!circle) return;

    circle.classList.remove('red-titan', 'blue-titan', 'selected', 'possible-move');

    if(player){
        circle.classList.add(`${player}-titan`);
    }
}


//checks the current circuit is full or not
function isCircuitFull(nodeRing){
    const nodeInRing = boardNodes.filter(n => n.ring === nodeRing);

    const occupiedNodes =nodeInRing.filter(nodes => !isNodeEmpty(nodes.id)).length;

    return occupiedNodes === 6;
}

//if an circuit is full the it will trigger this function that unnlocks the new level
function unlockNewCircuits(){
    const lastUnlocked =Math.min(...gameState.unlockedCircuits);

    if(lastUnlocked >1){
        const nextCircuit = lastUnlocked -1;
        gameState.unlockedCircuits.push(nextCircuit);
    }
    
    return;
}

// from here implementing the event listener

function initGame() {
  console.log('Game initialized!');
  
  // Show initial state
  debugState();
  
  // Setup event listeners
  setupEventListeners();
  

  updateTimerDisplay();
  console.log('Ready to play!');
}



// Start game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure board.js has finished
  setTimeout(initGame, 200);
});

//when a player select his titan then highlight the titan 
function highlightTitan(nodeId){
    document.querySelectorAll('.node').forEach((node) =>{
        node.classList.remove('selected');
    })

    const circle =getNodeElement(nodeId);
    if(circle){
        circle.classList.add('selected');
    }
}

//removing highlights from the remaining nodes
function clearHighlights(){
    document.querySelectorAll('.node').forEach( node => {
        node.classList.remove('selected','possible-move');
    });
}

// returns the adjacentNodes of a particular node
function getAdjacentNodes(nodeId){
    const adjacentNodes =[]

    edges.forEach((edge) =>{
        if(edge.node1 === nodeId){
            adjacentNodes.push(edge.node2);
        }
        else if(edge.node2 === nodeId){
            adjacentNodes.push(edge.node1);
        }
    });

    return adjacentNodes;
}

//hightlights the possible moves for a particular node
function possibleMoves(nodeId){
    const adjacentNodes =getAdjacentNodes(nodeId);
    const moves =[]

    adjacentNodes.forEach((adjNodeId) => {
        if(isNodeEmpty(adjNodeId)){
            const node = getNodeElement(adjNodeId);
            node.classList.add('possible-move');
            moves.push(adjNodeId)
        }
    });

    return moves;
}

//checks if a node is valid or not to move ??
function validPossibleMove(fromNode,toNode){
    const adjacent = getAdjacentNodes(fromNode);

    if(!adjacent.includes(toNode)){
        return false;
    }
    if(!isNodeEmpty(toNode)){
        return false;
    }

    return true;
}


//Now its about score system 

//checking which player has dominated which edge
function checkEdgeDominance(node1 , node2){
    const titan1 =titanAtANode(node1);
    const titan2 =titanAtANode(node2);

    if(!titan1 || !titan2){
        return;
    }

    const titanPlayer1 =titan1.id.startsWith('red') ? 'red' : 'blue';
    const titanplayer2 =titan2.id.startsWith('red') ? 'red': 'blue';

    if(titanPlayer1 === titanplayer2){
        return titanplayer2;
    }

    return null;
}

// updating the score in the gameState or the global variable.. 
function updateScore(){
    let redScore =0;
    let blueScore =0;

    edges.forEach((edge) =>{
        if(checkEdgeDominance(edge.node1,edge.node2) === 'red'){
            redScore +=edge.weight;
        }
        else if(checkEdgeDominance(edge.node1,edge.node2) === 'blue'){
            blueScore +=edge.weight;
        }
    });

    gameState.scores.red = redScore;
    gameState.scores.blue =blueScore;

    updateScoreDisplay();

    console.log('current score',gameState.scores);
}

//reflecting the changes into the html span element..
function updateScoreDisplay(){
    const redScoreElement = document.querySelector('.red-score');
    const blueScoreElement = document.querySelector('.blue-score');

    if(redScoreElement){
        redScoreElement.textContent = gameState.scores.red;
    }

    if(blueScoreElement){
        blueScoreElement.textContent = gameState.scores.blue;
    }

    console.log(` Red ${gameState.scores.red} | Blue ${gameState.scores.blue}`);
}

/**
 * Handle click during movement phase
 */
function handleMovementClick(nodeId) {
    console.log('Movement phase - clicked node:', nodeId);
    const clickedTitan =titanAtANode(nodeId);

    //this done because clicked titan donesn't have player datatype..
    const titanPlayer = clickedTitan ? (clickedTitan.id.startsWith('red')? 'red' : 'blue'): null;
    
    //Case 1: Its a player turn and he clicked his titan 
    if( clickedTitan && titanPlayer === gameState.currentPlayer){
        //clear the previos node effects
        clearHighlights();
        //update the selected titan
        gameState.selectedTitan =clickedTitan;
        highlightTitan(nodeId);
        //hightlight its possible moves.
        possibleMoves(nodeId);
    }

    //Case 2: Its a players turn and his moves his titan..
    //check the move is valid or not
    else if(gameState.selectedTitan && validPossibleMove(gameState.selectedTitan.nodeId,nodeId)){

        // getting the element node of the selected titan 
        const titanToMove =getTitanById(gameState.selectedTitan.id);
        const oldPosition = titanToMove.nodeId;
        //kindoff clearing the hightlights
        updateVisual(oldPosition,null);

        //updating the selected titans node.. 
        titanToMove.nodeId = nodeId;

        //assigning the node with the respective player color
        const selectedTitanPlayer = gameState.selectedTitan.id.startsWith('red') ? 'red' : 'blue';
        
        updateVisual(nodeId, selectedTitanPlayer);
        isTitanEliminated();
        updateScore();

        checkGameEnd();
        //clearing the highlights..
        clearHighlights();

        switchPlayer();
    }
    //Case 3 : If the players clicks other than these then reset it 
    else{
        console.log(`Invalid move..`)
        gameState.selectedTitan = null;
        clearHighlights();
    }
}

//event listener for the click on the board..
function setupEventListeners(){
    const board =document.querySelector('.board');

    board.addEventListener('click',handleNodeClick);
    console.log("event listner is beed setuped..")
}

//handleing the placement phase of the game
function handlePlacementClick(nodeId) {
  console.log(' Placement phase - clicked node:', nodeId);
  const nodeData = getNodeData(nodeId);
  const nodeRing = nodeData.ring;


  
  // TODO: Implement placement logic in Phase 3
  if(!gameState.unlockedCircuits.includes(nodeRing)){
    console.log("The circuit is locked !!");
    return;
  }

  if(!isNodeEmpty(nodeId)){
    console.log("A titan is placed here");
    return;
  }

  const noOfUnplacedtitans = getUnplacedTitan(gameState.currentPlayer);
  if(noOfUnplacedtitans.length === 0){
    console.log("No more titansn are left to place")
    return;
  }
  
  noOfUnplacedtitans[0].nodeId = nodeId;
  noOfUnplacedtitans[0].placed = true;

  // For now, just test visual feedback:
  updateVisual(nodeId, gameState.currentPlayer);
  updateScore();

  if(isCircuitFull(nodeRing)){
    console.log("Lets move to the next circuits !!");
    unlockNewCircuits();
  }

  if(allPlaced()){
    gameState.phase = 'movement';
    return;
  }

  switchPlayer();
}

//function handles the click and decide how will it proceed futher in phase
function handleNodeClick(event){

    if(!gameState.isGameActive || gameState.isPaused || gameState.isGameOver){
        return;
    }
    const clickedElement = event.target;

    if(!clickedElement.classList.contains('node')) return;

    if(gameState.isGameOver){
        console.log("Game Over!!!!");
        return;
    }

    const nodeId = clickedElement.getAttribute('data-node-id');

    console.log('Clicked node:', nodeId);
    console.log('Current phase:', gameState.phase);
    console.log('Current player:', gameState.currentPlayer);

    if(gameState.phase === 'placement') {
        handlePlacementClick(nodeId);
    } else if(gameState.phase === 'movement') {
        handleMovementClick(nodeId);
    }

}


//Logic for EndGame

//checks whether the innemost circuit is full or not
function checkGameEnd(){
    if(isCircuitFull(1)){
        endGame();
        return true;
    }
    return false;
}

//decides the winner and reflects in the UI.
function endGame(){
    clearInterval(gameInterval);
    gameState.isGameOver = true;
    gameState.isGameActive = false;

    // Determine winner logic... (Keep your existing logic)
    
    // Show Modal
    const modal = document.getElementById('game-over-modal');
    const winnerText = document.getElementById('winner-text');
    
    document.getElementById('final-red').innerText = gameState.scores.red;
    document.getElementById('final-blue').innerText = gameState.scores.blue;

    if (gameState.scores.red > gameState.scores.blue) {
        winnerText.innerText = "RED WINS!";
        winnerText.style.color = "#ef4444";
    } else if (gameState.scores.blue > gameState.scores.red) {
        winnerText.innerText = "BLUE WINS!";
        winnerText.style.color = "#3b82f6";
    } else {
        winnerText.innerText = "DRAW!";
        winnerText.style.color = "#333";
    }

    modal.classList.remove('hidden');
}

//titan elemination

//check if there is any titan which is been elimated
function isTitanEliminated(){
    gameState.titans.red.forEach((titan) =>{
        const adjacent =getAdjacentNodes(titan.nodeId);
        let neighbourEnemies =0;
        adjacent.forEach((node) =>{
            const checkNeighbour =getNodeElement(node);
            if(checkNeighbour.classList.contains('blue-titan')){
                neighbourEnemies++;
            }
        })

        if(neighbourEnemies === 3){
            eliminateTitan(titan, 'red');
        }
    });

    gameState.titans.blue.forEach((titan) =>{
        const adjacent =getAdjacentNodes(titan.nodeId);
        let neighbourEnemies =0;
        adjacent.forEach((node) =>{
            const checkNeighbour =getNodeElement(node);
            if(checkNeighbour.classList.contains('red-titan')){
                neighbourEnemies++;
            }
        })

        if(neighbourEnemies === 3){
            eliminateTitan(titan , 'blue');
        }
    });
}

//if yes for the previous function then remove all the properties of the node
function eliminateTitan(titan, owner){
    console.log(`Eliminating ${titan.id} belong to ${owner}`);

    const node =getNodeElement(titan.nodeId);
    node.classList.remove('blue-titan','red-titan');
    titan.placed = null;
    titan.nodeId = null;

    updateScore();
}


//Time logic

//starts the timer...
function startTimer(){
    gameState.timers.overAllTime--;
    gameState.timers.currentTurnTime--;

    updateTimerDisplay();

    if(gameState.timers.currentTurnTime === 0){
        switchPlayer();
    }
    else if(gameState.timers.overAllTime === 0){
        endGame();
    }
}

//update the timer in the display or in the browser..
function updateTimerDisplay(){
    const turnTime  = document.getElementById('turn-time');
    const gameTime  = document.getElementById('game-time');

    if(turnTime){
        turnTime.innerText = gameState.timers.currentTurnTime;

        turnTime.style.color = gameState.timers.currentTurnTime <=5 ? 'red' : 'black';
    }

    if(gameTime){

        const min = Math.floor(gameState.timers.overAllTime/60);
        const secs =gameState.timers.overAllTime%60;
        gameTime.innerText = `${min}:${secs.toString().padStart(2,'0')}`;
    }
}
