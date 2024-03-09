const app = require('./app');
const dotenv = require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI)
  .then(() => {
    const PORT = process.env.PORT || 4000;
    const server = app.listen(PORT, () => {
      console.log('Server listening on port ' + PORT);
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'DB connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB on Port ' + process.env.PORT);
    });
}).catch(err => console.log(err));
