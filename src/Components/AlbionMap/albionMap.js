import React from 'react';
import { Node } from "../Node/node.js"
import { Road } from "../Road/road.js"
import './albionMap.css'
import mapsAndtypes from './mapsAndTypes.js'
import { Autocomplete } from '@material-ui/lab';
import { TextField,Grid } from '@material-ui/core';

export class AlbionMap extends React.Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            imported: false,
            newRoad: "",
            NodeList: [
            ],

            RoadList: [
            ]
        };
    }

    componentDidMount() {
        if (!this.state.imported) {
            this.import(); //si hya parametro en la url, importara el mapa     
            this.setState({ imported: true });
        }

        
        document.getElementById("nameInput").addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("addMapBtn").click();
            }
        });
    }

    replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }

    NodeChangeHandler(nodeName, newX, newY, newmaptype) {
        const found = this.state.NodeList.find(e => e["name"] === nodeName);
        found["posX"] = newX;
        found["posY"] = newY;
        found["maptype"] = newmaptype;

        this.forceUpdate();
    }

    handleDeleteNode(nodeName) {
        const found = this.state.NodeList.find(e => e["name"] === nodeName);
        found["name"] = "";
        this.forceUpdate();
    }

    handleDeleteRoad(fromName, toName) {
        var found = this.state.RoadList.find(e => (e["from"] === fromName) && (e["to"] === toName));
        found["from"] = "";
        this.forceUpdate();
    }

    RoadChangeHandler(fromName, toName, time, size) {
        var found = this.state.RoadList.find(e => (e["from"] === fromName) && (e["to"] === toName));
        found["time"] = time;
        found["size"] = size;

        this.forceUpdate();
    }

    clickNewNode() {
        var name =  document.getElementById('nameInput').value;
        //si el mapa existe en el json de mapas y tipos, cargamos el tipo automaticamente
        var found = mapsAndtypes['maps'].find(e=> e.displayname===name);
       
        var type = 7;
        if(found){
            type = this.stringTypeToIntType(found['type']);
        }
        this.createNewNode(0, 0, name, type);
        //simula un click en la x que elimina el valor del input
        this.refs['autocomplete'].getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
        //document.getElementById('nameInput').value = "";
    }

    createNewNode(posX, posY, name, maptype) {

        if (name === "") {
            return;
        }

        const found = this.state.NodeList.find(e => e["name"] === name);
        if (found) {
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

    handleClickNewRoad(name) {
        if (this.state.newRoad === "") {
            this.setState({ newRoad: name });
        } else {
            this.createNewRoad(new Date(0), this.state.newRoad, name, 7); //el time 0 se pondra como un NAN
            this.setState({ newRoad: "" });
        }
    }

    incrementToTime(increment) {
        var time = new Date();
        increment = this.timeToDecimal(increment);
        time.setSeconds(time.getSeconds() + increment);
        return time;
    }

    createNewRoad(time, from, to, size) {

        if (from === "" || to === "") {
            return;
        }

        if (from === to) {
            alert("Error: Cant create a road from a map to itself.");
            return;
        }

        var found = this.state.RoadList.find(e => (e["from"] === from && e["to"] === to));
        if (found) {
            alert("Error: This road already exists.");
            return;
        }
        found = this.state.RoadList.find(e => (e["from"] === to && e["to"] === from));
        if (found) {
            alert("Error: This road already exists.");
            return;
        }
        if (!this.state.NodeList.find(e => e["name"] === from) || !this.state.NodeList.find(e => e["name"] === to)) {
            alert("Error: One of the connection ('from' or 'to') doesnt exists.");
            return;
        }

        var newRoad = {};
        newRoad["size"] = size;
        if (time.getTime() !== 0) { //si la fecha no es nula (fecha 0)
            newRoad["time"] = time.getTime();
        } else {
            newRoad["time"] = "a"; //para que salga NAN
        }

        newRoad["from"] = from;
        newRoad["to"] = to;

        this.state.RoadList.push(newRoad);
        this.forceUpdate();
    }

    timeToDecimal(t) {
        t = t.split(':');
        return parseInt(t[0], 10) * 3600 + parseInt(t[1], 10) * 60;
    }


    export() {
        var firstparturl = window.location.href.split('&urlcode=')[0];
        var url = firstparturl + "&urlcode=" + JSON.stringify(this.state);

        var tinyurllink = "https://tinyurl.com/api-create.php?url=" + url;

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", tinyurllink, false); // false for synchronous request
        xmlHttp.send(null);
        url = xmlHttp.responseText;

        navigator.clipboard.writeText(url).then(function () {
            alert("URL copiada al portapapeles")
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    import() {

        var urlparam = window.location.href.split('urlcode=')[1];
        if (urlparam) {
            if (urlparam) {
                urlparam = this.replaceAll(urlparam, '%7B', '{');
                urlparam = this.replaceAll(urlparam, '%7D', '}');
                urlparam = this.replaceAll(urlparam, '%22', '"');
                urlparam = this.replaceAll(urlparam, '%20', ' ');
                urlparam = this.replaceAll(urlparam, '%5B', '[');
                urlparam = this.replaceAll(urlparam, '%5D', ']');
            }
        } else {
            this.createNewNode(600, 75, "Qiitun-Duosum", 0);
            return;
        }
        console.log(urlparam);
        var newState = JSON.parse(urlparam);

        newState["NodeList"].forEach(e => {
            if (e["name"] !== "") {
                this.createNewNode(e["posX"], e["posY"], e["name"], e["maptype"]);
            }
        });


        newState["RoadList"].forEach(e => {
            if (e["from"] !== "") {
                this.createNewRoad(new Date(e["time"]), e["from"], e["to"], e["size"]);
            }
        });
    }

    stringTypeToIntType(t){        
        if(t==="TUNNEL_MEDIUM" || t==="TUNNEL_LOW" || t==="TUNNEL_ROYAL" || t==="TUNNEL_BLACK_LOW" || t==="TUNNEL_BLACK_MEDIUM"){
            return 1;
        }else if(t==="TUNNEL_HIDEOUT_DEEP" || t==="TUNNEL_HIDEOUT"){
            return 2;
        }else if(t==="SAFEAREA"){
            return 3;
        }else if(t==="OPENPVP_YELLOW"){
            return 4;
        }else if(t==="OPENPVP_RED"){
            return 5;
        }else if(t==="OPENPVP_BLACK_1" || t==="OPENPVP_BLACK_2" || t==="OPENPVP_BLACK_3" || t==="OPENPVP_BLACK_4" || t==="OPENPVP_BLACK_5"|| t==="OPENPVP_BLACK_6"){
            return 6;
        }else{
            return 7;
        }
    }

    //importa un codigo en formato
    // from/to/size/time#from/to/size/time#from/to/size/time#from/to/size/time
    importCode(){
        var code = document.getElementById('autoImport').value;
        document.getElementById('autoImport').value="";
        console.log(code);
        code = code.split("#");
        code.forEach(e => {
            var arr = e.split("/");
            if(arr.length===7){ //es 1 mas porque empezamos con un '/' para evitar lios con el \n
                var from = arr[1];
                var typeFrom = arr[2];
                var to = arr[3];
                var typeTo = arr[4];
                var size = arr[5];
                var time = arr[6];
                
                if(from && to && size && time && from!=="" && to !== "" && size !== "" && time !== ""){
                    var found1 = this.state.NodeList.find(e => e["name"] === from);
                    if(!found1){

                        this.createNewNode(0, 0, from, this.stringTypeToIntType(typeFrom));
                    }
                    var found2 = this.state.NodeList.find(e => e["name"] === to);   
                    if(!found2){                    
                        this.createNewNode(0, 0, to, this.stringTypeToIntType(typeTo));
                    }                
                    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    d.setUTCSeconds(time);

                    //si el camino no existia ya, lo creamos
                    if (!this.state.RoadList.find(e => (e["from"] === from && e["to"] === to)) && !this.state.RoadList.find(e => (e["from"] === to && e["to"] === from)))  {
                        this.createNewRoad(d, from, to, size);
                    }                   
                }
            }            
        });
    }

    render() {
        return (
            <div>
                <Grid container spacing={24}>
                    
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                <Autocomplete
                id="nameInput"
                ref={'autocomplete'}
                options={mapsAndtypes['maps']}                
                getOptionLabel={(option) => option.displayname}
                style={{ width: 200 }}
                renderInput={(params) => <TextField {...params} label="Map name" variant="outlined" size="small"/>}
                />
                 &nbsp;
                <button className="margin" id="addMapBtn" onClick={() => this.clickNewNode()}>Add map</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                <button className="margin" onClick={() => this.export()}>Export as URL</button>

                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                <input className="margin" id="autoImport" placeholder="autoimport code"></input>  
                <button className="margin" onClick={() => this.importCode()}>import code</button>

                </Grid>

                {this.state.NodeList.map((node, i) => <Node key={i} selectedNode={this.state.newRoad} posX={node["posX"]} posY={node["posY"]} name={node["name"]} maptype={node["maptype"]} handleParentChange={this.NodeChangeHandler.bind(this)} handleDeleteNode={this.handleDeleteNode.bind(this)} handleClickNewRoad={this.handleClickNewRoad.bind(this)}></Node>)}
                {this.state.RoadList.map((road, i) => <Road key={i} size={road["size"]} from={road["from"]} to={road["to"]} time={road["time"]} handleParentChange={this.RoadChangeHandler.bind(this)} handleDeleteRoad={this.handleDeleteRoad.bind(this)} ></Road>)}

            </div>
        );
    }
}

