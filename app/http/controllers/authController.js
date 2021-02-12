const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController() {
    return{
        login(req,res){
            res.render('auth/login')
        },
        
        postLogin(req, res, next) {
            passport.authenticate('local', (err, user, info)=> {
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')

                })
            })(req, res, next)            
        },

        register(req,res){
            res.render('auth/register')
        },

        async postRegister(req,res){
            const{ name, email, password } = req.body
            // Validating request
            // if(!name || !email || !password) {
            //     req.flash('error', 'All fields are mandatory!')
            //     req.flash('name', name)
            //     req.flash('email', email)
            //     return res.redirect('/register')
            // }

            // User already exist
            User.exists({email, email}, (err,result)=> {
                if(result){
                    req.flash('error', 'Email already exist!')
                    req.flash('name', name)
                    res.redirect('/register')
                }
            })

            // Making password encrypted
            const hashedpassword = await bcrypt.hash(password, 10)

            // Creating a new user
            const user = new User({
                name,               // name: name,
                email,              // email: email,
                password: hashedpassword
            })

            user.save().then((user)=> {
                // Login
                return res.redirect('/')
            }).catch(err=>{
                req.flash('error', 'Something went wrong!')
            })

        },

        logout(req,res) {
            req.logout()
            return res.redirect('/')
        }
    }
}

module.exports = authController