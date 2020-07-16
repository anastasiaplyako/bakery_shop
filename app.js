let express = require('express');
let app = express();
let mysql = require('mysql');
let passport          = require('passport');
let LocalStrategy     = require('passport-local').Strategy;
let sess              = require('express-session');
let BetterMemoryStore = require('session-memory-store')(sess);
let cookieParser = require('cookie-parser');
const nodemailer = require("nodemailer");

app.use(express.static('public'));

app.listen(5000, function () {
    console.log('port 5000 is work');
});

let id_user = null;
let logout_user = true;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'pug');

let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'schema1'
    }
);

connection.connect(function (err) {
    if (err) return console.error('Ошибка подключения к БД');
    else {
        console.log('БД успешно подключена')
    }
});

let store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });

app.use(sess({
    name: 'JSESSION',
    secret: 'MYSECRETISVERYSECRET',
    store:  store,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize(''));
app.use(passport.session('sess'));

passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true //passback entire req to call back
    } , function (req, username, password, done){

        if(!username || !password ) {
            return done(null, false, req.flash('message','All fields are required.'));
        }
        connection.query("select * from users where username = ?", [username], function(err, rows){
            console.log('error = ', err);
            console.log('here', rows);
            console.log(password);
            if (err) return done(req.flash('message',err));
            //if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
            let dbPassword  = rows[0].password;
            if(!(dbPassword === password)){
                return done(null, false, req.flash('message','Invalid username or password.'));
            }
            console.log('rows', rows[0]);
            return done(null, rows[0]);

        });

    }

));

passport.serializeUser(function(user, done){
    console.log('user', user.id);
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    connection.query("select * from users where id =? ", [id], function (err, rows){
        done(err, rows[0]);
    });
});

app.get('/main', function(req, res){
    connection.query('SELECT * FROM type_products',  function(err, result, fields){
        if(err) throw err;
        console.log(JSON.parse(JSON.stringify(result)));
        res.render('main', {
                res: JSON.parse(JSON.stringify(result)),
                id: id_user
            }
        );
        //res.json(result);
    });
});

app.get('/signin', function(req, res){
    console.log('id_user', id_user);
    if (id_user !== '' || id_user !== null || id_user !== undefined){
        res.render('index');
    } else res.render('/products')
});

app.post("/signin", passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/signin',
    failureFlash: true
}), function(req, res, info){
    res.render('index',{'message' :req.flash('message')});
});

app.get('/users', function(req, res){
    id_user = req.user['id'];
    console.log('logout_user', logout_user);
    logout_user = true;
    res.render('users',  {
        username: req.user['username'],
        name: req.user['name'],
        surname: req.user['surname'],
        login: req.user['login'],
        address: req.user['address'],
        email: req.user['email']
    });
});

app.get('/logout', function(req, res){
    req.session.destroy();
    req.logout();
    console.log('logout_user', logout_user);
    logout_user = false;
    res.redirect('/main');
    id_user = null;
});

