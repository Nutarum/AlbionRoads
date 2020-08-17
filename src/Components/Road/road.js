import React from 'react';
import LineTo from 'react-lineto';
import './road.css';
import { thisExpression } from '@babel/types';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

export class Road extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {
            
         };             
      }      

      
      dateDiffToString(a, b){

        // make checks to make sure a and b are not null
        // and that they are date | integers types
    
        var diff = Math.abs(a - b);
    
        var ms = diff % 1000;
        diff = (diff - ms) / 1000
        var ss = diff % 60;
        diff = (diff - ss) / 60
        var mm = diff % 60;
        diff = (diff - mm) / 60
        var hh = diff % 24;
    
        return hh+":"+mm+":"+ss;
    
    }

      showTime() { 
        return new Date(this.props.time).toLocaleString();
    } 

    showRemaining(){
        return this.dateDiffToString(new Date(this.props.time), new Date());
    }

      componentDidMount() {
    
        this.interval = setInterval(() => {

          if(this.props.size>-1){ //si aun no lo hemos "borrado"
          //miramos a ver si ya se ha cerrado
              if(this.props.time<new Date()){
                this.delete();
            }
          }
          
            this.forceUpdate();
        
        }, 1000);
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }

      delete(){
        
            this.props.handleParentDelete(this.props.from, this.props.to);
        
        this.forceUpdate();
      }

      handleStop(e,data){      
     
        this.props.handleParentChange(this.props.from, this.props.to,this.props.time, this.props.size,data.x,data.y);
  }

      
    render() {     
        
       
        if(this.props.from==""){
            return <span></span>;
                    }else{
            return (
                <div>
                    <LineTo from={this.props.from} to={this.props.to}></LineTo>
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
                        <div className={"box no-cursor posAbsolute"}>           
                               <div className="cursor"> <strong> {this.props.size}</strong>  <br/>  <span class="dateTime" >{this.showTime()} </span><br/> {this.showRemaining()  }</div>      <button class="smallBtn2" onClick={()=>this.delete()}> del </button>
                        </div>
                    </Draggable>
                </div>
                
            );
        }
    }
   
}

