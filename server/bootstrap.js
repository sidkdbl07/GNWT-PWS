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
    book = Books.insert( {'name': "Field Book v.20160306r1", 'locked': false});
    page = Pages.insert( {'name': "As Built", "sort_order": 1, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'Building Details', 'sort_order': 1, 'type': 'Simple', 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'In what year was the building designed?',
                                  'type': 'Year',
                                  'help_text': '',
                                  'apply_min': true, 'apply_max': false,
                                  'min': 1900, 'min_year': 1900,
                                  //'max': null, 'max_year': null,
                                  'possible_units': [{'unit': 'year', 'multiplier': 1}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'As-Built'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1})
    question = Questions.insert( {'text': 'In what year was the building constructed?',
                                  'type': 'Year',
                                  'help_text': '',
                                  'apply_min': true, 'apply_max': false,
                                  'min': 1900, 'min_year': 1900,
                                  //'max': null, 'max_year': null,
                                  'possible_units': [{'unit': 'year', 'multiplier': 1}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'As-Built'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2})
    question = Questions.insert( {'text': 'Are the drawings available for this building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},{'value': 'No'}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'As-Built'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3})
    question = Questions.insert( {'text': "Is there a snow load factor specified on the building's drawings",
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},{'value': 'No'}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'As-Built'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 4})
    question = Questions.insert( {'text': 'Enter the stated snow load factor',
                                  'type': 'Numeric',
                                  'help_text': '',
                                  //'allowed_values': [{'value': 'Yes'},{'value': 'No'}],
                                  'apply_min': true, 'min': 0, 'apply_max': true, 'max': 1000,
                                  //'min_year': null, 'max_year': null,
                                  'possible_units': [{'unit': 'kPa', 'multiplier': 1},
                                                     {'unit': 'Pounds per sq. foot', 'multiplier': 0.04788025},
                                                     {'unit': 'Pounds per sq. inch', 'multiplier': 6.89476}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'As-Built'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 5});
    page = Pages.insert( {'name': "Change of use / Importance", "sort_order": 2, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'Importance', 'sort_order': 1, 'type': 'Simple', 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'What is the current primary use of the building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Minor Storage Building'},
                                                     {'value': 'Low Occupancy Building'},
                                                     {'value': 'Elementary School'},
                                                     {'value': 'Middle School'},
                                                     {'value': 'Secondary School'},
                                                     {'value': 'Community Centre'},
                                                     {'value': 'Hospital'},
                                                     {'value': 'Emergency Treatment Facility'},
                                                     {'value': 'Telephone Exchange'},
                                                     {'value': 'Power Station'},
                                                     {'value': 'Logistical Control Center'},
                                                     {'value': 'Water Treatment Facility'},
                                                     {'value': 'Sewage Treatment Fecility'},
                                                     {'value': 'Critical National Defense'},
                                                     {'value': 'Emergency Response Building'},
                                                     {'value': 'Fire Station'},
                                                     {'value': 'Rescure Station'},
                                                     {'value': 'Police Station'},
                                                     {'value': 'Housing for Vehicles (Air or Land)'},
                                                     {'value': 'Communication Facility'},
                                                     {'value': 'Other'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'Is there dedicated emergency power generation at the building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question_group = Question_Groups.insert( {'name': 'Change of Use', 'sort_order': 2, 'type': 'Simple', 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Has the building always been used for this purpose?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});

    page = Pages.insert( {'name': "Deterioration", "sort_order": 3, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    page = Pages.insert( {'name': "Snow", "sort_order": 4, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    page = Pages.insert( {'name': "Permafrost", "sort_order": 5, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});

  }

  if(Buildings.find().count() === 0) {
    Buildings.insert( {'name': 'Building #1', 'address': '123 Main St', 'region': 'Fort Smith', 'location': { 'type': 'Point', 'coordinates': [-119, 60]}});
    Buildings.insert( {'name': 'Building #2', 'address': '123 Elm St', 'region': 'Fort Smith', 'location': { 'type': 'Point', 'coordinates': [-119.1, 60.2]}});
    Buildings.insert( {'name': 'Building #3', 'address': '456 Elm St', 'region': 'Fort Simpson', 'location': { 'type': 'Point', 'coordinates': [-119.2, 60.3]}});
    Buildings.insert( {'name': 'Building #4', 'address': '456 Elm St', 'region': 'Yellowknife', 'location': { 'type': 'Point', 'coordinates': [-119.05, 60.12]}});
    Buildings.insert( {'name': 'Building #5', 'address': '456 Elm St', 'region': 'Fort Simpson', 'location': { 'type': 'Point', 'coordinates': [-119.12, 60.31]}});
    Buildings.insert( {'name': 'Building #6', 'address': '456 Elm St', 'region': 'Pink Paradise', 'location': { 'type': 'Point', 'coordinates': [-119.23, 60.23]}});
  }
});
