const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Compiler service is running' });
});

app.listen(PORT, () => {
  console.log(`Compiler service running on port ${PORT}`);
});
