const express= require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);



//Import Route
const authRoute = require('./routes/auth');
const postroute = require('./routes/posts');

dotenv.config();

//connect Db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, ()=>
	console.log('Db is connected')
);

//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postroute);

app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket)=>{
	console.log('a scoket is conected!!!!')
	// socket.on('disconnect', ()=>{
	// 	console.log('Socket Disconnected....')
	// })


	socket.username = "Anonymous";

	socket.on('like-notification', function(notification){
		//console.log("User likes Photo :" + notification);
		io.emit("like-notification", notification);
		console.log(socket.username)
	});

});


server.listen(3000, ()=> console.log('server is listening on 3000...'));