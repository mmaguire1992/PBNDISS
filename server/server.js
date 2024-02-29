
const app = require('./app');
const dotenv = require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI)
  .then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
  })
}).catch(err => console.log(err));
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => {
  console.log('Connected to DataBase on Port ' +process.env.PORT);
  
});
