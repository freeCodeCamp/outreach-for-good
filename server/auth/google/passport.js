var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var env = require('../../config/environment');
var debug = require('debug')('route:auth:passport');

exports.setup = function(User, config) {
  //debug('passport: 1: ', User, ' 2: ', config)
  passport.use(new GoogleStrategy({
    clientID     : config.google.clientID,
    clientSecret : config.google.clientSecret,
    callbackURL  : config.google.callbackURL
  },
    function(accessToken, refreshToken, profile, done) {
      //debug('passport: 1: ', accessToken, ' 2: ', refreshToken, ' 3: ', profile, ' 4: ', done)
      User.findOne({
        'google.id' : profile.id
      }, function(err, user) {
        debug('Google Strategy');
        if(!user) {
          user = new User({
            name     : profile.displayName,
            email    : profile.emails[0].value,
            role     : 'guest',
            username : profile.username,
            provider : 'google',
            google   : profile._json
          });
          if(env.superUserEmail === user.email) {
            user.role = 'super';
          }
          debug('Adding user: ', user);
          user.save(function(err) {
            if(err) return done(err);
            done(err, user);
          });
        } else if(user.google.image.url !== profile._json.image.url) {
          user.google.image.url = profile._json.image.url;
          user.save(function(err) {
            if(err) return done(err);
            done(err, user);
          });
        } else {
          debug('Finished processing: ', user);
          return done(err, user);
        }
      });
    }
  ));
};
