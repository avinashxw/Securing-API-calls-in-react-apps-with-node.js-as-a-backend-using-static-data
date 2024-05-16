const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
var cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
const PORT = 5001;
const secretKey = 'QWy8WU81wULuuQuWBYqSQdNfIBw2beB7';

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

/* app.use(( req, res, next) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');
}); */
  


// mock user data, this can be retrieved from the database as well
const users = [
    { id: 1, username: 'usernamea', password: 'passworda'},
    { id: 2, username: 'usernameb', password: 'passwordb'}
];

app.post('/login', (req,res) => {
    console.log("Cliked on Login button!");

    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if(!user) {
        return res.status(401).json({ message: 'Invalid username or password!' });
    }

    const token = jwt.sign({userid: user.id}, secretKey);
    console.log("token: ",{token});
    res.json({token});
})

app.get('/api/data', verifyToken, (req,res) => {
    res.json({ message: 'Protected data!' });
})

app.get('/api', (req,res) => {
    res.json({ message: 'hello from server!' });
})

function verifyToken(req,res,next) {
    const token = req.headers.authorization;
    console.log("verify token: ",token);
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized access!'});
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if(err) {
            return res.status(401).json({ message: 'Invalid token!' });
            console.log(err);
        }
        req.userid = decoded.userid;
        next();
    });
}

app.listen(PORT, (error) => {
    if(!error) {
        console.log('Server is successfully running & listening on port ', PORT);
    }
    else {
        console.log("Error occurred, server can't read", error);
    }
});