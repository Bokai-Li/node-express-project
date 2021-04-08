const Joi = require('joi')
const express = require('express')
const app=express()

app.use(express.json())

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