import React, {useEffect, useState} from "react";
import Pixel from "./Pixel";
import './styles/board.css';

export default function Row(props){
    const {index, width, choice, selectedColor, colors} = props;
    
    const initialState = [];
    // console.log(props.socket);
    
    for (let i = 0; i < width; i++){
        initialState[i] = {key: i, index: i, rowNum: index, selectedColor: selectedColor[i]};
        // pixels.push(<Pixel key = {i} index = {i} selection = {selection}  selectedColor = {selectedColor} preColor = {colors[i]}/>)
    }
    const [rowData, setRowData] = useState(initialState);
    useEffect(()=>{
        console.log(index);
        const updatedRowData = [...rowData];
        console.log(props.columnNumber);
        updatedRowData[props.columnNumber].selectedColor = selectedColor[props.columnNumber];
        console.log(updatedRowData[props.columnNumber]);
        console.log(updatedRowData);
        setRowData(updatedRowData);
            // props.chosen = !props.chosen;
    }, [props.selectedColor, props.columnNumber]);

    // useEffect(()=>{
    //     const updatedRowData = [...rowData];
    //     updatedRowData[props.columnNumber].chosenColor = props.chosenColor;
    //     setRowData(updatedRowData);
    // }, [props.chosenColor]);
    return(
        <div id = "row">
            {
            rowData.map((child, index)=>(
                <Pixel key = {index} index = {index} rowNum = {child.rowNum} selectedColor = {child.selectedColor} chosenColor = {props.chosenColor} socket = {props.socket}/>
            ))

        }</div>
    )
}