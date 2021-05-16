const crypto = require('crypto');
var passport = require('passport');

let hash = (data => {
    var hash = crypto.createHash("sha256");
    hash.update(data)

    return hash.digest("hex");
});

module.exports = function (app, myDataBase) {
    app.get('/', (req, res) => {
        res.render('pug', {
            showLogin: true,
            showRegistration: true,
            showSocialAuth: true
        });
    });

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
        myDataBase.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                next(err);
            } else if (user) {
                res.redirect('/');
            } else {
                myDataBase.insertOne({
                    username: req.body.username,
                    password: password_hash,
                    name: req.body.name
                }, (err, doc) => {
                    if (err) {
                        res.redirect('/');
                    } else {
                        next(null, doc.ops[0]);
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
        res.render(process.cwd() + '/views/pug/chat', {
            user: req.user
        })
    })

    app.get('/auth/github', passport.authenticate('github', {
        scope: ['user:email']
    }));
    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/'
    }), (req, res) => {
        req.session.user_id = req.user.id;
        res.redirect('/chat');
    });
}