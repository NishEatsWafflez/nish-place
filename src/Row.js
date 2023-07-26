import React, {useEffect, useState} from "react";
import Pixel from "./Pixel";
import './styles/board.css';

export default function Row(props){
    const {index, width, choice, selectedColor, colors} = props;
    
    const initialState = [];
    
    for (let i = 0; i < width; i++){
        initialState[i] = {key: i, index: i, rowNum: index, selectedColor: selectedColor[i]};
    }
    const [rowData, setRowData] = useState(initialState);
    useEffect(()=>{
        // console.log(index);
        const updatedRowData = [...rowData];
        // console.log(props.columnNumber);
        updatedRowData[props.columnNumber].selectedColor = selectedColor[props.columnNumber];
        // console.log(updatedRowData[props.columnNumber]);
        // console.log(updatedRowData);
        setRowData(updatedRowData);
    }, [props.selectedColor, props.columnNumber]);

    return(
        <div id = "row">
            {
            rowData.map((child, index)=>(
                <Pixel key = {index} index = {index} rowNum = {child.rowNum} selectedColor = {child.selectedColor} chosenColor = {props.chosenColor} socket = {props.socket}/>
            ))

        }</div>
    )
}