

var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');


module.exports = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({usernameField : 'email',passwordField : 'password',passReqToCallback : true},
        function(req,email,password,done){ cb(req,email,password,done);})
    )

    passport.use(
        'local-login',
        new LocalStrategy({ usernameField : 'email',passwordField : 'password', passReqToCallback:true},
        function(req,email,password,done){  
            login(req,email,password,done); 
        })
    )
}


function cb(req,email,password,done){
    User.findOne({'local.email': email},function(err,user){
        if(err) return done(err);

        if(user){
            return done(null,false,req.flash('signupMessage','Email is already taken'))
        }
        else{
            var newUser = new User();
            newUser.local.email = email;
            newUser.local.Password = newUser.generateHash(password);
            console.log(newUser);
            newUser.save(function(err){
                if(err) throw err;
                return done(null,newUser);
            })
        }
    })
}

function login(req,email,password,done){
    console.log(email);
    console.log(password);
    User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);

          
        // if no user is found, return the message
        if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            console.log(user);
        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
           
        // all is well, return successful user
        return done(null, user);
    });

}