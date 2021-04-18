var express = require('express.io'),
	app = express(),
	multer = require('multer'),
    path = require('path'),
	helpers = require('./helpers'),
    express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	Chat = require('./models/chats'),
	User = require('./models/users'),
	Notification = require('./models/notifications'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose');
const axios = require('axios').default;
mongoose.set('useUnifiedTopology', true);
var mongoDB = 'mongodb://localhost/project';
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
app.http().io();
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },

    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
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
app.post('/upload', (req, res) => {

    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('upFile');
    console.log(req.file);
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
		var name = "" ;
		for (var i=6;i<req.file.path.length;i++){
			name = name + req.file.path[i];}
		User.findById(req.user._id,function(err,user){
			user.img = name;
			user.save();
			res.redirect("/userpage");
		})
		
    });
});
app.post('/uploadT', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('tFile');
    console.log(req.file);
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select --- an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
		var name = "" ;
		for (var i=6;i<req.file.path.length;i++){
			name = name + req.file.path[i];}
		User.findById(req.user._id,function(err,user){
			user.img = name;
			user.save();
			res.redirect("/userpage");
		})
		
    });
});

//-------------signup--------------
app.get('/signup', function (reeq, res) {
	res.render('signup');
});

app.post('/signup', function (req, res) {
	req.body.username;
	req.body.password;
	User.register(
		new User({ username: req.body.username, type: req.body.type }),
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
//------------------------------
app.get('/userpage', islogin,function (req, res) {
	res.render('userpage',{user: req.user});
});


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


app.listen(3000, function () {
	console.log('Server Started XD');
});