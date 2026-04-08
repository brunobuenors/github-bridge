const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Backend rodando 🚀');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server rodando na porta ${PORT}`);
});
