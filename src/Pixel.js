import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { createContext } from "react";
// import {colorContext} from './PixelArtEditor.js';
import './styles/board.css';
import {ColorContext} from './context/socket.js';
export default function Pixel(props) {
  const pixelRef = useRef(null);
  useEffect(()=>{
    const pixel = pixelRef.current;
    
    // pixel.addEventListener('click', applyColor);
    

  })
  const throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function () {
      const time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };
  // const socket = useContext(SocketContext);
  const { index, selectedColor, preColor, rowNum, socket } = props;
  const [pixelColor, setColor] = useState(preColor);
  // const [oldColor, setOldColor] = useState(pixelColor);
  // useEffect (() => {
  //     console.log("hi3");
  //     // for (let i = 0; i< height; i++){
  //     //     rows.push(<Row key = {i} width = {width} selectedColor="#000000" colors = {colors[i]}/>);
  //     // }
  // }, [props.changed]);
  const color = useContext(ColorContext);

  function applyColor() {  
    writeToDB();
    console.log(rowNum + "," + index);
    console.log(selectedColor);
    setColor(color);
    socket.emit("drawing", [props.rowNum, props.index, color]);

  }
  async function writeToDB(){
    const indexVal = rowNum*40+index;
    fetch(`http://localhost:8080/api/pixels/${indexVal}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ color: color })
        })
  }

  // socket.on('drawings', onDrawingEvent);
  // const onDrawingEvent = () => {
  //     console.log("drawing");
  //     return console.log("drawing");
  // }
  const [joined, setJoined] = useState(false);

  const handleInviteAccepted = useCallback(() => {
    setJoined(true);
  }, []);

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:

    // emit USER_ONLINE event
    socket.emit("USER_ONLINE", selectedColor);

    // subscribe to socket events
    socket.on("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);
    };
  }, [socket, handleInviteAccepted]);


  useEffect(() => {
    // console.log('faskdj');
    setColor(selectedColor);

  }, [props.selectedColor]);


  // pixel.addEventListener('onClick', onMouseUp, false);


  return (
    <div
      className="pixel"
      ref={pixelRef}
      onClick={throttle(applyColor,50)}
      style={{ backgroundColor: pixelColor }}
    >

    </div>
  )
}