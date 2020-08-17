import React from 'react';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import './node.css'

export class Node extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {           
            
         };                    
      }
      
      getRoadTypeAsColor(){
            if(this.props.maptype==0){ 
                return 'teal';//home
            }else if(this.props.maptype==1){
                return 'pink';//road
            }else if(this.props.maptype==2){
                return 'purple';//road with hideouts
            }else if(this.props.maptype==3){
                return 'blue';//blue
            }else if(this.props.maptype==4){
                return 'Yellow';//yelow
            }else if(this.props.maptype==5){
                return 'red';//red
            }else if(this.props.maptype==6){
                return 'grey';//black
            }else {
                return 'white';
            }
      }

      onClick(){
        var t1 = document.getElementById('fromInput').value;
        var t2 = document.getElementById('toInput').value;

        if(t1==""){
            document.getElementById('fromInput').value=this.props.name;
        }else if(t1!="" && t2 != ""){
            document.getElementById('fromInput').value="";
            document.getElementById('toInput').value="";
        }else{
            document.getElementById('toInput').value=this.props.name;
        }

      }


      onChange(e){
        this.props.handleParentChange(this.props.name,this.props.posX,this.props.posY,e.target.value);
        this.forceUpdate();
      }

      handleStop(e,data){        
          this.props.handleParentChange(this.props.name,data.x,data.y,this.props.maptype);
    }

      delete(){
            this.props.handleDeleteNode(this.props.name);
      }

    render() {        

        console.log(this.props.posX);

        if(this.props.name==""){
            return <span></span>;
        }else{

            var styleSelectmaptypeNode = {
                backgroundColor: this.getRoadTypeAsColor()
              };

            return (


                <span   onClick={()=>this.onClick()}>
    <Draggable
              
    
              //axis="y" (si no ponemos esto, el movimiento es libre)
              handle="div"
              defaultPosition={{x: this.props.posX, y: this.props.posY}}
              position={null}
              grid={[1, 1]}
              scale={1}           
              onStart={this.handleStart}
              onDrag={this.handleDrag}
              onStop={this.handleStop.bind(this)}>
                <div className={"box no-cursor node posAbsolute " + this.props.name} style={{
                                      backgroundColor: this.getRoadTypeAsColor()                               
                                  }}>           
                      <strong className="cursor">
                          
                          <div>

                        <select defaultValue={this.props.maptype} style = {styleSelectmaptypeNode} onChange = {this.onChange.bind(this)} name="select">
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
                      <button class="smallBtn" onClick={()=>this.delete()}> del </button>
              </div>
            </Draggable>
                </span>
                
            );
        }
     
    }
}

