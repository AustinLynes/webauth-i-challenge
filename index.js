const server = require('./server')
const PORT = process.env.PORT || 4000

server.use((req,res,next)=>{
    
})

server.listen(PORT, ()=>{
    console.log(`server open on ${PORT}`)
})