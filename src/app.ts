import dotenv from "dotenv";
import db from "./config/db";
import cron from "node-cron";
import defaultService from "./services";

// initialize configuration
dotenv.config();

// connect db
db.connect();

const service = new defaultService();

cron.schedule('*/1 * * * *', () =>  {
  console.log('This job runs every 1 minutes');
  
  try {
    service.getExpiredImage();
  } catch (error) {
    console.error('Cron job failed:', error);
  }
});
