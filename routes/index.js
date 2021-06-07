const routes = require('express').Router()
const header_validation = require('../middlewares/header_validation')


const user = require('./user')


routes.use('/', header_validation, user);

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Customer Service API!!' })
});

module.exports = routes