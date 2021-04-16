const config = require('config')
const helmet = require('helmet') // commonly used for setting secure HTTP headers
const morgan = require('morgan') // commonly used for logging HTTP requests
//replace console.log. export DEBUG=app:startup
//export DEBUG=app:startup,app:db (if we have another debug namespace)
//export DEBUG=app:* for all namespace
const startupDebugger = require('debug')('app:startup') 

const Joi = require('joi')
const logger = require('./middleware/logger')

const courses = require('./routes/courses')

const express = require('express')
const app=express()

console.log(`NODE_ENV:${process.env.NODE_ENV}`) //undefined
console.log(`app:${app.get('env')}`) //development

app.use(express.json())
app.use(helmet())
app.use('/api/courses',courses)
//Configuration
//export NODE_ENV=development
//export NODE_ENV=production
//export app_password=1234
console.log('Application Name: '+config.get('name'))
console.log('Mail Server: ' + config.get('mail.host'))
console.log('Mail Server: ' + config.get('mail.password'))

//export NODE_ENV=production to disable logging and morgan
if(app.get('env')==='development'){
    app.use(logger)
    app.use(morgan('tiny'))
    startupDebugger("morgan enabled.")
}

//can parse url encoded key&value pair
app.use(express.urlencoded({extended:true}))
//localhost:3000/textfile.txt
app.use(express.static('static_content'))

app.get('/api/numbers', (req,res)=>{
    res.send([1,2,3])
})

//http://localhost:3000/api/params/2021/4
app.get('/api/params/:year/:month',(req, res)=>{
    res.send(req.params)
})

//http://localhost:3000/api/query/2021/4?sortBy=name
app.get('/api/query/:year/:month',(req, res)=>{
    res.send(req.query)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))