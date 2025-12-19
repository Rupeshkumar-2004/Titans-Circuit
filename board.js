function makeBoard(){
    const svg =document.getElementsByClassName('board')[0];
    svg.setAttribute("viewBox", "-250 -270 500 540");
    let centreX =0;
    let centreY =0;

    let nodes =[];

    //these are the connectting edges-----
    const connected =[["01","07"],["03","09"],["05","11"],
                      ["08","14"],["10","16"],["12","18"]];
    

    function generateNodes() {
          const nodes = [];
          let idCounter = 1;

          const rings = [
            { ring: 1, radius: 100, count : 6},
            { ring: 2, radius: 180, count : 6},
            { ring: 3, radius: 260, count : 6}
          ];
        
          rings.forEach(({ ring, radius, count }) => {
            const step = (2 * Math.PI) / count;
          
            for (let i = 0; i < 6; i++) {
              const angle = i * step;
            
              const x = centreX + radius * Math.cos(angle);
              const y = centreY + radius * Math.sin(angle);
            
              nodes.push({
                id: String(idCounter).padStart(2, "0"),
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

    nodes =generateNodes();

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

      const midX = (point1.x+point2.x)/2;
      const midY = (point1.y+point2.y)/2;
      const textWeight = document.createElementNS("http://www.w3.org/2000/svg","text");
      textWeight.setAttribute("x",midX);
      textWeight.setAttribute("y",midY);
      textWeight.textContent = weight;
      svg.appendChild(textWeight);
    }

    function makeNode(nodes){
      const circle =document.createElementNS("http://www.w3.org/2000/svg","circle");
      circle.setAttribute("cx",nodes.x);
      circle.setAttribute("cy",nodes.y);
      circle.setAttribute("r",15);
      circle.setAttribute("class", "node");
      svg.appendChild(circle)
    }

    const getNthNode = (id) =>{
      return nodes.find(n => n.id === id);
    }

    function makeRing(startNode,weights){
        for(let i =0;i<6;i++){
          let currentNode =String(startNode+i).padStart(2,"0");
          let nextNode =String(startNode+((i+1)%6)).padStart(2,"0");

          makeLine(getNthNode(currentNode),getNthNode(nextNode),weights[i]);
        }
        
    }

    makeRing(1,["9","8","8","9","8","8"]);
    makeRing(7,["4","6","5","4","6","5"]);
    makeRing(13,["2","1","2","3","1","1"]);

    connected.forEach(([node1,node2]) =>{
        makeLine(getNthNode(node1),getNthNode(node2),"1")
    });

    nodes.forEach((nodes) => makeNode(nodes));

}   

makeBoard();