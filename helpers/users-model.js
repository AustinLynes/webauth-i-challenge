const db = require('../data/dbConfig')


module.exports = {
    find,
    findBy,
    add
}

function find(){
    return db('user')
}
function findBy(username){
    return db('user').where({username}).first()
}
function add(user){
    return db('user').insert(user)
}