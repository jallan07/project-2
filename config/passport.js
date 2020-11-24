const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const linkedinKeys = require('./linkedin-keys');

const User = require('../models').User;

// Login using the Linkedin Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: linkedinKeys.linkedinAuth.clientID,
      clientSecret: linkedinKeys.linkedinAuth.clientSecret,
      callbackURL: linkedinKeys.linkedinAuth.callbackURL,
      scope: ['r_emailaddress', 'r_liteprofile']
    },
    function (token, tokenSecret, profile, done) {
      console.log(profile); // entire profile object
      console.log(profile.name.givenName); // first name
      console.log(profile.name.familyName); // last name
      console.log(profile.emails[0].value); // email address
      console.log(profile.id); // linkedin profile id
      console.log(token); // linkedin token
      // return done(null, profile);
      User.findOne({
        where: {
          profileID: profile.id
        }
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        // No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            username: profile.username,
            profileID: profile.id
            // now in the future searching on User.findOne({'profileID': profile.id } will match because of this next line
            // linkedin: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
        // found user. Return
          return done(err, user);
        }
      });
    }
  )
);

// In order to help keep authentication state across HTTP requests, Sequelize needs to serialize and deserialize the user. Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
