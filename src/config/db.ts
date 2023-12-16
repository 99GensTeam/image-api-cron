import mongoose from "mongoose";

class dbConfig {
  connect() {
    // Create the database connection
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.DB_URI);

    // When successfully connected
    mongoose.connection.on('connected', () => {
      /* eslint no-console: 0 */
      console.log(`Mongoose default connection open to ${process.env.DB_URI}`);
    });

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      console.log(`Mongoose default connection error: ${err}`);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose default connection disconnected');
    });
  }
}

export default new dbConfig();
