const express = require('express');
const usersRouter = require('./routes/users');
require('dotenv').config();
const cors = require('cors');

class Server{
    constructor(){
        this.app = express(); //instancia de express
        this.port = process.env.PORT; // puerto para el servidor
        this.basePath = '/api/v1';
        this.usersPath = `${this.basePath}/aceattorney`; // http://localhost:3000/api/v1/aceattorney
        this.middlewares();
        this.routes();
    }
    middlewares(){
        this.app.use(cors());
        this.app.use(express.json()); // para poder intepretar texto
    }
    routes(){
        this.app.use(this.usersPath, usersRouter);
    }
    listen(){
        this.app.listen(this.port,() => {
            console.log("Listening on port " + this.port);
        })
    }
}

module.exports = Server;