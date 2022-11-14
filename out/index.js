"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const sqlite3_1 = __importDefault(require("sqlite3"));
const sequelize_2 = __importDefault(require("sequelize"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const { PORT = 3000 } = process.env;
let db = new sqlite3_1.default.Database(path_1.default.join(__dirname, "/database.sqlite3"));
app.use(express_1.default.static(path_1.default.join(__dirname, "/static")));
app.disable("x-powered-by");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
let sequelize = new sequelize_1.Sequelize("", "", "", {
    dialect: "sqlite",
    storage: path_1.default.join(__dirname, "/database.sqlite3"),
    logging: false,
});
let UserModel = sequelize.define("Users", {
    id: {
        type: sequelize_2.default.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    login: {
        type: sequelize_2.default.STRING(255),
        allowNull: false,
    },
    password: {
        type: sequelize_2.default.STRING(255),
        allowNull: false,
    },
});
sequelize.sync();
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "/templates/index.html"));
});
app.post("/", function (req, res) {
    console.log(req.body.login.toString());
    UserModel.create({
        login: req.body.login.toString(),
        password: req.body.password.toString(),
    })
        .then((data) => {
        console.log(data.get("id"));
        let token = Buffer.from(data.get("id") +
            ":::" +
            req.body.login.toString() +
            ":::" +
            req.body.password.toString());
        res.send(token.toString("base64"));
    })
        .catch((err) => console.log(err));
});
app.get("/me/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "/templates/me.html"));
});
app.post("/me/", (req, res) => {
    console.log(req.body);
    db.all(`SELECT * FROM Users WHERE id = ${req.body.id}`, function (err, rows) {
        console.log(err, rows);
        try {
            res.send(rows[0]);
        }
        catch (err) {
            res.send(String(err));
        }
    });
});
app.listen(PORT, () => {
    console.log("Server started at http://localhost:" + PORT);
});
//# sourceMappingURL=index.js.map