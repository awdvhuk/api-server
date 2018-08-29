const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const serverData = require('./serverData');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.io = io;
const db = require('./db/mongo-db');

const addUser = require('./routes/register');
const authorize = require('./routes/authorize');
const login = require('./routes/login');

const getUser = require('./routes/getUser');
const getusersArr = require('./routes/getUsersArr');
const editUser = require('./routes/editUser');
const passwordCheck = require('./routes/passwordCheck');
const deleteAvatar = require('./routes/deleteAvatar');
const deleteUser = require('./routes/deleteUser');
const fieldEdit = require('./routes/fieldEdit');
const uploadFile = require('./routes/uploadFile');
const fbTokenCheck=require('./routes/fbTokenCheck');

const jsonParser = bodyParser();

app.use(express.static(__dirname));
app.use(jsonParser);
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    return next();
})

app.get('/', function (req, res) {
    db.getArr('', '', (err, users) => {
        if (err) {
            console.log(err);
        }
        return res.send(users);
    });
})

app.get('/add_force', function (req, res) {
    return res.send('Check server'); // Защита от добавления лишнего

    let date = new Date()
    date.setHours(0, 0, 0, 0);

    user = {
        login: 'asd',
        name: 'asd',
        age: 25,
        registered: date,
        avatar: false,
        admin: false,
        password: 'asd'
    }

    db.add(user, (err, result) => {
        if (err) {
            return console.log(err);;
        }
        return res.send(result);
    })
});

app.use('/register', addUser);
app.use('/login', login);
app.use('/get', getUser);

app.use('/edit', editUser);
app.use('/get_users_array', getusersArr);
app.use('/delete', deleteUser);
app.use('/authorize', authorize);
app.use('/password_check', passwordCheck);
app.use('/delete_avatar', deleteAvatar);
app.use('/delete_account', deleteUser);
app.use('/field_edit', fieldEdit);
app.use('/upload_file', uploadFile);
app.use('/fb_token_check', fbTokenCheck);

db(function () {
    io.on('connection', function (socket) {
        // console.log('a user connected');

        socket.on('disconnect', function () {
            // console.log('user disconnected');
        });
    });

    http.listen(serverData.server, function () {
        let time = new Date().toLocaleString('ru');
        console.log(`\n /--------------------\\\n  Server working since \n  ${time} \n \\--------------------/\n`);
    });
});