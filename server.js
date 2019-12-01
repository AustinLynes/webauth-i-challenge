const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bcrypt = require('bcrypt')
const session = require('express-session')

const server = express()
server.use(express.json())
server.use(morgan('combined'))
server.use(helmet())
server.use(cors())
const sessionConfig = {
    name: 'monkey', //sid
    secret: 'shhh... its a secret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,  // should be 1 day  86,400,000
        secure: false,     // false ?== http  true ?== https
        httpOnly: true       //can only be accessed from http NO JS
    },
    resave: false,
    saveUninitialized: false  //GDPR laws against setting cookies automaticly
    //ask user to save the cookie! 
    //change dynamicly
}
server.use(session(sessionConfig))
const Users = require('./helpers/users-model')

//restriction middleware... used for sessions
function restricted(req, res, next) {
    if (req.session && req.session.user) {
        console.log('here boss!')
        next()
    }else {
        res.status(401).json({ messege: 'No Credentials Provided' })
    }
}

server.get('/users',restricted, (req, res) => {
    Users.find().then(_user => { !_user ? res.status(404).json({ messege: 'sorry no users...' }) : res.json(_user) }).catch((err) => { res.status(500).json({ err }) })
})
//DEBUG
server.get('/users/:username', (req, res) => {
    const username = req.params.username
    Users.findBy(username).then(_user => { !_user ? res.status(404).json({ messege: 'sorry no users...' }) : res.json(_user) }).catch((err) => { res.status(500).json({ err }) })
})

server.post('/login', (req, res) => {
    const credentials = req.body
    Users.findBy(credentials.username)
    .then(_user => {
        if (_user && bcrypt.compareSync(credentials.password, _user.password, 12)) {
                req.session.user = _user
                res.status(200).json({ message: `Welcome ${_user.username}!` });
            } else {
                res.status(401).json({ messege: 'invalid credentials' })
            }
        })
        .catch((err) => {
            res.status(500).json({ err })
        })
})

server.post('/register', (req, res) => {
    const user = req.body
    const hash = bcrypt.hashSync(user.password, 12)
    user.password = hash
    Users.add(user).then(
        _user => {
            !_user ?
                res.status(404).json({ messege: 'sorry no users...' }) :
                res.status(201).json({ messege: 'user created successfully boss!', _user })
        }
    )
        .catch(() => {
            res.status(500).json({ err })
        })
})

//Logout
server.get('/logout',(req,res)=>{
    if(req.session &&  req.session.user){
        req.session.destroy(err=>{
            if(err){
                res.json({messege:'sorry.. logout is unavalable at this time boss...'})
            }else{
                res.status(200).json({message:'log out sucessful!'})
            }
        })
    }else{
        res.status(200).json({messege:'You weren\'t logged in to begin with boss...'})
    }
})


module.exports = server
