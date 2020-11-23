const express = require('express');
const app = express();
const session = require('express-session');
require('dotenv').config();
const routes = require('./routes/html-routes.js');
const passport = require('./config/passport');
const exphbs = require('express-handlebars');

const db = require('./models');

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//* =============================================================
//* Routes
//* =============================================================
app.use('/', routes);
require('./routes/contacts-api-routes')(app);
require('./routes/applications-api-routes')(app);

const port = 3000;

db.sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log('App listening on port http://localhost:' + port);
  });
});
