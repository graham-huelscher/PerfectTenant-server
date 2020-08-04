const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy({ 
    usernameField: 'email', 
    passReqToCallback : true 
  }, 
  (req, email, password, done) => {
    User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const name = req.query.name;
        const newUser = new User({ name, email, password });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                return done(null, user);
              })
              .catch(err => {
                return done(null, false, { message: err });
              });
          });
        });
      } else {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            return done(null, user);
          } else {
            return done(err, false, { message: 'Wrong password' });
          }
        });
      }
    })
    .catch(err => {
      return done(null, false, { message: err });
    });
  })
);

module.exports = passport;