// Dependencies
const express = require('express');
require('dotenv').config();
// Configure & Run the http server
const app = express();

app.use(express.static(__dirname, { dotfiles: 'allow' } ));

app.listen(process.env.PORT, () => {
  console.log('HTTP server running on port 80');
});