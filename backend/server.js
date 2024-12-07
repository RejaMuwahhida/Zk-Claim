const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const ehrRoutes = require('./routes/ehrRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const reclaimRoutes = require('./routes/reclaimRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Insurance verification');
});

app.use('/api/reclaim', reclaimRoutes);
app.use('/api/data', ehrRoutes);
app.use('/api/verify', verifyRoutes);

mongoose.connect(process.env.MONGODB_URL, {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});
