var passport    = require('passport'),
    config      = require('./devoauth.js'),
    FbStrategy  = require('passport-facebook').Strategy,
    User        = require('./users.js');

var admin = ["Jeremy Tripp"];
var family = ["Alex Tripp"];
var friends = [
    "Ross Carter",
    "Bo Burasco",
    "Christopher Gatzke",
    "Michael Stramel",
    "Ben Majchrzak",
    "Tom McGeehon"];

// ===== fb login config =====
module.exports = passport.use(new FbStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'emails']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }, function(err, user) {
            if(err) {
                console.log(err);  // handle errors!
            }
            if (!err && user !== null) {
                done(null, user);
            } else {
                if (admin.indexOf(profile.displayName) > -1) {
                    user = new User({
                        oauthID: profile.id,
                        full_name: profile.displayName,
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email: profile.emails[0].value,
                        picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
                        created: Date.now(),
                        roles: ["admin"]
                    });
                    console.log(profile);
                    user.save(function (err) {
                        if (err) {
                            console.log(err);  // handle errors!
                        } else {
                            console.log("Saving user as admin...");
                            done(null, user);
                        }
                    });
                } else if (family.indexOf(profile.displayName) > -1) {
                    user = new User({
                        oauthID: profile.id,
                        full_name: profile.displayName,
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email: profile.emails[0].value,
                        picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
                        created: Date.now(),
                        roles: ["family"]
                    });
                    user.save(function (err) {
                        if (err) {
                            console.log(err);  // handle errors!
                        } else {
                            console.log("Saving user as family...");
                            done(null, user);
                        }
                    });
                } else if (friends.indexOf(profile.displayName) > -1) {
                    user = new User({
                        oauthID: profile.id,
                        full_name: profile.displayName,
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email: profile.emails[0].value,
                        picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
                        created: Date.now(),
                        roles: ["friend"]
                    });
                    user.save(function (err) {
                        if (err) {
                            console.log(err);  // handle errors!
                        } else {
                            console.log("Saving user as friend...");
                            done(null, user);
                        }
                    });
                } else {
                    user = new User({
                        oauthID: profile.id,
                        full_name: profile.displayName,
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email: profile.emails[0].value,
                        picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
                        created: Date.now(),
                        roles: ["user"]
                    });
                    user.save(function (err) {
                        if (err) {
                            console.log(err);  // handle errors!
                        } else {
                            console.log("Saving user...");
                            done(null, user);
                        }
                    });
                }
            }
        });
    }
));