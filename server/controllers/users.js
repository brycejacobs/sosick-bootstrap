var app = require('../app');

exports.api = {
  // GET /users
  index: function *(next) {
    var users  = yield app.models.User.find({}).exec();
    next(users);
  },
  // GET /users/new
  new: function *(next) {
    yield next();
  },
  // POST /users
  create: function *(next) {
    yield next(); //we don't want this
  },
  // GET /users/:id
  show: function *(next) {
    var user = yield app.models.User.findById(this.param.id).exec();
    yield next(user);
  },
  // GET /users/:id/edit
  edit: function *(next) {
    yield next();
  },
  // PUT /users/:id
  update: function *(next) {
    //TODO
    yield next();
  },
  // DELETE /users/:id
  destroy: function *(next) {
    yield next();
  }
};