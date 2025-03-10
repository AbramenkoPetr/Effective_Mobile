"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = require("fs");
// fileUpload = require('express-fileupload')
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json()); // Готов принять JSON
//app.use(express.static(__dirname + '/public'));
app.get("/", function (req, res) {
    console.log("Something was catched!" + req.method, __dirname);
    res.sendFile('/index.html', { root: __dirname });
});
//app.use(express.urlencoded({ extended: true }));
//app.get("/", (req, res) => {res.send("Hello from server Petr3!")});
//app.get("/", (req, res) => {res.send("Hello from server Petr3!")});
app.post('/create-observation', (req, res) => {
    res.send(`data: ${JSON.stringify(req.body)}`); // Теперь в req.body – данные от клиента
    const req_body = req.body;
    console.log(req_body.status);
    console.log(req.body);
});
app.listen(PORT, () => console.log(`⚡Server is running here 👉 https://localhost:${PORT}`));
//console.log('Hello World!')
