require('dotenv').config();
var ObjectID = require("mongodb").ObjectID;
var LocalStrategy = require('passport-local');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
const crypto = require('crypto');

let hash = (data => {
    var hash = crypto.createHash("sha256");
    hash.update(data)

    return hash.digest("hex");
});

module.exports = function (app, myDataBase) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        myDataBase.findOne({
            _id: new ObjectID(id)
        }, (err, doc) => {
            done(null, doc);
        });
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            myDataBase.findOne({
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

    passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile);

            myDataBase.findOneAndUpdate({
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
                    return cb(null, doc.value);
                }
            );
        }
    ));
}