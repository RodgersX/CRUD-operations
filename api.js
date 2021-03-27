const express = require('express')
const mongoose = require('mongoose')

const Student = require('./studentSchema')

const router = express.Router()

const query = 'mongodb+srv://brian:briantest@cluster0.vv8md.mongodb.net/TestDB?retryWrites=true&w=majority'

const db = (query)
mongoose.Promise = global.Promise

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if(err) {
        console.log(err)
    }
    console.log('Connection successful')

    router.get('/', (req, res) => {
        res.send('Hello World!')
    })

    // create operation
    router.post('/save', (req, res) => {
        var student = new Student()

        student.Name = req.body.name
        student.Roll = req.body.roll
        student.Address = req.body.address
        student.Birthday = req.body.bday
        student.StudentId = req.body.studId

        student.save().then(result => {
            res.send('Data inserted')
            console.log(result)
        }).catch(err => {
            console.log(err)
        })
    })

    // retrieve operation
    router.get('/findall', (req, res) => {
        Student.find().then(student => {
            res.json(student)
        }).catch(err => console.log(err))
    })

    // retrieve a single record
    router.get('/findfirst', (req, res) => {
        // $gt means greater than
        Student.findOne({ StudentId: { $gt: 30000000 } })
            .then(result => {
                res.json(result)
            }).catch(err => console.log(err))
    })

    // delete operation
    router.get('/delete', (req, res) => {
        Student.remove({ StudentId: 34153328 }).then(() => {
            res.json({ message: 'Successfully deleted' })
        }).catch(err => {
            res.json({ 
                message: 'Could not delete data',
                error: err
            })
        })
    })
})


module.exports = router