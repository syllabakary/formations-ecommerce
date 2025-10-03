const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
