const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const server = jsonServer.create();

const router = jsonServer.router("./db.json");

const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));

server.use(jsonServer.defaults());

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const SECRET_KEY = "123456789";
const expiresIn = "1h";

// create token
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// verify token

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

// user exists ?

function isAuthenticated({ email, password }) {
  return (
    users.users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
}

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  let userName;
  users.users.find((user) => {
    if (user.email === email) {
      userName = user.name;
    }
  });
  console.log(userName);
  if (isAuthenticated({ email, password }) == false) {
    const status = 401;
    const message = "Email ou senha incorretos";
    res.status(status).json({ status, message });
    return;
  }
  const access_token = createToken({ email, password });
  res.status(200).json({ access_token, userName });
});

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Bad authorization header";
    res.status(status).json({ status, message });
    return;
  }
  try {
    verifyToken(req.headers.authorization.split(" ")[1]);
    next();
  } catch (error) {
    const status = 401;
    const message = "Error: acess_token is not valid";
    res.status(status).json({ status, message });
  }
});

server.use(router);

server.listen(3001, () => {
  console.log("Servidor rodando na porta 3001!");
});

server.use("/api", router);
