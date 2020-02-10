const fs = require('fs');
require('dotenv').config();
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const SECRET_KEY = process.env.SECRET_KEY;
const AUDIENCE = process.env.AUDIENCE;
const CLIENT_ID = process.env.CLIENT_ID;
const expiresIn = '12h';
const SCOPE = ["read", "write"];
const AUTHORITIES = [
    "STANDARD_USER",
    "ADMIN_USER"
];

const JWT_TOKEN_URL = '/oauth/token';
const JWT_MIDDLEWARE_URL = /^(?!\/oauth).*$/;
const PORT = Number(process.env.SERVICE_PORT);

const server = jsonServer.create();
const router = jsonServer.router('./database.json');
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

// Create a token from a payload
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn,
        jwtid: uuidv4(),
        audience: [AUDIENCE]
    })
}

// Verify the token 
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}) {
    return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

// Login to one of the users from ./users.json
server.post(JWT_TOKEN_URL, (req, res) => {
    const {username: email, password} = req.body;

    if (isAuthenticated({email, password}) === false) {
        const status = 401;
        const message = 'Incorrect email or password';
        res.status(status).json({status, message});
        return
    }
    const access_token = createToken({
        user_name: email,
        //password,
        scope: SCOPE,
        authorities: AUTHORITIES,
        client_id: CLIENT_ID
    });
    console.log("Access Token:" + access_token);
    res.status(200).json({access_token})
});

server.use(JWT_MIDDLEWARE_URL, (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401;
        const message = 'Error in authorization format';
        res.status(status).json({status, message});
        return
    }
    try {
        let verifyTokenResult;
        verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

        if (verifyTokenResult instanceof Error) {
            const status = 401;
            const message = 'Access token not provided';
            res.status(status).json({status, message});
            return
        }
        next()
    } catch (err) {
        const status = 401;
        const message = 'Error access_token is revoked';
        res.status(status).json({status, message})
    }
});

server.use(router);

server.listen(PORT, () => {
    console.log(`Run Auth API Server on port ${PORT}`)
});