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
            posX: 0,
            posY: 0,
            time: new Date(),
            size:7
         };       
         this.state.size = this.props.size;        
         this.state.time = this.props.time;       
                 
         
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
        return this.state.time.toLocaleString();
    } 

    showRemaining(){
        return this.dateDiffToString(this.state.time, new Date());
    }

      componentDidMount() {
    
        this.interval = setInterval(() => {

            this.forceUpdate();
        
        }, 1000);
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }

      delete(){

     
            this.state.size=-1;
            this.props.handleParentChange(this.props.from, this.props.to,this.state.time, this.state.size,this.state.posX,this.state.posY);
        
        this.forceUpdate();
      }

      handleStop(e,data){        
        this.state.posX=data.x;
        this.state.posY=data.y;
     
        this.props.handleParentChange(this.props.from, this.props.to,this.state.time, this.state.size,this.state.posX,this.state.posY);
  }

      
    render() {     
        
       
        if(this.state.size<0){
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
                               <div className="cursor"> <strong> {this.state.size}</strong>  <br/>  <span class="dateTime" >{this.showTime()} </span><br/> {this.showRemaining()  }</div>      <button class="smallBtn2" onClick={()=>this.delete()}> del </button>
                        </div>
                    </Draggable>
                </div>
                
            );
        }
    }
   
}

