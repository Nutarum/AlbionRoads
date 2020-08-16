import React from 'react';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import './node.css'

export class Node extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {
            posX:0,
            posY:0
         };                 
      }
      
      getRoadTypeAsColor(){
            if(this.props.type==0){ 
                return 'teal';//home
            }else if(this.props.type==1){
                return 'pink';//road
            }else if(this.props.type==2){
                return 'purple';//road with hideouts
            }else if(this.props.type==3){
                return 'blue';//blue
            }else if(this.props.type==4){
                return 'Yellow';//yelow
            }else if(this.props.type==5){
                return 'red';//red
            }else if(this.props.type==6){
                return 'grey';//black
            }else {
                return 'Undefined';
            }
      }
      getRoadTypeAsText(){
            if(this.props.type==0){
                return 'HOME';
            }else if(this.props.type==1){
                return 'Road';
            }else if(this.props.type==2){
                return 'Road (hideouts)';
            }else if(this.props.type==3){
                return 'Blue';
            }else if(this.props.type==4){
                return 'Yellow';
            }else if(this.props.type==5){
                return 'Red';
            }else if(this.props.type==6){
                return 'Black';
            }else {
                return 'Undefined';
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

      handleStop(e,data){        
          this.state.posX=data.x;
          this.state.posY=data.y;

          this.props.handleParentChange(this.props.name,this.state.posX,this.state.posY);
    }

      delete(){

        if(this.props.type>0){
            this.props.type=-1;
        }
        
        this.forceUpdate();
      }

    render() {        

        if(this.props.type<0){
return <span></span>;
        }else{
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
                      <strong className="cursor"><div>{this.getRoadTypeAsText()}</div>
                      <div >{this.props.name}</div>             </strong> 
                      <button class="smallBtn" onClick={()=>this.delete()}> del </button>
              </div>
            </Draggable>
                </span>
                
            );
        }
     
    }
}

