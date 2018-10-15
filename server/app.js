const express = require('express');
const path = require('path');

const app = express();

if (process.env.NODE_ENV !== 'local') {
  app.get('*.js', (req, res, next) => {
    req.url += '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
  });
}

const httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV !== 'local') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    return next();
  }
  return next();
};

// Middleware
app.use(httpsRedirect);
app.use(express.static(path.join(__dirname, '../public')));

// Views
app.get('/*', (req, res) => { res.sendFile(path.join(__dirname, '../public/index.html')); });


module.exports = app;
