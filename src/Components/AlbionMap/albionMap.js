import React from 'react';
import { Node } from "../Node/node.js"
import { Road } from "../Road/road.js"
import './albionMap.css'

export class AlbionMap extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {           
            NodeList: [               
              ],

              RoadList: [             
            ]
         };

         //this.createNewNode(650,100,"Quiitun-Duosum",0);
        this.import(); //si hya parametro en la url, importara el mapa         
          
      }

      replaceAll(string, search, replace) {
        return string.split(search).join(replace);
      }
      
    NodeChangeHandler(nodeName,newX, newY) {
        const found = this.state.NodeList.find(e => e["Node"].props.name==nodeName);     
        found["posX"] = newX;
        found["posY"] = newY;
    }

    RoadChangeHandler(fromName,toName,time,size,newX, newY) {
        var found = this.state.RoadList.find(e => (e["Road"].props.from==fromName) && (e["Road"].props.to==toName) );        
        found["posX"] = newX;
        found["posY"] = newY;
        found["time"] = time;
        found["size"] = size;

        console.log(found);
    }

  

    clickNewNode(){
        this.createNewNode(0,0,document.getElementById('nameInput').value,document.getElementById('typeSelect').value);
    }

  createNewNode(posX, posY , name, type){      

    const found = this.state.NodeList.find(e => e["Node"].props.name==name);    
    if(found){
      alert("NODE NAME ALREADY EXISTS");
      return;
    }

    var newNode = {};
    newNode["posX"] = posX;
    newNode["posY"] = posY;
    newNode["Node"] = <Node posX={posX} posY={posY} name={name} type={type} handleParentChange={this.NodeChangeHandler.bind(this)}></Node>;
    this.state.NodeList.push(newNode);
    this.forceUpdate();
  }


  clickNewRoad(){
    this.createNewRoad(0,0,this.incrementToTime(document.getElementById('timeInput').value),document.getElementById('fromInput').value,document.getElementById('toInput').value,document.getElementById('sizeSelect').value);
}

incrementToTime(increment){
    var time = new Date();
    increment = this.timeToDecimal(increment); 
    time.setSeconds(time.getSeconds() + increment);
    return time;
}

  createNewRoad(posX, posY, time, from,to, size){

    var found = this.state.RoadList.find(e => (e["Road"].props.from==from && e["Road"].props.to==to));    
    if(found){
      alert("ROAD ALREADY EXISTS");
      return;
    }
    found = this.state.RoadList.find(e => (e["Road"].props.from==to && e["Road"].props.to==from));    
    if(found){
      alert("ROAD ALREADY EXISTS");
      return;
    }

      var newRoad = {};
      newRoad["posX"] = posX;
      newRoad["posY"] = posY;     
      newRoad["size"] = size; 

    newRoad["time"] = time.getTime();
    newRoad["Road"] = <Road size={size} from={from} to={to} time={time.getTime()} posX={posX} posY={posY} handleParentChange={this.RoadChangeHandler.bind(this)} ></Road>
    this.state.RoadList.push(newRoad);
    this.forceUpdate();
  }

  timeToDecimal(t) {
    t = t.split(':');    
    return parseInt(t[0], 10)*3600 + parseInt(t[1], 10)*60;
  }  

  
  export(){ 

    var firstparturl = window.location.href.split('&urlcode=')[0]; 

    var url = firstparturl + "&urlcode=" + JSON.stringify(this.state);
navigator.clipboard.writeText(url).then(function() { 
  console.log("OK");
}, function(err) {
  console.error('Async: Could not copy text: ', err);
});

    //document.getElementById('importTxt').value = JSON.stringify(this.state);
  }

  import(){
   
      //var newState = JSON.parse(document.getElementById('importTxt').value);

      var urlparam = window.location.href.split('urlcode=')[1];
          if(urlparam){
            if(urlparam){
              urlparam = this.replaceAll(urlparam,'%7B','{');
              urlparam = this.replaceAll(urlparam,'%7D','}');
              urlparam = this.replaceAll(urlparam,'%22','"');
            }
          }else{
            return;
          }
          console.log(urlparam);
          var newState = JSON.parse(urlparam);
      
      newState["NodeList"].forEach(e => {
        console.log()
        if(e["posX"]>-999){
          this.createNewNode(e["posX"],e["posY"],e["Node"]["props"]["name"],e["Node"]["props"]["type"]);
        }
        
      } );

      
      newState["RoadList"].forEach(e => {

        if(e["size"]>0){
          this.createNewRoad(e["posX"],e["posY"],new Date(e["time"]),e["Road"]["props"]["from"],e["Road"]["props"]["to"],e["size"]);
        }
        
     
      } );
      


      //this.state.RoadList = newState["RoadList"];
      //this.forceUpdate();
  }


    render() {     

        return (            
            <div>
              <span className="left">3</span>
                
                <button onClick={()=>this.clickNewNode()}>CreateNode</button>
                name:<input id="nameInput"></input>      

                <select id="typeSelect" name="select">
                <option value="0" >Home</option> 
                <option value="1" selected>Road</option> 
                <option value="2">Road (with hideouts)</option>
                <option value="3">Blue</option>
                <option value="4">Yellow</option>
                <option value="5">Red</option>
                <option value="6">Black</option>
                <option value="7">Undefined</option>                
                </select>
                <p></p>
                <button onClick={()=>this.clickNewRoad()}>CreateRoad</button>
                <select id="sizeSelect" name="select">
                <option value="2">2</option> 
                <option value="7" selected>7</option>
                <option value="20">20</option>          
                </select>
                from:<input id="fromInput"></input>      
                to:<input id="toInput"></input>   
                time:<input id="timeInput"></input>  
                
              <p>

              </p>
              <button onClick={()=>this.export()}>Export</button>
               

                {this.state.NodeList.map(node => node["Node"])}    
                {this.state.RoadList.map(road => road["Road"])}
             

            </div>          
        );
    }
}

