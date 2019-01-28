require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.static(`${__dirname}/src/public`));

app.listen(process.env.PORT, () => {
  console.log(`__SERVER_UP__ on PORT ${process.env.PORT}`);
});
