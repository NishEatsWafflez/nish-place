import socketio from "socket.io-client";
import React from "react";
// import { SOCKET_URL } from "config";

export const socket = socketio.connect(process.env.SERVER_IP);
export const ColorContext = React.createContext();
