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
    unlockedCircuit : [3],

    //for the time and time for each round
    timers : {
        overAllTime :360,
        eachTurn :15,
    },

    //scores of the players
    scores :{
        red :0, blue :0
    },

    //if the game is over then to restart or what ??
    isGameOver : false,
    winner :null
};

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
function getNodeElement(nodeId){
    return document.querySelector(`[data-node-id="${nodeId}"]`);
}

function getNodeData(nodeId){
    return boardNodes.find(node => node.id === nodeId);
}

function updateVisual(nodeId , player){
    const circle =getNodeElement(nodeId);
    if(!circle) return;

    circle.classList.remove('red-titan', 'blue-titan', 'selected');

    if(player){
        circle.classList.add(`${player}-titan`);
    }
}

function highlightTitan(nodeId){
    document.querySelectorAll('.node').forEach((node) =>{
        node.classList.remove('selected');
    })

    const circle =getNodeElement(nodeId);
    if(circle){
        circle.classList.add('selected');
    }
}

function clearHighlights(){
    document.querySelectorAll('.node').forEach( node => {
        node.classList.remove('selected');
    });
}


// from here implementing the event listener

// ============================================
// INITIALIZATION
// ============================================

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
  setTimeout(initGame, 100);
});

function handlePlacementClick(nodeId) {
  console.log('🎯 Placement phase - clicked node:', nodeId);
  console.log('Node data:', getNodeData(nodeId));
  console.log('Node ring:', getNodeElement(nodeId).getAttribute('data-ring'));
  
  // TODO: Implement placement logic in Phase 3
  
  // For now, just test visual feedback:
  updateVisual(nodeId, gameState.currentPlayer);
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



/**
 * Handle click during movement phase
 */
function handleMovementClick(nodeId) {
  console.log('👟 Movement phase - clicked node:', nodeId);
  
  // TODO: Implement movement logic in Phase 4
}