const express = require('express');
const app = express();

app.get('/', function(rq, rs) {
  rs.send("Server Working");
})'

app.listen(process.env.PORT || 3000);
module.exports = app;

