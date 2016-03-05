Meteor.publish("books", function() {
  return Books.find();
});
Meteor.publish("book", function(id) {
  return Books.find({_id: id});
});
Meteor.publish("buildings", function() {
  return Buildings.find();
});
Meteor.publish('images', function() {
  return Images.find();
});
Meteor.publish("building", function(id) {
  return Buildings.find({_id: id});
});
Meteor.publish("directory", function() {
  if(this.userId && Roles.userIsInRole(this.userId, ['admin'], 'default_group')) {
    return Meteor.users.find({}, {fields:{emails:1, profile:1, roles:1}});
  } else {
    return [];
  }
});
Meteor.publish("questions", function() {
  return Questions.find();
});
Meteor.publish("site_pages", function() {
  if(this.userId && Roles.userIsInRole(this.userId, ['admin'], 'default_group')) {
    return Pages.find();
  } else {
    return Pages.find({ 'protected': false });
    //return Pages.find();
  }
});
Meteor.publish("user", function() {
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: {
      roles: true
    }
  });
});
