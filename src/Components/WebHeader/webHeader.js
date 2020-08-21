import React from 'react';
import './webHeader.css'
import { Info,Replay } from '@material-ui/icons';

export class WebHeader extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {       
            
         };               
      }
    render() {    
      var icon = <Info className="iconInfo" style={{ fontSize: 22 }}></Info>;
      if(this.props.showingInfo){
        icon = <Replay className="iconInfo" style={{ fontSize: 22 }}></Replay>;
      }
        return (            
            <div className="header">
               <span><b>Albion road map</b></span>    
               <span className="right">&nbsp;&nbsp;</span>   
               <button className="btnInfo" onClick={()=>this.props.handleInfoClick()}> {icon} </button>                 
            </div>          
        );
    }
}

