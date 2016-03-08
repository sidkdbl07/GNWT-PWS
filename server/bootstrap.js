Meteor.startup(function () {
  var default_users = [
    {name: "Sid Administrator", email: "admin@some.com", password: "1234", roles: ['admin']},
    {name: "Jonny FieldUser", email: "field@some.com", password: "1234", roles: ['field']},
    {name: "Suzie Manager", email: "manager@some.com", password: "1234", roles: ['manager']}
  ];

  if (Meteor.users.find().count() === 0) {
    _.each(default_users, function(user) {
      var id;
      id = Accounts.createUser({
          email: user.email,
          password: user.password,
          profile: {
              fullname: user.name
          }
      });
      if(user.roles.length > 0) {
        Roles.addUsersToRoles(id, user.roles, 'default_group');
      }
    });
  }

  var book, page, question_group, question;
  if(Books.find().count() === 0) {
    book = Books.insert( {'name': "Field Book Beta Mar 6, 2016", 'locked': false});
    page = Pages.insert( {'name': "As Built", "sort_order": 1, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'Building Details', 'sort_order': 1, 'type': 'Simple', 'multiple': false, 'decision_points': [], 'questions': [], 'page_id': page});
  }

  if(Buildings.find().count() === 0) {
    Buildings.insert( {'name': 'Building #1', 'address': '123 Main St', 'region': 'Fort Smith', 'location': { 'type': 'Point', 'coordinates': [-119, 60]}});
    Buildings.insert( {'name': 'Building #2', 'address': '123 Elm St', 'region': 'Fort Smith', 'location': { 'type': 'Point', 'coordinates': [-119.1, 60.2]}});
    Buildings.insert( {'name': 'Building #3', 'address': '456 Elm St', 'region': 'Fort Simpson', 'location': { 'type': 'Point', 'coordinates': [-119.2, 60.3]}});

    Buildings.insert( {'name': 'Building #4', 'address': '456 Elm St', 'region': 'Yellowknife', 'location': { 'type': 'Point', 'coordinates': [-119.05, 60.12]}});
    Buildings.insert( {'name': 'Building #5', 'address': '456 Elm St', 'region': 'Fort Simpson', 'location': { 'type': 'Point', 'coordinates': [-119.12, 60.31]}});
    Buildings.insert( {'name': 'Building #6', 'address': '456 Elm St', 'region': 'Pink Paradise', 'location': { 'type': 'Point', 'coordinates': [-119.23, 60.23]}});
  }

  if(Questions.find().count() === 0) {
    //Questions.insert({ });
  }
});
