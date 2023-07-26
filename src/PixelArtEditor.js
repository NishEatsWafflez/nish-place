import React, { useEffect, useRef, useState, setProps, memo, createContext } from "react";
import Row from "./Row";
import { ColorContext } from './context/socket.js';
import './styles/board.css';
const io = require('socket.io-client');

const socket = io.connect(process.env.REACT_APP_SERVER_IP);

export default function PixelArtEditor() {
    const [isDoneLoading, setIsDoneLoading] = useState(false);
    const [rowData, setRowData] = useState([]);

    // console.log(process.env);
    const height = 20;
    const width = 40;
    var initialColors = [];
    for(let i = 0; i < height; i++) {
        initialColors.push(new Array(width));
    }
    // const initialColors = [[],[]];

    socket.on('connect', async () => {
        console.log('Successfully connected!');
        fetch("http://localhost:8080/api/pixels", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => response.json())
            .then(data => {
                // console.log(data.data.pixels.length);
                // for (let i = 0; i < data.data.pixels.length; i++) {
                //     console.log(data.data.pixels[i].color);
                // }
                // console.log(data.data.pixels[0].color)
                for (let i = 0; i < 20; i++) {
                    for (let j = 0; j < 40; j++){
                        // console.log(i + " " + j);
                        initialColors[i][j] = data.data.pixels[40*i+j].color;
                    }
                    // console.log(data.data.pixels[0].color)
                }
                let loadedState = [];
                for (let i = 0; i < height; i++) {
                    loadedState[i] = { key: i, index: i, width: width, selectedColor: initialColors[i], chosenColor: chosenColor, columnNumber: 0 }
                }
                // console.log(loadedState);
                setRowData(loadedState);
                // console.log(rowData);

                // setRowData(initialState);
            })
        // await fetch("http://localhost:8080/api/pixels", {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // }).then(response => response.json())
        //     .then(data => {
        //         // console.log(data.data.pixels.length);
        //         for (let i = 0; i < data.data.pixels.length; i++) {
        //             // console.log(data.data.pixels[i].color);
        //         }
        //         // console.log(data.data.pixels[0].color)
        //         // for (let i = 0; i < 1600; i++) {
        //         //     // console.log(data.data.pixels[0].color)
        //         //     initialColors[i] = "#FF00FF";
        //         // }
        //         setIsDoneLoading(true); // Set isLoading to false once the fetch is complete
        //     })
    });

    // return () => socket.off('drawing')

    useEffect(() => {
        // console.log("rendering");
        socket.on('drawing', (data) => {
            console.log('Successfully drawn!');
            // console.log(rowData);
            drawPicture(data);
        });
        return () => socket.off('drawing')

    }, []);


    //   console.log(socketRef.current);

    // socket.on('drawing', onDrawingEvent);


    // socket.on('drawing', onDrawingEvent);
    // console.log(socketRef.current);
    const [chosenColor, changeColor] = useState("#000000");
    // console.log("chosenColor");
    // console.log(chosenColor);
    // const colorsList = document.getElementsByClassName('color');
    // console.log(colorsList);
    // useEffect(() => {
    //     console.log("Mounted")
    // }, [])
    const colorUpdate = (e) => {
        // console.log(rowData);
        // changeColor(e.target.className.split(' ')[1]);
    };
    // const initialState = [];

    useEffect(()=>{
        socket.on('drawing', (data) => {
            console.log('Successfully drawn!');
            // console.log(rowData);
            drawPicture(data);
        });
        return () => socket.off('drawing')
    }, [rowData])

    // console.log(rowData);
    // console.log(initialColors)
    // for (let i = 0; i < height; i++) {
    //     initialState[i] = { key: i, index: i, width: width, selectedColor: "#FFFF00", chosenColor: chosenColor, columnNumber: 0 }
    // }

    // console.log(initialState);

    const drawPicture = (data) => {
        console.log(chosenColor);
        console.log("afksnd");
        if (data[0] === null) {
            console.log(data[0]);
            return;
        }
        console.log("made it");
        console.log(data);
        // console.log(rowData);
        const updatedRowData = [...rowData];
        const rowNum = data[0];
        // console.log(typeof (rowNum));
        // console.log(typeof(5));
        // console.log(chosenColor);
        // console.log(updatedRowData);
        // console.log(rowNum);
        updatedRowData[rowNum].selectedColor[data[1]] = data[2];
        updatedRowData[rowNum].columnNumber = data[1];
        // console.log(updatedRowData[rowNum].selectedColor);

        // console.log(updatedRowData);
        // console.log(data[0]);
        setRowData(updatedRowData);
    }


    return (
        <ColorContext.Provider value={chosenColor}>
            {rowData.length > 1 ? (
                <div className="drawingPanel"
                // onClick={drawPicture}
                >
                    <div id="pixels" >{rowData.map((child, index) => (
                        <MemoizedRow key={child.index} index={child.index} width={child.width} selectedColor={child.selectedColor} chosenColor={child.chosenColor} socket={socket} columnNumber={child.columnNumber} />
                    ))


                    }</div>
                    <div className="colors">
                        <div onClick={colorUpdate} className="color #000000 black" />
                        <div onClick={colorUpdate} className="color #FF0000 red" />
                        <div onClick={colorUpdate} className="color #00FF00 green" />
                        <div onClick={colorUpdate} className="color #0000FF blue" />
                        <div onClick={colorUpdate} className="color #FFFF00 yellow" />
                    </div>

                </div>
            ) :
                (
                    <p>Loading...</p>
                )}
        </ColorContext.Provider>

    );
}
const MemoizedRow = React.memo(Row);
