'use strict';

var express    = require('express'),
	getWeather    = require('./public/js/weather.js'),
	mongoose    = require('mongoose'),
	passport    = require('passport'),
	//config    = require('./public/js/oauth.js'),
	//FbStrategy    = require('passport-facebook').Strategy,
	morgan    = require('morgan'),
	bodyParser    = require('body-parser'),
	multer    = require('multer'),
	methodOverride = require('method-override'),
	session    = require('express-session'),
    User    = require('./public/js/users.js'),
    PostModel    = require('./public/js/posts.js'),
    AdminSetting   = require('./public/js/adminSettings.js'),
	fbAuth    = require('./public/js/authentication.js'),
lightsFile    = require('./lightsObject.json'),
    LightsModel    = require('./public/js/lights.js'),
    hue    = require("node-hue-api"),
    fs    = require('fs');

var port = 8080;

//===== db connection =====
mongoose.connect('mongodb://localhost/jeremytripp-com');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function() {
	// we're connected!
	console.log("DB connection successful");
});
//===== end db connection =====

// serialize and deserialize
passport.serializeUser(function(user, done) {
	console.log('serializeUser: ' + user._id);
	done(null, user._id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user){
		console.log(user);
		if(!err) done(null, user);
		else done(err, null);
	});
});

//===== Hue =====

// var HueApi = require("node-hue-api").HueApi,
//     lightState = hue.lightState,
//     timeout = 5000;
//
// var displayResult = function(result) {
//     console.log(JSON.stringify(result, null, 2));
// };
//
// var displayError = function(err) {
//     console.error(err);
// };
//
// var displayBridges = function(bridge) {
//     console.log("Hue Bridges Found: " + JSON.stringify(bridge));
// };
//
// hue.nupnpSearch().then(displayBridges).done();
// hue.upnpSearch(timeout).then(displayBridges).done();
//
// var hostname = "192.168.0.2",
//     username = "fDRUhrzvj1l3q1nktnrIwSdxlQ08BCCzIJAgXsRy",
//     api = new HueApi(hostname, username),
//     state = lightState.create(),
var lightsObject;
//
//Get all lights attached to the bridge
// api.lights(function(err, lights) {
//     if (err) throw err;
//     lights = JSON.stringify(lights);
//     fs.writeFile('lightsObject.json', lights, function(err) {
//         if (err) throw err;
//         console.log('Lights file updated!');
//     });
//     // displayResult(lightsObject);
//     // console.log(lightsFile);
// });

lightsObject = lightsFile;

