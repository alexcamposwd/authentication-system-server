import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()

mongoose.Promise = global.Promise

export const mongooseConnection = mongoose.connect((process.env.DB_URI as string), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions).then(() => { console.log("MongoDB successfully connected!") })
  .catch((err) => { console.log("Error connecting with MongoDB: " + err) })
