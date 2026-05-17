const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Job = require('./models/Job');
const jobs = require('./data/sampleJobs');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    await Job.deleteMany();
    await Job.insertMany(jobs);
    console.log('Sample jobs imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

importData();
