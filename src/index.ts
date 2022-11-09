import express from "express";
import { Request, Response } from "express";
import { Sequelize } from "sequelize";
import sqlite3 from "sqlite3";
import sq from "sequelize";
import path from "path";

const app = express();
const { PORT = 3000 } = process.env;
let db = new sqlite3.Database(path.join(__dirname, "/database.sqlite3"));

app.use(express.static(path.join(__dirname, "/static")));
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sequelize = new Sequelize("", "", "", {
    dialect: "sqlite",
    storage: path.join(__dirname, "/database.sqlite3"),
    logging: false,
});
let UserModel = sequelize.define("Users", {
    id: {
        type: sq.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    login: {
        type: sq.STRING(255),
        allowNull: false,
    },
    password: {
        type: sq.STRING(255),
        allowNull: false,
    },
});
sequelize.sync();

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/templates/index.html"));
});
app.post("/", function (req: Request, res: Response) {
    console.log(req.body.login.toString());

    UserModel.create({
        login: req.body.login.toString(),
        password: req.body.password.toString(),
    })
        .then((data) => {
            console.log(data.get("id"));
            let token: Buffer = Buffer.from(
                data.get("id") +
                    ":::" +
                    req.body.login.toString() +
                    ":::" +
                    req.body.password.toString()
            );
            res.send(token.toString("base64"));
        })
        .catch((err) => console.log(err));
});

app.get("/me/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/templates/me.html"));
});

app.post("/me/", (req: Request, res: Response) => {
    db.all(
        `SELECT * FROM Users WHERE id = ${req.body.id}`,
        function (err, rows) {
            res.send(rows[0]);
        }
    );
});

app.listen(PORT, () => {
    console.log("Server started at http://localhost:" + PORT);
});
