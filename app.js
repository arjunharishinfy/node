const express = require('express');
const app = express();

app.get('/', function(rq, rs) {
  rs.send("Server Working");
})'

const port = 3000;
app.listen(port)
console.log(`Listening at http://localhost:${port}`)
