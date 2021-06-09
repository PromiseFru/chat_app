const crypto = require('crypto');
var passport = require('passport');

let hash = (data => {
    var hash = crypto.createHash("sha256");
    hash.update(data)

    return hash.digest("hex");
});

let MongoDB = require("../database").MongoDB;
const db = new MongoDB();
const User = db.models.users;

module.exports = function (app) {
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    };

    app.post("/login", passport.authenticate("local", {
        failureRedirect: "/"
    }), (req, res) => {
        req.session.user_id = req.user.id;
        res.redirect("/chat");
    })

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })

    app.post('/register', (req, res, next) => {
        const password_hash = hash(req.body.password);
        User.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                next(err);
            } else if (user) {
                res.redirect('/');
            } else {
                User.create({
                    username: req.body.username,
                    password: password_hash,
                    nickname: req.body.nickname
                }, (err, doc) => {
                    if (err) {
                        res.redirect('/');
                    } else {
                        next(null, doc);
                    }
                })
            }
        })
    }, passport.authenticate('local', {
        failureRedirect: '/'
    }), (req, res, next) => {
        req.session.user_id = req.user.id;
        res.redirect('/chat');
    });

    app.get('/chat', ensureAuthenticated, (req, res) => {
        // console.log(req.user)
        res.sendFile(process.cwd() + '/views/html/chat.html', {
            user: req.user
        })
    })

    app.get('/whoami', ensureAuthenticated, (req, res) => {
        res.json({
            user: req.user
        });
    });

    app.get('/auth/google', passport.authenticate('google', {
        scope: ['email', 'profile']
    }));
    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/'
    }), (req, res) => {
        req.session.user_id = req.user.id;
        res.redirect('/chat');
    });

    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/'
    }), (req, res) => {
        req.session.user_id = req.user.id;
        res.redirect('/chat');
    });
}