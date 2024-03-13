const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  encodeURIComponent(process.env.DATABASE_PASSWORD),
);
let server;

(async () => {
  try {
    if (!server) {
      console.log('Attempting to connect to MongoDB...');
    }
    await mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        connectTimeoutMS: 5000,
      })
      .then(() => console.log('DB connection successfull!'));

    if (!server) {
      server = app.listen(port, () => {
        console.log(`App is runing on ${port} ... `);
      });
    }
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1); // Exit on connection failure
  }
})();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.name, err.message);
  console.error(err.stack); // Log the entire error stack
  console.log('Shutting down!');
  process.exit(1);
});
