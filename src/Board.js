import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './styles/board.css';

const Board = () => {
    const canvasRef = useRef(null);
    const colorsRef = useRef(null);
    const socketRef = useRef();

    const io = require('socket.io-client');
    const socket = io.connect(process.env);

    socket.on('connect', () => {
        console.log('Successfully connected!');
    });

    // var io = require('socket.io-client')
    // var socket = io.connect('localhost:8080', {reconnect: true});
    useEffect(() => {
        // var socket = io();
        const canvas = canvasRef.current;
        // const test = colorsRef.current;
        const context = canvas.getContext('2d');

        const colors = document.getElementsByClassName('color');

        const current = {
            color: 'black',
        };

        const onColorUpdate = (e) => {
            current.color = e.target.className.split(' ')[1];
        };

        for (let i = 0; i < colors.length; i++) {
            colors[i].addEventListener('click', onColorUpdate, false);
        }
        let drawing = false;

        const drawLine = (x0, y0, x1, y1, color, emit) => {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.stroke();
            context.closePath();
            // console.log(2);

            if (!emit) { return; }
            const w = canvas.width;
            const h = canvas.height;

            socketRef.current.emit('drawing', {
                x0: x0 / w,
                y0: y0 / h,
                x1: x1 / w,
                y1: y1 / h,
                color,
            });
            // console.log("hi");
        };
        const onMouseDown = (e) => {
            drawing = true;
            current.x = e.clientX || e.touches[0].clientX;
            current.y = e.clientY || e.touches[0].clientY;
        };

        const onMouseMove = (e) => {
            if (!drawing) { return; }
            drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
            // console.log(current.x);
            current.x = e.clientX || e.touches[0].clientX;
            current.y = e.clientY || e.touches[0].clientY;
        };

        const onMouseUp = (e) => {
            if (!drawing) { return; }
            drawing = false;
            drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
        };

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
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        canvas.addEventListener('touchstart', onMouseDown, false);
        canvas.addEventListener('touchend', onMouseUp, false);
        canvas.addEventListener('touchcancel', onMouseUp, false);
        canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);
        const onResize = () => {
            let w = window.innerWidth;
            let h = window.innerHeight;
            var temp_cnvs = document.createElement('canvas');
            var temp_cntx = temp_cnvs.getContext('2d');
            // set it to the new width & height and draw the current canvas data into it // 
            temp_cnvs.width = w;
            temp_cnvs.height = h;
            temp_cntx.fillStyle = "#FFFFFF";  // the original canvas's background color
            temp_cntx.fillRect(0, 0, w, h);
            temp_cntx.drawImage(canvas, 0, 0);
            // resize & clear the original canvas and copy back in the cached pixel data //
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;            
            context.drawImage(temp_cnvs, 0, 0);

        };

        window.addEventListener('resize', onResize, false);
        onResize();
        const onDrawingEvent = (data) => {
            console.log("hi");
            const w = canvas.width;
            const h = canvas.height;
            drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
        }

        socketRef.current = io.connect(process.env, { reconnect: true });
        //   console.log(socketRef.current);
        //   socket.on('drawing', onDrawingEvent);

        socketRef.current.on('drawing', onDrawingEvent);
        console.log(socketRef.current);
    }, []);
    return (
        <div>
            <canvas ref={canvasRef} className="whiteboard" />

            <div ref={colorsRef} className="colors">
                <div className="color black" />
                <div className="color red" />
                <div className="color green" />
                <div className="color blue" />
                <div className="color yellow" />
            </div>
        </div>
    );
};
export default Board;
