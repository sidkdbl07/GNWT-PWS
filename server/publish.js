Meteor.publish("books", function() {
  return Books.find();
});
Meteor.publish("book", function(id) {
  return Books.find({_id: id});
});
Meteor.publish("buildings", function() {
  return Buildings.find();
});
Meteor.publish("building", function(id) {
  return Buildings.find({_id: id});
});
Meteor.publish("decision_points", function() {
  return Decision_Points.find();
});
Meteor.publish("directory", function() {
  if(this.userId && Roles.userIsInRole(this.userId, ['admin'], 'default_group')) {
    return Meteor.users.find({}, {fields:{emails:1, profile:1, roles:1}});
  } else {
    return [];
  }
});
Meteor.publish('images', function() {
  return Images.find();
});
Meteor.publish("inspections", function() {
  return Inspections.find();
});
Meteor.publish("inspection", function(id) {
  return Inspections.find({_id: id});
});
Meteor.publish("pages", function() {
  return Pages.find();
});
Meteor.publish("page", function(id) {
  return Pages.find({_id: id});
});
Meteor.publish("questions", function() {
  return Questions.find();
});
Meteor.publish("question", function(id) {
  return Questions.find({_id: id});
});
Meteor.publish("question_group", function(id) {
  return Question_Groups.find({_id: id});
});
Meteor.publish("question_groups", function() {
  return Question_Groups.find();
});
Meteor.publish("question_in_group", function(id) {
  return Question_In_Group.find({_id: id});
});
Meteor.publish("question_in_groups", function() {
  Question_In_Group._ensureIndex({group_id:1, question_id:1}, {unique: 1});
  return Question_In_Group.find();
});

Meteor.publish("users", function() {
  return Meteor.users.find({});
})

Meteor.publish("user", function() {
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: {
      roles: true
    }
  });
});
