const config = require('config')
const helmet = require('helmet') // commonly used for setting secure HTTP headers
const morgan = require('morgan') // commonly used for logging HTTP requests
const Joi = require('joi')
const logger = require('./logger')
const express = require('express')
const app=express()

console.log(`NODE_ENV:${process.env.NODE_ENV}`) //undefined
console.log(`app:${app.get('env')}`) //development

app.use(express.json())
app.use(helmet())
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
    console.log("morgan enabled.")
}

//can parse url encoded key&value pair
app.use(express.urlencoded({extended:true}))
//localhost:3000/textfile.txt
app.use(express.static('static_content'))

const courses = [
    { id:1, name: 'course1'},
    { id:2, name: 'course2'},
    { id:3, name: 'course3'},
]

app.get('/',(req, res) => {
    res.send('test')
})

app.get('/api/numbers', (req,res)=>{
    res.send([1,2,3])
})

app.get('/api/courses',(req, res)=>{
    res.send(courses)
})

app.get('/api/courses/:id',(req, res)=>{
    const course = courses.find(c=>c.id=== parseInt(req.params.id))
    if (!course){
        return res.status(404).send('The course with the given ID was not found.')
    }
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    const course = {
        id:courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res)=>{
    //validate id exists
    const course = courses.find(c=>c.id=== parseInt(req.params.id))
    if (!course){
        return res.status(404).send('The course with the given ID was not found.')
    }
    //validate req body
    const {error} = validateCourse(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    //change course
    course.name = req.body.name
    res.send(course)
})

app.delete('/api/courses/:id', (req, res)=>{
    //validate id exists
    const course = courses.find(c=>c.id=== parseInt(req.params.id))
    if (!course){
        return res.status(404).send('The course with the given ID was not found.')
    }
    //delete
    const index = courses.indexOf(course)
    courses.splice(index, 1);
    res.send(course)
})

//http://localhost:3000/api/params/2021/4
app.get('/api/params/:year/:month',(req, res)=>{
    res.send(req.params)
})

//http://localhost:3000/api/query/2021/4?sortBy=name
app.get('/api/query/:year/:month',(req, res)=>{
    res.send(req.query)
})

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(course)
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))