const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const app = express()

// tell express app to use ejs
// instantiated before any app.get, app.use, app.listen ...
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// connect to the mongodb
// create a db called star-wars-quote 
// add a table(collection) called quotes
MongoClient.connect('mongodb+srv://brian:briantest@cluster0.vv8md.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useUnifiedTopology: true
}).then(client => {
    console.log("connected to the Database")
    const db = client.db('star-wars-quotes')
    const qoutesCollection = db.collection('quotes')

    // read operation
    app.get('/', (req, res) => {
        const cursor = db.collection('quotes').find().toArray()
            .then(results => {
                res.render('index.ejs', { quotes: results })
            })
    })
    
    // create operation
    app.post('/quotes', (req, res) => {
        qoutesCollection.insertOne(req.body).then(result => {
            res.redirect('/')
        }).catch(err => console.error(err))
    })

    // update operation
    app.put('/quotes', (req, res) => {
        console.log(req.body)
        qoutesCollection.findOneAndUpdate({ name: 'Yoda' },
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            upsert: true
        }).then(result => {
            res.json('Success')
        }).catch(err => console.error(err))
    })

    // delete operation
    app.delete('/quotes', (req, res) => {
        qoutesCollection.deleteOne({ name: req.body.name })
            .then(result => {
                if(result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json(`deleted Darth Vadar's quote`)
            }).catch(err => console.error(err))
    })

    // connect to a port to access via browser
    app.listen(3000, () => {
        console.log('Magic on lane 3000')
    })
}).catch(err => console.error(err))

