var app = require('../app');

exports.api = {
  // GET /users
  index: function *(next) {
    var users  = yield app.models.User.find({}).exec();
    this.response.data = users;
    yield next;
  },
  // GET /users/new
  new: function *(next) {
    yield next;
  },
  // POST /users
  create: function *(next) {
    yield next; //we don't want this
  },
  // GET /users/:id
  show: function *(next) {
    var user = yield app.models.User.findById(this.params.id).exec();
    this.response.data = user;
    yield next;
  },
  // GET /users/:id/edit
  edit: function *(next) {
    yield next; //NO
  },
  // PUT /users/:id
  update: function *(next) {
    //NEED TO DECIDE HOW WE WANT TO DO IT
    yield next;
  },
  // DELETE /users/:id
  destroy: function *(next) {
    yield next;
  }
};