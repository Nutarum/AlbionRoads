import React from 'react';
import './infoScreen.css';
import { ArrowUpward,Sync } from '@material-ui/icons';

export class InfoScreen extends React.Component {
    constructor(props) {
        super(props);   
        // Don't call this.setState() here!
        this.state = {       
            
         };               
      }
        
      render() {     

        var styleSelectmaptypeNode = {
            backgroundColor: 'rgb(61, 255, 200)'
          };

        return (            
            <div  className="textBlock">
                <br/>
               <p className="centerText"><b >Albion road mapper, made by Nutarum.</b>    </p>
               <br/>
               <p className="centerText">This web uses no database, all the map information is stored in the exported and imported URL.   </p>
                  
               <br/>
               <p>
               <b>Updating info in a map:</b>    
               <br/>
               1) Load a URL with some map info
               <br/>
               2) Modify the map
               <br/>
               3) Click the button 'Export to URL' and share the URL copied to your clipboard 
               </p>
               <br/>
               <p >
               <b>Adding new zones:</b>    
               <br/>
               1) Type the zone name in the top text box
               <br/>
               2) Click the button 'Add Map'
               <br/>
               3) Mode the map around
               <br/>
               3) Change its type if needed using a control like this one ->   &nbsp;  
                <select defaultValue={1} style={styleSelectmaptypeNode} name="select">
                        <option value="0" >Home</option> 
                        <option value="1" >Road</option> 
                        <option value="2" >Road (HOs)</option>
                        <option value="3" >Blue</option>
                        <option value="4">Yellow</option>
                        <option value="5">Red</option>
                        <option value="6" >Black</option>
                        <option value="7" >Undefined</option>                
                        </select>

               </p>
               <br/>
               <p >
               <b>Adding new portals:</b>    
               <br/>
               1) Click the arrow button  &nbsp;  
               <button className="smallBtnInfo2"> <ArrowUpward className="iconDel" style={{ fontSize: 18 }}></ArrowUpward> </button>
               &nbsp;  on one of the two zones connected by the portal
               <br/>
               2) Then click the arrow button &nbsp;  
               <button className="smallBtnInfo2"> <ArrowUpward className="iconDel" style={{ fontSize: 18 }}></ArrowUpward> </button>
               &nbsp;   on the other zone connected   
               <br/>
               3) Change the portal size using a control like this one -> &nbsp;     
               <select defaultValue={7} name="select">
                    <option value="2" >2</option> 
                    <option value="7" >7</option> 
                    <option value="20" >20</option>           
                </select>     
                <br/>
                4) Set the portal remaining time by clicking this button  &nbsp;  
                <button className="smallBtnInfo2"> <Sync className="iconDel" style={{ fontSize: 18 }}></Sync> </button>
                &nbsp;  and typing the time in the format (hh:mm)
               </p>
            </div>          
        );
    }
}

