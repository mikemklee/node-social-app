const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
const { User } = require('../models/User');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {

      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

      User.findOne({
        googleID: profile.id
      })
        .then(user => {
          if (user) {
            // return user
            done(null, user);
          } else {
            // create user

            const newUser = {
              googleID: profile.id,
              email: profile.emails[0].value,
              firstName: profile.givenName,
              lastName: profile.familyName,
              image
            }

            new User(newUser)
              .save()
              .then(user => done(null, user));
          }
        });
    })
  );
}