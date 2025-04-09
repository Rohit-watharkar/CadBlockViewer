require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const routes = require('./src/routes');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: true }) // Use force: true for dev only
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));