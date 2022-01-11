if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all('/*',(req, res, next) => {

  const allowedURL = ['https://s0npari11.github.io/bazarbhao-frontend/', 'http://localhost:3000']
  const origin = req.headers.origin
  
  if(allowedURL.includes(origin){
    res.header("Access-Control-Allow-Origin", allowedURL);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, auth-token"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS")
  
  next();
});

app.use('/', require('./routes/info'))

app.listen(process.env.PORT || 3001, () => {
    console.log('Server running on port 3001')
})
