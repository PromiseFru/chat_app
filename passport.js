require('dotenv').config();
var ObjectID = require("mongodb").ObjectID;
var LocalStrategy = require('passport-local');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
const crypto = require('crypto');

let hash = (data => {
    var hash = crypto.createHash("sha256");
    hash.update(data)

    return hash.digest("hex");
});

let MongoDB = require("./database").MongoDB;
const db = new MongoDB();
const User = db.models.users;

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            _id: new ObjectID(id)
        }, (err, doc) => {
            done(null, doc);
        });
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({
                username: username
            }, function (err, user) {
                console.log('User ' + username + ' attempted to log in.');
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (hash(password) != user.password) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            passReqToCallback: true
        },
        function (request, accessToken, refreshToken, profile, done) {
            // console.log(profile);

            User.findOneAndUpdate({
                    id: profile.id
                }, {
                    $setOnInsert: {
                        id: profile.id,
                        name: profile.displayName,
                        photo: profile.photos[0].value || '',
                        email: Array.isArray(profile.emails) ?
                            profile.emails[0].value : 'No public email',
                        created_on: new Date(),
                        provider: profile.provider || ''
                    },
                    $set: {
                        last_login: new Date()
                    },
                    $inc: {
                        login_count: 1
                    }
                }, {
                    upsert: true,
                    new: true
                },
                (err, doc) => {
                    return done(null, doc.value);
                }
            );
        }
    ));

    passport.use(new GithubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/github/callback',
            passReqToCallback: true
        },
        function (request, accessToken, refreshToken, profile, done) {
            // console.log(profile);

            User.findOneAndUpdate({
                    id: profile.id
                }, {
                    $setOnInsert: {
                        id: profile.id,
                        name: profile.displayName,
                        photo: profile.photos[0].value || '',
                        email: Array.isArray(profile.emails) ?
                            profile.emails[0].value : 'No public email',
                        created_on: new Date(),
                        provider: profile.provider || ''
                    },
                    $set: {
                        last_login: new Date()
                    },
                    $inc: {
                        login_count: 1
                    }
                }, {
                    upsert: true,
                    new: true
                },
                (err, doc) => {
                    return done(null, doc.value);
                }
            );
        }
    ));
}