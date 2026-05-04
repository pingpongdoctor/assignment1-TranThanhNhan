const express = require("express");
const session = require('express-session');
const {MongoStore} = require('connect-mongo');
const app = express();
const fs = require("fs");
const bcrypt = require('bcrypt');
const Joi = require("joi");
const mongoSanitize = require('@exortek/express-mongo-sanitize');
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
PORT = process.env.PORT || 3000;

app.use(mongoSanitize({
    replaceWith: '%',
}));

app.use(express.static("public"));

const sessionExpireTime = 60 * 60 * 1000;

//Set up MongoStore option
const options = { 
    mongoUrl: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`,
    crypto: {
		secret: process.env.MONGODB_SESSION_SECRET,
	}
 };

//Set up session storage
app.use(session({
  secret: process.env.NODE_SESSION_SECRET,
  store: MongoStore.create(options),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:sessionExpireTime,
  }
}));

// Import Mongodb database
const {db} = require("./databaseConnection")
const userCollection = db.collection("user");

// Number of rounds to encrypt the data using bcrypt
const salt = 10;

app.get("/", (req, res) => {
    const data = fs.readFileSync(__dirname + "/app/index.html", 'utf8');
    res.send(data);
})

app.get("/members", (req, res) => {
    if(!req.session?.authenticated) {
        return res.redirect("/");
    }

    const data = fs.readFileSync(__dirname + "/app/member.html", 'utf8');
    res.send(data);
})

app.get("/user", (req, res) => {
    if(!req.session?.authenticated) {
        return res.send({
            message: "User is not authenticated.",
            status: 401
        })
    }

    res.send({
        username: req.session.username,
        status: 200,
    })
})

app.get("/cat/:catId", (req, res) => {
    if(!req.session?.authenticated) {
        return res.send({
            message: "User is not authenticated.",
            status: 401
        })
    }

    const catId = req.params.catId;

    switch(catId) {
        case "1":
            return res.send({
                path:"/cat1.avif",
                status: 200,
            });
        case "2":
            return res.send({
                path:"/cat2.avif",
                status: 200,
            });
        case "3":
            return res.send({
                path:"/cat3.avif",
                status: 200,
            });
        default:
            return res.send({
                message: "data not found.",
                status: 404
            })
    }


})

app.get("/signup", (req, res) => {
    const data = fs.readFileSync(__dirname + "/app/signup.html", 'utf8');
    res.send(data);
})

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

app.get("/login", (req, res) => {
    const data = fs.readFileSync(__dirname + "/app/login.html", 'utf8');
    res.send(data);
})

app.post("/login", async (req, res) => {
    const email = req.body?.email;
    const password = req.body?.password;

    if(!email || !password) {
        return res.send({
            status: 400,
            message: "Missing credentials"
        })
    }

    // Use Joi to protect the server from injection attack
    const schema = Joi.object({
        email: Joi.string().max(40).required(),
        password: Joi.string().max(20).required(),
    })

    const validatedResult = schema.validate(req.body);

    if(validatedResult.error != null) {
        return res.send({
            message: "Injection attack detected.",
            status: 400
        })
    }
    
    const users = await userCollection.find({email}).project({username:1, email: 1, password: 1}).toArray();

    if(users.length == 0) {
        return res.send({
            status:404,
            message:"Invalid email and password"
        });
    }

    const passwordMatched = await bcrypt.compare(password, users[0].password);

    if(!passwordMatched) {
        return res.send({
            status:401,
            message:"Invalid password"
        });
    }

    req.session.authenticated = true;
    req.session.username = users[0].username;

    res.send({status: 200});
})

app.post("/signup", async (req, res) => {
    // Use Joi to protect the server from injection attack
    const schema = Joi.object({
        username: Joi.string().max(20).required(),
        password: Joi.string().max(20).required(),
        email: Joi.string().max(40).required()
    })

    const validatedResult = schema.validate(req.body);
    if(validatedResult.error != null) {
        return res.send({
            message: "Injection attack detected.",
            status: 400
        })
    }

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const encryptedPassword = await bcrypt.hash(password, salt);

    await userCollection.insertOne({username, email, password: encryptedPassword});

    req.session.authenticated = true;
    req.session.username = username;

    res.send({status:200});
})

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

