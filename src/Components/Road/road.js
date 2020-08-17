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
                this.delete(false);
            }
          }
          
            this.forceUpdate();
        
        }, 1000);
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }

      onChange(e){
        this.props.handleParentChange(this.props.from, this.props.to,this.props.time, e.target.value,this.props.posX,this.props.posY);
        this.forceUpdate();
      }

      delete(withConfirm){        

        if(withConfirm){
          if (!window.confirm("Confirm delete")) {
            return;
          }
        }
        

            this.props.handleDeleteRoad(this.props.from, this.props.to);        
      }

      recalc(){

        var t = prompt("Remaining time (hh:mm):", "");
        if(!t){
          return;
        }
      
        t = t.split(':');    
        var increment =  parseInt(t[0], 10)*3600 + parseInt(t[1], 10)*60;

        var newTime = new Date();
      
        newTime.setSeconds(newTime.getSeconds() + increment);

        this.props.handleParentChange(this.props.from, this.props.to,newTime, this.props.size,this.props.posX,this.props.posY);
        this.forceUpdate();
      }


      handleStop(e,data){      
     
        this.props.handleParentChange(this.props.from, this.props.to,this.props.time, this.props.size,data.x,data.y);
        this.forceUpdate();
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
                               <div className="cursor">                                  
                               <select defaultValue={this.props.size} onChange = {this.onChange.bind(this)} name="select">
                              <option value="2" >2</option> 
                              <option value="7" >7</option> 
                              <option value="20" >20</option>           
                              </select>                                 
                              <br/>  <span className="dateTime" >{this.showTime()} </span>
                              
                              <br/> {this.showRemaining()  } 
                              <button className="smallBtn2" onClick={()=>this.recalc()}> recalc </button>
                              </div>  
                                  <button className="smallBtn2" onClick={()=>this.delete(true)}> del </button>
                        </div>
                    </Draggable>
                </div>
                
            );
        }
    }
   
}

