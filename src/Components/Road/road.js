import React from 'react';
import LineTo from 'react-lineto';
import './road.css';
import { thisExpression } from '@babel/types';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import { Close, Sync } from '@material-ui/icons';

export class Road extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {
            posX: 0,
            posY: 0
         };             
      }      
     

      showTime() { 
        var showDate = new Date(this.props.time).toLocaleString();
        return showDate;
    } 

    showRemaining(){
      var time = new Date(this.props.time);
      var now =  new Date();

      var diff = Math.abs(time - now);    
      var ms = diff % 1000;
      diff = (diff - ms) / 1000
      var ss = diff % 60;
      diff = (diff - ss) / 60
      var mm = diff % 60;
      diff = (diff - mm) / 60
      var hh = diff;

      if(isNaN(hh) || isNaN(mm) || isNaN(ss) || hh>99){
        return "???"
      }
  
      return ("00"+hh).slice(-2)+":"+("00"+mm).slice(-2)+":"+("00"+ss).slice(-2);       
    }


    recolocarPosicion(){      
          //recolocamos automaticamente el camino
          var rect1 = (document.getElementsByClassName(this.props.from));
          var rect2 = (document.getElementsByClassName(this.props.to));
          
          if(rect1.length>0 && rect2.length>0){
              rect1 = rect1[0].getBoundingClientRect();

              var x1 = rect1['x']+(rect1['width']/2);
              var y1 = rect1['y']-(rect1['height']*1.5);
    
              rect2 = rect2[0].getBoundingClientRect();
              var x2 = rect2['x']+(rect2['width']/2);
              var y2 = rect2['y']-(rect2['height']*1.5);
    
              if(x1>x2){
                var tmp = x1;
                x1=x2;
                x2=tmp;
              }
              if(y1>y2){
                var tmp = y1;
                y1=y2;
                y2=tmp;
              }

              var myW = 0;
              //var myH = 0;
              var rect3 = (document.getElementsByClassName("road"+this.props.from+this.props.to));
              if(rect3.length>0){
                rect3 = rect3[0].getBoundingClientRect();
                myW = rect3["width"];
                //myH = rect3["height"];
              }

              //OJO CON ESA CONSTANTE EN POSY, CUANDO SE CAMBIAN LOS INPUTS DE LA PARTE DE ARRIBA
              //LOS CAMINOS SE DESCOLOCAN PORQUE LA PANTALLA TOMA UNA REFERENCIA DEL 0 DISTINTA
              this.state.posX = (x1 + ((x2-x1) / 2)) + window.scrollX - (myW/2);
              this.state.posY = (y1 + ((y2-y1) / 2)) + window.scrollY + 30; //(myH/2);            
              this.forceUpdate();
          }
    }

      componentDidMount() {
        this.recolocarPosicion();
        this.interval = setInterval(() => {
          if(this.props.size>-1){ //si aun no lo hemos "borrado"
          //miramos a ver si ya se ha cerrado
              if(this.props.time<new Date()){
                this.delete(false);
            }
          }         
          this.recolocarPosicion();          
          this.forceUpdate();
        
        }, 1000);
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }

      onChange(e){
        this.props.handleParentChange(this.props.from, this.props.to,this.props.time, e.target.value);
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

      var tRestante = (this.props.time - new Date().getTime())/1000;      
      var lineColor = "green";
      if(tRestante<3600){
        lineColor="red";
      }else if(tRestante<10800){
        lineColor="orange";
      }

      var lineStyle="solid";
      if(tRestante<1800){
        lineStyle="dashed";
      }
        

      var typeUnselect={       
        userSelect:'none',
        zIndex: 99
      }
       
        if(this.props.from==""){
            return <span></span>;
                    }else{
            return (
                <div>
                    <LineTo from={this.props.from} to={this.props.to} borderColor={lineColor} borderStyle={lineStyle}></LineTo>
                    <Draggable              
                        //handle="div"

                        // vamos a hacer una tonteria, lo dejo como dragable pero le quito la opcion de desplazarse
                        //asi mantiene todas las cosas de position absolute que tenga y tal (ya lo quitare mas adelante si eso....)
                        handle="none" 

                        defaultPosition={{x: this.state.posX, y: this.state.posY}}
                        position={{x: this.state.posX, y: this.state.posY}}
                        grid={[1, 1]}
                        scale={1}
                        onStart={this.handleStart}
                        onDrag={this.handleDrag}
                        onStop={this.handleStop.bind(this)}>
                        <div style={typeUnselect}  className={"box no-cursor posAbsolute" + " road" + this.props.from + this.props.to}>           
                               <div className="cursor">                                  
                               <select defaultValue={this.props.size} onChange = {this.onChange.bind(this)} name="select">
                              <option value="2" >2</option> 
                              <option value="7" >7</option> 
                              <option value="20" >20</option>           
                              </select>                                                 
                              <br/>  <span className="dateTime" >{this.showTime()} </span>                              
                              <br/> {this.showRemaining()  } 
                              <button className="smallBtn" onClick={()=>this.delete(true)}>  <Close className="iconDel" style={{ fontSize: 18 }}></Close>  </button>   
                              <button className="smallBtn" onClick={()=>this.recalc()}> <Sync className="iconDel" style={{ fontSize: 18 }}></Sync> </button>
                              </div>  
                                 
                        </div>
                    </Draggable>
                </div>
                
            );
        }
    }
   
}

