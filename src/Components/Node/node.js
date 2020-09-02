import React from 'react';
import Draggable from 'react-draggable'; // Both at the same time
import './node.css'
import {Info, Close, ArrowUpward } from '@material-ui/icons';
import jsonInfo from './mapInfo.js'
import Modal from 'react-modal';

export class Node extends React.Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            showModalInfo: false,
            nodeInfo: null
        };
    }

    getRoadTypeAsColor() {
        if (this.props.maptype === 0) {
            return 'rgb(178, 102, 255)';//home
        } else if (this.props.maptype === 1) {
            return 'rgb(61, 255, 200)';//road
        } else if (this.props.maptype === 2) {
            return 'rgb(32, 161, 131)';//road with hideouts               
        } else if (this.props.maptype === 3) {
            return 'rgb(100, 175, 255)';//blue
        } else if (this.props.maptype === 4) {
            return 'rgb(255, 255, 100)';//yelow
        } else if (this.props.maptype === 5) {
            return 'rgb(255, 90, 90)';//red
        } else if (this.props.maptype === 6) {
            return 'rgb(125, 125, 125)';//black
        } else {
            return 'rgb(254, 102, 255)';//undefined
        }
    }

    onChange(e) {
        this.props.handleParentChange(this.props.name, this.props.posX, this.props.posY, parseInt(e.target.value));
        this.forceUpdate();
    }

    handleStop(e, data) {
        this.props.handleParentChange(this.props.name, data.x, data.y, this.props.maptype);
    }

     compare( a, b ) {
        if ( a.type < b.type ){
          return -1;
        }
        if ( a.type > b.type ){
          return 1;
        }
        return 0;
      }

    showInfo(){
        if(this.state.nodeInfo===null){
            var found = jsonInfo['world']['clusters']['cluster'].find(e=> e.displayname===this.props.name);
            if(!found){
                this.setState({nodeInfo: -1});  
                return;
            }
            //ordenamos los nodos del mapa en orden alfabetico
            found['minimapmarkers']['marker'].sort(this.compare);

            this.setState({nodeInfo: found});           
        }else if(this.state.nodeInfo===-1){
            return;
        }
        this.setState({showModalInfo: true});
    }

    showNodeInfo(){    
        if(!this.state.showModalInfo){
            return "";
        }
        try{
            var returnInfo = this.state.nodeInfo['timeregion'] + "\n" +  this.state.nodeInfo['type'] + "\n";
            this.state.nodeInfo['minimapmarkers']['marker'].forEach(e=>{returnInfo+= "\n" + e['type']});
            return returnInfo;
        }   catch(e){
            return "";
        }      
    }

    handleCloseModal(){
        this.setState({showModalInfo: false});
    }

    delete() {
        if (!window.confirm("Confirm delete")) {
            return;
        }
        this.props.handleDeleteNode(this.props.name);
    }

    render() {

        if (this.props.name === "") {
            return <span></span>;
        } else {
            var styleSelectmaptypeNode = {
                backgroundColor: this.getRoadTypeAsColor()
            };

            var styleColors = {
                backgroundColor: this.getRoadTypeAsColor(),
                borderColor: "black"
            };
            if (this.props.name === this.props.selectedNode) {
                styleColors = {
                    backgroundColor: this.getRoadTypeAsColor(),
                    borderColor: "red"
                };
            }

            return (

                <div>
                <Draggable
                    //axis="y" (si no ponemos esto, el movimiento es libre)
                    handle="div"
                    defaultPosition={{ x: this.props.posX, y: this.props.posY }}
                    position={null}
                    grid={[1, 1]}
                    scale={1}
                    onStart={this.handleStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleStop.bind(this)}>
                    <div className={"box no-cursor node posAbsolute " + this.props.name} style={styleColors}>
                        <strong className="cursor">
                            <div>
                                <select defaultValue={this.props.maptype} style={styleSelectmaptypeNode} onChange={this.onChange.bind(this)} name="select">
                                    <option value="0" >Home</option>
                                    <option value="1" >Road</option>
                                    <option value="2" >Road (HOs)</option>
                                    <option value="3" >Blue</option>
                                    <option value="4">Yellow</option>
                                    <option value="5">Red</option>
                                    <option value="6" >Black</option>
                                    <option value="7" >Undefined</option>
                                </select>
                          

                            </div>
                            <div >{this.props.name}</div>             </strong>

                            <button className="smallBtn2" onClick={() => this.showInfo()}> <Info className="iconDel" style={{ fontSize: 18 }}></Info> </button>

                        <button className="smallBtn" onClick={() => this.delete()}> <Close className="iconDel" style={{ fontSize: 18 }}></Close> </button>
                       
                        <button className="smallBtn3" onClick={() => this.props.handleClickNewRoad(this.props.name)}> <ArrowUpward className="iconDel" style={{ fontSize: 18 }}></ArrowUpward> </button>
                    </div>
                </Draggable>

                <Modal
                        isOpen={this.state.showModalInfo}
                        onRequestClose={() => this.handleCloseModal()}
                        contentLabel="Road info modal"
                        style={{
                            overlay: {
                                backgroundColor: '#A9A9A999',
                                zIndex: 99
                            },
                            content: {
                                backgroundColor: '#a0d2eb',
                                position: 'absolute',
                                left: this.props.posX,
                                top: this.props.posY,
                                width: 200,
                                height: 300,
                                padding: 20,
                                border: "solid"
                            }
                        }}
                    >
                        <div className="modalDiv">
                            <div><b>{this.props.name}</b></div>
                            {this.showNodeInfo()}
                        </div>
                    </Modal>

                </div>
            );
        }
    }
}
