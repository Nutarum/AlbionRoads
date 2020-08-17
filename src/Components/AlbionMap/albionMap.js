import React from 'react';
import { Node } from "../Node/node.js"
import { Road } from "../Road/road.js"
import './albionMap.css'

export class AlbionMap extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {       
            newRoad: "",    
            NodeList: [               
              ],

              RoadList: [             
            ]
         };

      
          
      }

      componentDidMount() {
        this.import(); //si hya parametro en la url, importara el mapa         
      }

      replaceAll(string, search, replace) {
        return string.split(search).join(replace);
      }
      
    NodeChangeHandler(nodeName,newX, newY,newmaptype) {
        const found = this.state.NodeList.find(e => e["name"]==nodeName);     
        found["posX"] = newX;
        found["posY"] = newY;
        found["maptype"] = newmaptype;

        this.forceUpdate();
    }

    handleDeleteNode(nodeName){
      const found = this.state.NodeList.find(e => e["name"]==nodeName);     
      found["name"] = "";
      this.forceUpdate();
    }

    handleDeleteRoad(fromName,toName){
      var found = this.state.RoadList.find(e => (e["from"]==fromName) && (e["to"]==toName) );        
      found["from"] = "";
      this.forceUpdate();
    }

    RoadChangeHandler(fromName,toName,time, size) {
        var found = this.state.RoadList.find(e => (e["from"]==fromName) && (e["to"]==toName) );      
        found["time"] = time;
        found["size"] = size;

        this.forceUpdate();
    }

    clickNewNode(){
        this.createNewNode(0,0,document.getElementById('nameInput').value,document.getElementById('maptypeSelect').value);
    }

  createNewNode(posX, posY , name, maptype){ 
    
    if(name==""){
      return;
    }

    const found = this.state.NodeList.find(e => e["name"]==name);    
    if(found){
      alert("NODE NAME ALREADY EXISTS");
      return;
    }

    var newNode = {};
    newNode["posX"] = posX;
    newNode["posY"] = posY;
    newNode["maptype"] = maptype;
    newNode["name"] = name;
    this.state.NodeList.push(newNode);
    this.forceUpdate();
  }

  handleClickNewRoad(name){
    if(this.state.newRoad==""){
      this.state.newRoad=name;
     
    }else{
      this.createNewRoad(new Date(0),this.state.newRoad,name,7); //el time 0 se pondra como un NAN
      this.state.newRoad="";
   }
   this.forceUpdate();
  }


incrementToTime(increment){
    var time = new Date();
    increment = this.timeToDecimal(increment); 
    time.setSeconds(time.getSeconds() + increment);
    return time;
}

  createNewRoad(time, from,to, size){

    if(from=="" || to==""){
      return;
    }

    if(from==to){
      alert("Error: Cant create a road from a map to itself.");
      return;
    }

    var found = this.state.RoadList.find(e => (e["from"]==from && e["to"]==to));    
    if(found){
      alert("Error: This road already exists.");
      return;
    }
    found = this.state.RoadList.find(e => (e["from"]==to && e["to"]==from));    
    if(found){
      alert("Error: This road already exists.");
      return;
    }
    if(!this.state.NodeList.find(e => e["name"]==from) || !this.state.NodeList.find(e => e["name"]==to)){
      alert("Error: One of the connection ('from' or 'to') doesnt exists.");
      return;
    }

      var newRoad = {};    
      newRoad["size"] = size; 
      if(time.getTime()!=0){ //si la fecha no es nula (fecha 0)
        newRoad["time"] = time.getTime();
      }else{
        newRoad["time"] = "a"; //para que salga NAN
      }        

      newRoad["from"] = from; 
      newRoad["to"] = to; 

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

    var tinyurllink = "https://tinyurl.com/api-create.php?url="+url;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", tinyurllink, false ); // false for synchronous request
    xmlHttp.send( null );
    url =  xmlHttp.responseText;

    navigator.clipboard.writeText(url).then(function() { 
      alert("URL copiada al portapapeles")
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  import(){

      var urlparam = window.location.href.split('urlcode=')[1];
          if(urlparam){
            if(urlparam){
              urlparam = this.replaceAll(urlparam,'%7B','{');
              urlparam = this.replaceAll(urlparam,'%7D','}');
              urlparam = this.replaceAll(urlparam,'%22','"');
              urlparam = this.replaceAll(urlparam,'%20',' ');
              urlparam = this.replaceAll(urlparam,'%5B','[');
              urlparam = this.replaceAll(urlparam,'%5D',']');
            }
          }else{
            this.createNewNode(650,100,"Quiitun-Duosum",0);
            return;
          }
          console.log(urlparam);
          var newState = JSON.parse(urlparam);
      
      newState["NodeList"].forEach(e => {
           if(e["name"]!=""){
            this.createNewNode(e["posX"],e["posY"],e["name"],e["maptype"]);
          }        
      } );

      
      newState["RoadList"].forEach(e => {
        if(e["from"]!=""){
          this.createNewRoad(new Date(e["time"]),e["from"],e["to"],e["size"]);
        }             
      } );    
  }


    render() {     

        return (            
            <div>
              <span className="left">4</span>
                
                <button onClick={()=>this.clickNewNode()}>Add map</button>
                name:<input id="nameInput"></input>      

                type:<select id="maptypeSelect" name="select" defaultValue={1}>
                <option value="0" >Home</option> 
                <option value="1" >Road</option> 
                <option value="2">Road (with hideouts)</option>
                <option value="3">Blue</option>
                <option value="4">Yellow</option>
                <option value="5">Red</option>
                <option value="6">Black</option>
                <option value="7">Undefined</option>                
                </select>
               
              <p></p>
              <button onClick={()=>this.export()}>Export</button>
               

                {this.state.NodeList.map((node,i) => <Node key={i} selectedNode={this.state.newRoad} posX={node["posX"]} posY={node["posY"]} name={node["name"]} maptype={node["maptype"]} handleParentChange={this.NodeChangeHandler.bind(this)} handleDeleteNode={this.handleDeleteNode.bind(this)} handleClickNewRoad={this.handleClickNewRoad.bind(this)}></Node> )}    
                {this.state.RoadList.map((road,i) => <Road key={i} size={road["size"]} from={road["from"]} to={road["to"]} time={road["time"]} handleParentChange={this.RoadChangeHandler.bind(this)} handleDeleteRoad={this.handleDeleteRoad.bind(this)} ></Road>)}
             

            </div>          
        );
    }
}