app.get('/products', function(req, res){
    connection.query('SELECT * FROM products',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                id: id_user,
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
});

app.get('/ind-product', function(req, res) {
    console.log(req.query.id);
    connection.query('SELECT * FROM products WHERE id_products=?', [req.query.id], function(err, result, fields){
        if(err) throw err;
        res.render('ind-product', {
                res: JSON.parse(JSON.stringify(result)),
                id: id_user
            }
        );
    })
});

app.get('/asc', function(req, res){
    connection.query('SELECT * FROM products ORDER BY price',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
})

app.get('/asc', function(req, res){
    connection.query('SELECT * FROM products ORDER BY price',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
})

app.get('/desc', function(req, res){
    connection.query('SELECT * FROM products ORDER BY price DESC',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
});

app.get('/donut', function(req, res){
    connection.query('SELECT * FROM products WHERE id_cat = 1',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
});

app.get('/cookies', function(req, res){
    connection.query('SELECT * FROM products WHERE id_cat = 2',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
});

app.get('/cake', function(req, res){
    connection.query('SELECT * FROM products WHERE id_cat = 3',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
});

app.get('/candy', function(req, res){
    connection.query('SELECT * FROM products WHERE id_cat = 4',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
});

app.get('/bun', function(req, res){
    connection.query('SELECT * FROM products WHERE id_cat = 5',  function(err, result, fields){
        if(err) throw err;
        res.render('products', {
                res: JSON.parse(JSON.stringify(result))
            }
        );
        //res.json(result);
    });
});

app.get('/checkin', function(req, res){
    res.render('checkin')
});

app.post('/finish-checkin', function(req, res){
    console.log(req.body['username']);
    connection.query(`INSERT users(name, surname, address, email, username, password, phone) VALUES ('${req.body.name}','${req.body.surname}', '${req.body.address}', '${req.body.email}', '${req.body.username}', '${req.body.password}', '${req.body.phone}' )`,
        function(err, result, fields){
        if(err) throw err;
        id_user = result.insertId;
        logout_user = true;
        console.log(JSON.parse(JSON.stringify(result)));
        res.send('1');
    });
});

app.get('/order', function(req, res){
    res.render('order')
});

app.post('/get-goods-info', function (req, res) {
    console.log('logout_user', logout_user);
    console.log(req.body.key);
    console.log('id_user', id_user);
    let tmp = req.body.key.join(',');
    if(req.body.key.length !== 0){
        connection.query(`SELECT id_products,name, price FROM products WHERE id_products IN (${tmp})`,
            function(err, result, fields){
                if(err) throw err;
                console.log(result);
                let goods = {};
                for (let i = 0; i < result.length; i++) {
                    goods[result[i]['id_products']] = result[i];
                }
                res.json(goods);
            })
    }
    else {
        res.send('0');
    }
});

app.get('/cart', function(req, res){
    console.log(id_user);
    connection.query('SELECT * FROM users WHERE id=?', [id_user],  function(err, result, fields){
        if(err) throw err;
        console.log('this', JSON.parse(JSON.stringify(result)));
        res.render('cart', {
                res: JSON.parse(JSON.stringify(result)),
                id: id_user
            }
        );
        //res.json(result);
    });
});

app.get('/success', function(req, res){
    res.render('success')
});

app.get('/finish-order', function(req, res){
    console.log(id_user);
    connection.query('SELECT * FROM users WHERE id=?', [id_user],  function(err, result, fields){
        if(err) throw err;
        console.log('this', JSON.parse(JSON.stringify(result)));
        res.render('finish-order', {
                res: JSON.parse(JSON.stringify(result)),
                id: id_user
            }
        );
        //res.json(result);
    });
});


app.post('/finish-order1', function(req, res){
    console.log('in');
    console.log(req.body);
    if (req.body.length !==  0){
        let key = Object.keys(req.body.key);
        connection.query(`SELECT id_products,name, price FROM products WHERE id_products IN (${key.join(',')})`,
            function(err, result, fields){
                if(err) throw err;
                console.log(result);
                sendMail(req.body, result).catch(console.error);
                res.send('1');
            })
    } else {
        res.send('0');
    }
});

app.post('/finish-order-user', function(req, res){
    console.log('req = ', req);
    console.log('MY USSSEEER', req.user['name']);
    let key = Object.keys(req.body.key);
    let product = new Promise((resolve, reject) => {
       connection.query(`SELECT id_products,name, price FROM products WHERE id_products IN (${key.join(',')})`,
           function(err, result, fields){
               if(err) throw err;
               console.log('products ', result);
               sendMailUser(req, result).catch(console.error);
               res.send('1');
           })
   });
});

async function sendMailUser(data, result){
    let res = '<h2>Order</h2>';
    let total = 0;
    for (let i = 0; i < result.length; i++) {
        res+=`<p>${result[i]['name']} - ${result[i]['id_products']} - ${data.body.key[result[i]['id_products']]} - ${result[i]['price']*data.body.key[result[i]['id_products']]} rub </p>`;
        total += result[i]['price'] * data.body.key[result[i]['id_products']]
    }
    console.log(res);
    res += `<hr> Total ${total} `;
    res += `<hr> phone: ${data.user['phone']}`;
    res += `<hr> user: ${data.user['username']}`;
    res += `<hr> address: ${data.user['address']}`;
    res += `<hr> email: ${data.user.email}`;

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let mailOption = {
        from: '<anastasiareiz@gmail.com>',
        to: "anastasiareiz@gmail.com, "+data.email,
        subject: "Hello ✔", // Subject line
        text: "Hello world?",
        html: res
    };

    let info = await transporter.sendMail(mailOption);
    console.log("Message send %s", info.messageId);
    console.log("Preview send %s", nodemailer.getTestMessageUrl(info));
    return true;
}

async function sendMail(data, result){
    console.log(data);
    let res = '<h2>Order</h2>';
    let total = 0;
    for (let i = 0; i < result.length; i++) {
        res+=`<p>${result[i]['name']} - ${result[i]['id_products']} - ${data.key[result[i]['id_products']]} - ${result[i]['price']*data.key[result[i]['id_products']]} rub </p>`;
        total += result[i]['price'] * data.key[result[i]['id_products']]
    }
    console.log(res);
    res += `<hr> Total ${total} `;
    res += `<hr> phone: ${data.phone}`;
    res += `<hr> user: ${data.username}`;
    res += `<hr> address: ${data.address}`;
    res += `<hr> email: ${data.email}`;

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let mailOption = {
        from: '<anastasiareiz@gmail.com>',
        to: "anastasiareiz@gmail.com, "+data.email,
        subject: "Hello ✔", // Subject line
        text: "Hello world?",
        html: res
    };

    let info = await transporter.sendMail(mailOption);
    console.log("Message send %s", info.messageId);
    console.log("Preview send %s", nodemailer.getTestMessageUrl(info));
    return true;
}

module.exports = {
    logout_user: logout_user
};