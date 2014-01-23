var app = require('../app'),
    s = app.servers.koa.getServer();

s.resource('users', {
  // GET /users
  index: function *(next) {
    var users  = yield app.models.User.find({}).exec();
    next(users);
  },
  // GET /users/new
  new: function *(next) {
    next();
  },
  // POST /users
  create: function *(next) {
    next(); //we don't want this
  },
  // GET /users/:id
  show: function *(next) {
    var user = yield app.models.User.findById(this.param.id).exec();
    next(user);
  },
  // GET /users/:id/edit
  edit: function *(next) {
    next();
  },
  // PUT /users/:id
  update: function *(next) {
    //TODO
    next();
  },
  // DELETE /users/:id
  destroy: function *(next) {
    next();
  }
});