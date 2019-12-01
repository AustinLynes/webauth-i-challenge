const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bcrypt = require('bcrypt')
const server = express()
server.use(express.json())
server.use(morgan('combined'))
server.use(helmet())
server.use(cors())

const Users = require('./helpers/users-model')

//  !!! restrict to only logged in users !!!
server.get('/users', (req, res) => {
    Users.find().then(_user => { !_user ? res.status(404).json({ messege: 'sorry no users...' }) : res.json(_user) }).catch((err) => { res.status(500).json({ err }) })
})
//DEBUG
server.get('/users/:username', (req, res) => {
    const username = req.params.username
    Users.findBy(username).then(_user => { !_user ? res.status(404).json({ messege: 'sorry no users...' }) : res.json(_user) }).catch((err) => { res.status(500).json({ err }) })
})

server.post('/login', (req, res) => {
    const credentials  = req.body
    Users.findBy(credentials.username)
        .then(_user => {
            if(_user && bcrypt.compareSync(credentials.password,_user.password,12))
            { 
                res.status(200).json({ message: `Welcome ${_user.username}!` });
            }else{
                res.status(401).json({messege:'invalid credentials'})
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

function restricted(req, res, next) {

}


module.exports = server
