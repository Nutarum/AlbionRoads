import React from 'react';
import LineTo from 'react-lineto';
import './road.css';
import Draggable from 'react-draggable'; // Both at the same time
import { Close, Sync } from '@material-ui/icons';
import Modal from 'react-modal';

export class Road extends React.Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            posX: 0,
            posY: 0,
            showModalTime: false
        };
    }

    showTime() {
        var showDate = new Date(this.props.time).toLocaleString();
        return showDate;
    }

    showRemaining() {
        var time = new Date(this.props.time);
        var now = new Date();

        if(time<now){
            return ""; //el camino ya está cerrado
        }

        var diff = Math.abs(time - now);       

        var ms = diff % 1000;
        diff = (diff - ms) / 1000
        var ss = diff % 60;
        diff = (diff - ss) / 60
        var mm = diff % 60;
        diff = (diff - mm) / 60
        var hh = diff;

        if (isNaN(hh) || isNaN(mm) || isNaN(ss) || hh > 99) {
            return "???"
        }

        return ("00" + hh).slice(-2) + ":" + ("00" + mm).slice(-2) + ":" + ("00" + ss).slice(-2);
    }

    recolocarPosicion() {
        //recolocamos automaticamente el camino
        var rect1 = (document.getElementsByClassName(this.props.from));
        var rect2 = (document.getElementsByClassName(this.props.to));

        if (rect1.length > 0 && rect2.length > 0) {
            rect1 = rect1[0].getBoundingClientRect();

            var x1 = rect1['x'] + (rect1['width'] / 2);
            var y1 = rect1['y'] - (rect1['height'] * 1.5);

            rect2 = rect2[0].getBoundingClientRect();
            var x2 = rect2['x'] + (rect2['width'] / 2);
            var y2 = rect2['y'] - (rect2['height'] * 1.5);

            var tmp;
            if (x1 > x2) {
                tmp = x1;
                x1 = x2;
                x2 = tmp;
            }
            if (y1 > y2) {
                tmp = y1;
                y1 = y2;
                y2 = tmp;
            }

            var myW = 0;
            //var myH = 0;
            var rect3 = (document.getElementsByClassName("road" + this.props.from + this.props.to));
            if (rect3.length > 0) {
                rect3 = rect3[0].getBoundingClientRect();
                myW = rect3["width"];
                //myH = rect3["height"];
            }

            //OJO CON ESA CONSTANTE EN POSY, CUANDO SE CAMBIAN LOS INPUTS DE LA PARTE DE ARRIBA
            //LOS CAMINOS SE DESCOLOCAN PORQUE LA PANTALLA TOMA UNA REFERENCIA DEL 0 DISTINTA
            var newX = (x1 + ((x2 - x1) / 2)) + window.scrollX - (myW / 2);
            var newY = (y1 + ((y2 - y1) / 2)) + window.scrollY + 40;

            this.setState({
                posX: newX,
                posY: newY
            });
        }
    }

    componentDidMount() {
        Modal.setAppElement('body');
        this.recolocarPosicion();
        this.interval = setInterval(() => {
            
            this.recolocarPosicion();
            this.forceUpdate();

        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onChange(e) {
        this.props.handleParentChange(this.props.from, this.props.to, this.props.time, e.target.value);
        this.forceUpdate();
    }

    delete() {
        if (!window.confirm("Confirm delete")) {
            return;            
        }
        this.props.handleDeleteRoad(this.props.from, this.props.to);
    }

    handleOpenModalSetTime() {
        this.setState({showModalTime: true});
    }

    setInputFocus() {
        this.timeInput && this.timeInput.focus();
    }

    handleCloseModal(accepted) {
        this.setState({ showModalTime: false });
        if (accepted) {
            var t = this.timeInput.value;
            if (!t) {
                return;
            }
            t = t.split(':');
            var increment = parseInt(t[0], 10) * 3600 + parseInt(t[1], 10) * 60;

            var newTime = new Date();

            newTime.setSeconds(newTime.getSeconds() + increment);

            this.props.handleParentChange(this.props.from, this.props.to, newTime, this.props.size, this.props.posX, this.props.posY);
            this.forceUpdate();
        }
    }

    handleStop(e, data) {

        this.props.handleParentChange(this.props.from, this.props.to, this.props.time, this.props.size, data.x, data.y);
        this.forceUpdate();
    }
    handleKeyPress(e) {
        console.log(e);
    }

    formatTime() {
        var regex;
        if (this.timeInput.value.length === 1) {
            regex = new RegExp("^[0-9]$");
            if (!regex.test(this.timeInput.value)) {
                this.timeInput.value = "";
            }
        }
        if (this.timeInput.value.length === 2) {
            regex = new RegExp("^[0-9][0-9]$");
            if (!regex.test(this.timeInput.value)) {
                this.timeInput.value = this.timeInput.value.slice(0, -1);
            } else {
                this.timeInput.value = this.timeInput.value + ":";
            }
        }
        if (this.timeInput.value.length === 4) {
            regex = new RegExp("^[0-9][0-9][:][0-9]$");
            if (!regex.test(this.timeInput.value)) {
                this.timeInput.value = this.timeInput.value.slice(0, -1);
            }
        }
        if (this.timeInput.value.length === 5) {
            regex = new RegExp("^[0-9][0-9][:][0-9][0-9]$");
            if (!regex.test(this.timeInput.value)) {
                this.timeInput.value = this.timeInput.value.slice(0, -1);
            }
        }
    }
    render() {
        var tRestante = (this.props.time - new Date().getTime()) / 1000;
        var lineColor = "green";
        if (tRestante < 3600) {
            lineColor = "red";
        } else if (tRestante < 10800) {
            lineColor = "orange";
        }

        var lineStyle = "solid";
        if (tRestante < 1800) {
           // lineStyle = "dashed";
        }        
        
        var selectSize = <select defaultValue={this.props.size} onChange={this.onChange.bind(this)} name='select'>
            <option value='2' >2</option>
            <option value='7' >7</option>
            <option value='20' >20</option>
            </select>;
   
        if(tRestante<0){           
            selectSize="";
            lineStyle = "dashed";
        }

        var typeUnselect = {
            userSelect: 'none',
            zIndex: 10
        }

        var thisRoadClassName = " road" + this.props.from + this.props.to;

        if (this.props.from === "") {
            return <span></span>;
        } else {
            return (
                <div>
                    <LineTo from={this.props.from} to={this.props.to} borderColor={lineColor} borderStyle={lineStyle}></LineTo>
                    <Draggable
                        //handle="div"

                        // vamos a hacer una tonteria, lo dejo como dragable pero le quito la opcion de desplazarse
                        //asi mantiene todas las cosas de position absolute que tenga y tal (ya lo quitare mas adelante si eso....)
                        handle="none"

                        defaultPosition={{ x: this.state.posX, y: this.state.posY }}
                        position={{ x: this.state.posX, y: this.state.posY }}
                        grid={[1, 1]}
                        scale={1}
                        onStart={this.handleStart}
                        onDrag={this.handleDrag}
                        onStop={this.handleStop.bind(this)}>
                        <div style={typeUnselect} className={"box no-cursor posAbsolute" + thisRoadClassName}>
                            <div className="cursor">
                                {selectSize}                               
                                <br />    <span className="dateTime" >{this.showTime()} </span>
                                <br /> {this.showRemaining()}
                                <button className="smallBtn" onClick={() => this.delete()}>    <Close className="iconDel" style={{ fontSize: 18 }}></Close>    </button>
                                <button className="smallBtn" onClick={() => this.handleOpenModalSetTime()}> <Sync className="iconDel" style={{ fontSize: 18 }}></Sync> </button>
                            </div>

                        </div>
                    </Draggable>

                    <Modal
                        isOpen={this.state.showModalTime}
                        onAfterOpen={() => this.setInputFocus()}
                        onRequestClose={() => this.handleCloseModal(false)}

                        contentLabel="Set time modal"
                        style={{
                            overlay: {
                                backgroundColor: '#A9A9A999',
                                zIndex: 99
                            },
                            content: {
                                backgroundColor: '#a0d2eb',
                                position: 'absolute',
                                left: this.state.posX,
                                top: this.state.posY,
                                width: 150,
                                height: 75,
                                padding: 20,
                                border: "solid"
                            }
                        }}
                    >
                        <form>
                            <span>Remaining time:</span>
                            <input ref={(input) => { this.timeInput = input; }} autoComplete={"off"} onChange={this.formatTime.bind(this)} maxLength={5} id="timeInput" placeholder="hh:mm" style={{ width: 50 }}></input>
                            <br />
                            <button onClick={() => this.handleCloseModal(true)}>Ok</button> &nbsp;
                            <button onClick={() => this.handleCloseModal(false)}>Cancel</button>
                        </form>
                    </Modal>
                </div>
            );
        }
    }
}

