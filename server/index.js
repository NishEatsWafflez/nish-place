const express = require('express');
require("dotenv").config();
const pixelsRouter = require('./routes/pixel');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose')
const url = process.env.ATLAS_URI
// const connectionParams={
//   useNewUrlParser: true,
//   useUnifiedTopology: true 
// }
mongoose.connect(url)
  .then( () => {
      console.log('Connected to database ')
  })
  .catch( (err) => {
      console.error(`Error connecting to the database. \n${err}`);
  })
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/pixels', pixelsRouter);
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
// const io = socket(server);

io.on('connection', onConnection);

function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

const port = 8080;
server.listen(port, () => console.log(`server is running on port ${port}`));