// ==========

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/public'));
app.use(morgan('combined'));
//app.use(cookieParser({secret: 'my_precious'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(multer());
app.use(methodOverride());
app.use(session({
    secret: 'my_precious',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);
app.use(function(req, res, next){
    if (req.session.user) {
        res.locals.user = req.session.user
    }
    next();
});
app.use( function( req, res, next ) {
    if ( req.query._method == 'DELETE' ) {
        req.method = 'DELETE';
        req.url = req.path;
    }
    next();
});

//To add additional routes, specify the path
// then res.render the Pug file and pass any needed variables
app.get('/', function(req, res) {
    var path = req.path;
    res.render('index.pug', {path: path, user: req.user});
});

app.get('/please-sign-in', function(req, res) {
    var path = req.path;
    res.render('please-sign-in', {path: path, user: req.user});
});

app.get('/need-admin', function(req, res) {
    var path = req.path;
    res.render('need-admin', {path: path, user: req.user});
});

app.get('/admin', ensureAuthenticated, function(req, res) {
    var path = req.path;
    var lightsList;
    LightsModel.find({}, function(err, lights) {
        var name = req.params.name;
        if (name === undefined) {
            if (err || !lights) {
                res.status(503);
            } else {
                lightsList = Object.keys(lights).map(function (value) {
                    return lights[value]
                });
                console.log(lightsList);
            }
        }
    });

    AdminSetting.findOne({}).select("weatherService").exec(function(err, doc){
        PostModel.find({}, function(err, posts){
            var title = req.params.title;
            if (title === undefined) {
                if (err || !posts) {
                    res.status(503);
                } else {
                    var postsLists = Object.keys(posts).map(function(value) {
                        return posts[value]});
                    if (err || !doc) {
                        res.render('admin.pug', {path: path, user: req.user, isDarkSky: true, posts: postsLists, lightsObject: lightsObject, lightsList: lightsList });
                    } else {
                        res.render('admin.pug', {path: path, user: req.user, isDarkSky: doc.weatherService === "Dark Sky", posts: postsLists, lightsObject: lightsObject, lightsList: lightsList });
                    }
                }
            }

        });

    });
});

app.get('/new-post', function(req, res) {
    var path = req.path;
    res.render('new-post.pug', {path: path, user: req.user});
});

app.get('/edit-post/:title', function(req, res) {
    PostModel.find({}, function(err, posts){
        var title = req.params.title;
        if (title === undefined) {
            if (err || !posts) {
                res.status(503);
            } else {
                var postsLists = Object.keys(posts).map(function(value) {
                    return posts[value]});
                res.render('blog', {user: req.user, posts: postsLists}); //need to handle this differently
            }
        } else {
            var post = posts.filter(function(postObject){
                    return postObject.title === title;
                })[0] || {};
            console.log(post, title);
            res.render('edit-post', { user: req.user, post: post, includeEdit: true});
        }
    });
});

app.post('/config', function(req, res) {
    AdminSetting.findOneAndUpdate({}, req.body, {upsert: true, new: true}, function(err, doc){
        if (err || !doc) {
            res.status(400).send("Something fucked up. Couldn't save.");
        } else {
            res.json(doc);
        }
    });
});

// app.put('/lighton', function(req, res) {
//     //Set the state of the light
//     // console.log("This light's id is ", req.body.lightId);
//     api.setLightState(req.body.lightId, state.on())
//     // .then(displayResult)
//         .fail(displayError)
//         .done();
//
// });
//
// app.put('/lightoff', function(req, res) {
//     //Set the state of the light
//     // console.log("This light's is ", req.body.lightId);
//     api.setLightState(req.body.lightId, state.off())
//     // .then(displayResult)
//         .fail(displayError)
//         .done();
// });

app.post('/add-post', function(req, res) {
    PostModel.findOneAndUpdate({title: req.body.title}, req.body, {upsert: true, new: true}, function(err, doc){
        if (err || !doc) {
            res.status(400).send("Something fucked up. Couldn't save.");
        } else {
            res.json(doc);
        }
    });
});

app.post('/edit', function(req, res) {
    PostModel.findOneAndUpdate({_id: req.body._id}, req.body, {upsert: true, new: true}, function(err, doc){
        if (err || !doc) {
            res.status(400).send("Something fucked up. Couldn't save.");
        } else {
            console.log(req.body);
            res.json(doc);
        }
    });
});

app.delete('/delete/:title', function(req, res) {
    PostModel.findOne({title:req.params.title})
        .exec(function(err, doc) {
            if (err || !doc) {
                res.statusCode = 404;
                res.send({});
            } else {
                doc.remove(function(err) {
                    if (err) {
                        res.statusCode = 403;
                        res.send(err);
                    } else {
                        res.redirect('back');
                    }
                });
            }
        });
});

app.get('/weather', function(req, res) {
    AdminSetting.findOne({}).select("weatherService").exec(function(err, doc){
        getWeather((doc && doc.weatherService) || "Dark Sky",function(weatherObject){
            res.render('weather.pug', {
                temp: weatherObject.temp,
                city: weatherObject.city,
                condition: weatherObject.condition,
                summary: weatherObject.summary,
                highTemp: weatherObject.highTemp,
                lowTemp: weatherObject.lowTemp,
                icon: weatherObject.icon,
                user: req.user
            });
        });
    });
});

app.get('/account', ensureAuthenticated, function(req, res){
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);  // handle errors
        } else {
            res.render('account', { user: user });
        }
    });
});

app.get('/blog/:title?', function(req, res){
    PostModel.find({}, function(err, posts){
        var title = req.params.title;
        if (title === undefined) {
            if (err || !posts) {
                res.status(503);
            } else {
                var postsLists = Object.keys(posts).map(function(value) {
                    return posts[value]});
                res.render('blog', {user: req.user, posts: postsLists})
            }
        } else {
            var post = posts.filter(function(postObject){
                    return postObject.title === title;
                })[0] || {};
            console.log(post, title);
            res.render('post', { user: req.user, post: post});
        }
    });
});

app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email'}),
    function(req, res){});
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        if (req.user.roles[0] === "admin") {
            res.redirect('/admin');
        } else {
            res.redirect('back');
        }
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// Production (8080, '104.236.229.149');
app.listen(port, '104.236.229.149');

if (port === 3000) {
	console.log('Server running on localhost:3000');
} else if (port === 8080) {
	console.log('Server running at http://104.236.229.149:8080/');
} else {
	console.log('There may be an issue with the port configured in app.js');
}

// test authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.roles[0] === "admin") {
        return next();
    } else if (req.isAuthenticated() && req.user.roles[0] !== "admin") {
        res.redirect('/need-admin');
    } else {
        res.redirect('/please-sign-in');
    }
}

module.exports = app;