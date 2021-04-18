const express = require('express'),
	app = express(),
    path = require('path'),
    // express = require('express'),
    // socketio=require("socket.io"),
	mongoose = require('mongoose'),
	passport = require('passport'),
    http= require('http'),
	bodyParser = require('body-parser'),
	Doc = require('./models/docs'),
	User = require('./models/users'),
	// Notification = require('./models/notifications'),
	LocalStrategy = require('passport-local'),
    cors = require("cors"),
	passportLocalMongoose = require('passport-local-mongoose');
    var server = http.createServer(app);

const socketIo = require("socket.io");
const io = socketIo(server);
mongoose.set('useUnifiedTopology', true);
var mongoDB = 'mongodb+srv://dhanush:SmmXgXdZh3HjPtum@cluster0.uhyal.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
app.use(
	require('express-session')({
		secret: 'wassup! XD',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
// app.http().io();

app.use(express.static(__dirname + '/public'));
app.use(
	require('express-session')({
		secret: 'i love trichy',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
var using;


////////-----------------------------------------------------------routes----------------------------//////////////
//-------------landing page--------------
app.get('/', function (req, res) {
	User.find({}, function (err, r) {
		res.render('login', { c: r });
	});
});

//-----------------------------

//-------------signup--------------
app.get('/signup', function (reeq, res) {
	res.render('signup');
});

app.post('/signup', function (req, res) {
	req.body.username;
	req.body.password;
	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		function (err, user) {
			passport.authenticate('local')(req, res, function () {
				res.redirect('/home');
			});
		}
	);
});

//-------------login--------------
app.post('/login',passport.authenticate('local', {
		successRedirect: '/home',
		failureRedirect: '/',
	}),
	function (req, res) {
		req.body.username;
		req.body.password;
	}
);
app.get('/home',islogin,function(req,res){
    Doc.find({},function(err,docs){
        res.render('home.ejs',{docs:docs,user:req.user.username})
    })
})
//------------------------------
app.get('/home/:room', islogin,function (req, res) {
    Doc.findOne({room:req.params.room},function(err,room){
        User.find({},function(err,user){
            // console.log(user)
            var users = [];
            for(var i=0;i<user.length;i++){
                for (var j = 0; j < room.username.length; j++) {
                    if (user[i].username !== room.username[j]&&room.username.indexOf(user[i].username) == -1&& users.indexOf(user[i]) == -1) {
                         users.push(user[i])

                    }
                }
            }
            // console.log(users)
            var docsRoom =[];
            Doc.find({},function(err,rooms){
                for(var i =0;i<rooms.length;i++){
                    if(rooms[i].room !== room.room&&rooms[i].username.indexOf(req.user.username)!==-1){
                        docsRoom.push(rooms[i]);
                    }
                }
                res.render('file',{user: req.user.username,room:room,users:users,rooms:docsRoom});
            })
            
        })
        
    })
	
});
app.post('/save/:room',function(req,res){
    Doc.findOne({room:req.params.room},function(err,doc){
        doc.Content = req.body.Content;
        doc.save();
        res.send("alooo")
    })
})
app.post('/create',function(req,res){
    Doc.create({room:req.body.room},function(err,doc){
        doc.username.push(req.user.username);
        doc.owner = req.user.username;
        doc.save();
        res.redirect('/home/'+req.body.room);
    })
})
app.post('/add/:room',function(req,res){
    usernames = req.body.users;
    console.log(usernames+req.params.room);
    Doc.findOne({room:req.params.room},function(err,room){
        for(var i=0;i<usernames.length;i++){
            room.username.push(usernames[i])
        }
        room.save();
        res.send("awesome")
    })
} )

//-------------home--------------


//-------------landing page for each feature--------------


//-------------main page for each page-------------------------------------------------------------------------------------------------------------


//-------------when the person doesnt attend the call--------------------------------------------------------------------------------------------------

//-------------logout--------------------------------------------------------------------------------------------------------------------
app.post('/logout', function (req, res) {
	var x = req.user.username;
	User.find({ username: req.user.username }, function (err, user) {
		if (err) {
			console.log('shit sorry');
		}
		user.forEach(function (usr) {
			console.log(usr.username);
			usr.status = 'offline';
			console.log(usr.status);
			usr.save();
		});
	});
	res.redirect('/logout');
});
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

//-------------------middleware to check if perosn is logged in---------------------------------------------------------------------------------------
function islogin(req, res, next) {
	if (req.isAuthenticated()) {
		User.find({ username: req.user.username }, function (err, user) {
			if (err) {
				console.log('shit sorry');
			}
			user.forEach(function (usr) {
				usr.status = 'online';
				usr.save();
			});
		});
		return next();
	} else {
		res.redirect('/');
	}
}

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

io.on("connection", (socket) => {
    var rooms;
    console.log("New client connected");
    socket.on('joinRoom',({room})=>{
        socket.join(room);
        rooms =room
        io.to(room).emit('render',"finally")
        io.to('33').emit('render',"Wrong room")
    })
    socket.on('move',({data})=>{
        socket.broadcast.to(rooms).emit('moved',data)
        console.log(data)
    })
    

});

//----------------------use of initial signaling to set up webrtc-------------------------------------------------------------------------------------
//----------------------------------ready is emmitted---------------------------------------------------------

//-----------------------------send is emitted--------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------
server.listen(3000, function () {
	console.log('Server Started XD');
});