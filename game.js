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

    //for having the history of of the movement
    //so that we can do undo and redo later...
    movesHistory :[],
    historyIndex :-1,

    //for stating the circuit which are unlocked
    unlockedCircuits : [3],

    //for the time and time for each round
    timers : {
        overAllTime :360,
        eachTurn :15,
    },

    //used during the movement phase
    selectedTitan : null,
    //scores of the players
    scores :{
        red :0, blue :0
    },

    //if the game is over then to restart or what ??
    isGameOver : false,
    winner :null
};

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
    gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'blue' : 'red';
}

//for the completion of placement phase..
function allPlaced(){
    const redPlaced = gameState.titans.red.every((t) => t.placed);
    const bluePlaced = gameState.titans.blue.every((t) => t.placed);

    return redPlaced && bluePlaced;
}

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
  console.log('🎮 Game initialized!');
  
  // Show initial state
  debugState();
  
  // Setup event listeners
  setupEventListeners();
  
  // Update UI to show current player
  updateUI();
  
  console.log('✅ Ready to play!');
}

/**
 * Update UI elements (scores, current player, etc.)
 */
function updateUI() {
  // We'll implement this properly later
  // For now, just log
  console.log(`Current turn: ${gameState.currentPlayer.toUpperCase()}`);
}

// Start game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure board.js has finished
  setTimeout(initGame, 200);
});

function handlePlacementClick(nodeId) {
  console.log('🎯 Placement phase - clicked node:', nodeId);
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


function handleNodeClick(event){
    const clickedElement = event.target;

    if(!clickedElement.classList.contains('node')) return;

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


function setupEventListeners(){
    const board =document.querySelector('.board');

    board.addEventListener('click',handleNodeClick);
    console.log("event listner is beed setuped..")
}

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

function getAdjacentNodes(nodeId){
    const adjacentNodes =[]

    edges.forEach((edge) =>{
        if(edge.node1 === nodeId){
            adjacentNodes.push(edge.node2);
        }
        else if(edge.node2 === nodeId){
            adjacentNodes.push(edge.node2);
        }
    });

    return adjacentNodes;
}

function possibleMoves(nodeId){
    const adjacentNodes =getAdjacentNodes(nodeId);
    const moves =[]

    adjacentNodes.forEach((adjNodeId) => {
        if(isNodeEmpty(adjNodeIdnodeId)){
            const node = getNodeElement(adjNodeIdnodeId);
            node.classList.add('possible-moves');
            moves.push(adjNodeId)
        }
    });

    return moves;
}

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


/**
 * Handle click during movement phase
 */
function handleMovementClick(nodeId) {
    console.log('👟 Movement phase - clicked node:', nodeId);
    const clickedTitan = getTitanById(nodeId);
    
    if( clickedTitan && clickedTitan.player === gameState.currentPlayer){
        gameState.selectedTitan =clickedTitan;
        highlightTitan(nodeId);
        possibleMoves(nodeId);
    }
    else if(gameState.selectedTitan && validPossibleMove(gameState.selectedTitan.nodeId,nodeId)){

        const titanToMove =getTitanById(gameState.selectedTitan.id);
        const oldPosition = titanToMove.nodeId;
        updateVisual(oldPosition,null);

        titanToMove.nodeId = nodeId;

        updateVisual(nodeId,gameState.selectedTitan.player);

        clearHighlights();

        switchPlayer();
    }
    else{
        console.log(`Invalid move..`)
        gameState.selectedTitan = null;
        clearHighlights();
    }
  
  // TODO: Implement movement logic in Phase 4
}