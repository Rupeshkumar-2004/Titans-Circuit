
function makeBoard(){
    const svg =document.getElementsByClassName('board')[0];
    svg.setAttribute("viewBox", "-250 -270 500 540");// for alligning to centre
    
    let centreX =0;
    let centreY =0;

    //tracking the nodes with co-ordinates
    let nodes =[];

    //these are the connecting edges-----
    const connected =[["01","07"],["03","09"],["05","11"],
                      ["08","14"],["10","16"],["12","18"]];
    
    //this function is for generating the nodes co-ordinates
    function generateNodes() {
          const nodes = [];
          let idCounter = 1;

          //for the 3 heagonal rings (an array of objects)
          const rings = [
            { ring: 1, radius: 50, count : 6},
            { ring: 2, radius: 90, count : 6},
            { ring: 3, radius: 120, count : 6}
          ];
          
          //applying for each and making node for that and 
          //deducing the co-ordinate points 
          rings.forEach(({ ring, radius, count }) => {
            const step = (2 * Math.PI) / count;
          
            for (let i = 0; i < 6; i++) {
              const angle = i * step;
            
              const x = centreX + radius * Math.cos(angle);
              const y = centreY + radius * Math.sin(angle);
              /*
                Node Structure
                id:
                ring index:
                index:
                x:
                y:
              */
              nodes.push({
                id: String(idCounter).padStart(2, "0"),//coverting it to string
                ring,
                index: idCounter,
                x,
                y
              });
            
              idCounter++;
            }
          });
        
          return nodes;
    }       

    //generated all the 18 nodes
    nodes =generateNodes();

    //for making the line between two points and 
    //adding weight to it
    function makeLine(point1,point2,weight){
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");

      line.setAttribute("x1",point1.x);
      line.setAttribute("y1",point1.y);
      line.setAttribute("x2",point2.x);
      line.setAttribute("y2",point2.y);
      line.setAttribute("class","edge");
      line.setAttribute("stroke", "#0f172a");
      line.setAttribute("stroke-width", "2");

      svg.appendChild(line);

      //finding position to add weight text 
      const midX = (point1.x+point2.x)/2;
      const midY = (point1.y+point2.y)/2;
      const textWeight = document.createElementNS("http://www.w3.org/2000/svg","text");
      textWeight.setAttribute("x",midX);
      textWeight.setAttribute("y",midY);
      textWeight.textContent = weight;
      svg.appendChild(textWeight);
    }

    //for making the node on the given points 
    function makeNode(nodes){
      const circle =document.createElementNS("http://www.w3.org/2000/svg","circle");
      circle.setAttribute("cx",nodes.x);
      circle.setAttribute("cy",nodes.y);
      circle.setAttribute("r",5);
      circle.setAttribute("class", "node");

      //for selecting the specific node assigning then with 
      //their respective ids
      circle.setAttribute("data-node-id",nodes.id);
      circle.setAttribute("data-ring",nodes.ring);
      svg.appendChild(circle)
    }

    //getting the nth node in the node array
    const getNthNode = (id) =>{
      return nodes.find(n => n.id === id);
    }

    //making the line as closing loop or ring at each level or ring level
    function makeRing(startNode,weights){
        for(let i =0;i<6;i++){
          let currentNode =String(startNode+i).padStart(2,"0");//because it accpets string
          let nextNode =String(startNode+((i+1)%6)).padStart(2,"0");

          makeLine(getNthNode(currentNode),getNthNode(nextNode),weights[i]);
        }
        
    }

    makeRing(1,["9","8","8","9","8","8"]);
    makeRing(7,["4","6","5","4","6","5"]);
    makeRing(13,["2","1","2","3","1","1"]);

    //as the diagram suggested connecting the rings at specfic position
    connected.forEach(([node1,node2]) =>{
        makeLine(getNthNode(node1),getNthNode(node2),"1")
    });

    //calling the make node function for each node..
    nodes.forEach((nodes) => makeNode(nodes));

    return nodes;
}   

let boardNodes; // Declare first

document.addEventListener('DOMContentLoaded', () => {
  boardNodes = makeBoard();
  console.log('✅ Board rendered with', boardNodes.length, 'nodes');
});