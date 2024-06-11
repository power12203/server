const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 3000;

app.use(bodyParser.json());

const uri = 'mongodb://power12203:k26196857@3.36.103.158:27017/';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let collection;

client.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const db = client.db('admin');
  collection = db.collection('airbnb');
  console.log('Connected to MongoDB');
});

app.post('/api/search', async (req, res) => {
  const { cityName, checkInDate, checkOutDate, roomGuests } = req.body;
  try {
    const query = {
      'location.city': { $regex: cityName, $options: 'i' },
      // 다른 필터 조건이 있는 경우 추가할 수 있습니다.
    };

    const results = await collection.find(query).toArray();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from database');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
