const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db/database');
const routes = require('./routes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});