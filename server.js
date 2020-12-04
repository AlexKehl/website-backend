/* global process */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (e) {
    res.sendStatus(403);
  }
};

app.use(cors());
app.use(express.json());

app.get('/', authenticateToken, (req, res) => {
  res.json({
    message: 'Hello world!',
  });
});

const refreshTokens = [];

const generateAccessToken = user =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

app.post('/login', async (req, res) => {
  const user = {
    email: 123,
  };
  const username = req.body.email;
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.post('/token', async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }
  try {
    const user = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const accessToken = generateAccessToken({ email: user.emal });
    res.json({ accessToken });
  } catch (e) {
    return res.sendStatus(403);
  }
});

const port = 3001;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
