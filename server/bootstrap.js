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

  Ground.Collection(Meteor.users);
  if(Meteor.isCordova) Ground.Collection(Roles);

  var book, page, question_group, question;
  if(Books.find().count() === 0) {
    // Fake Dummy Book
    book = Books.insert( {'name': "Testing Book (Developer Only)", 'locked': false});
    page = Pages.insert( {'name': "First Parameter", "sort_order": 1, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'First Group', 'sort_order': 1, 'type': 'Simple', 'use_map': true, 'multiple': true, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Mark the highest point on the roof',
                                  'type': 'Geo-Point',
                                  'help_text': 'Touch your finger on the highest point on the roof.',
                                  'label': 'High Point',
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Snow'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'Trace one of the roof areas',
                                  'type': 'Geo-Area',
                                  'help_text': 'Trace a polygon with your finger to trace an area of the roof.',
                                  'label': 'Area Descriptor',
                                  'show_history': false, 'use_history': false, 'pictures': 'Disabled',
                                  'tags': [{'tag': 'Snow'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question_group = Question_Groups.insert( {'name': 'Second Group', 'sort_order': 2, 'type': 'Simple', 'use_map': true, 'multiple': true, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Mark places where there are significant ice build-up',
                                  'type': 'Geo-Point',
                                  'help_text': 'Touch your finger on place on the roof where signiicant ice is observed.',
                                  'label': 'Ice Observed',
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Snow'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'Mark places where you took a measurement',
                                  'type': 'Geo-Point',
                                  'help_text': 'Touch your finger on a point of measurement.',
                                  'label': 'Measurement',
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Snow'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    // Real Book
    book = Books.insert( {'name': "Field Book v.20160306r1", 'locked': false});
    page = Pages.insert( {'name': "As Built", "sort_order": 1, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'Building Details', 'sort_order': 1, 'type': 'Simple', 'use_map': false, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'In what year was the building designed?',
                                  'type': 'Year',
                                  'help_text': '',
                                  'apply_min': true, 'apply_max': false,
                                  'min': 1900, 'min_year': 1900,
                                  //'max': null, 'max_year': null,
                                  'possible_units': [{'unit': 'year', 'multiplier': 1}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'As-Built'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'In what year was the building constructed?',
                                  'type': 'Year',
                                  'help_text': '',
                                  'apply_min': true, 'apply_max': false,
                                  'min': 1900, 'min_year': 1900,
                                  //'max': null, 'max_year': null,
                                  'possible_units': [{'unit': 'year', 'multiplier': 1}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'As-Built'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'Are the drawings available for this building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},{'value': 'No'}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'As-Built'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});
    dp1 = Decision_Points.insert({'type': 'Value/Label', 'qig_id': qig, 'value': 'Yes', 'label': 'Yes', 'sort_order': 1});
    dp2 = Decision_Points.insert({'type': 'Value/Label', 'qig_id': qig, 'value': 'No', 'label': 'No', 'sort_order': 2});
    q1 = question = Questions.insert( {'text': "Is there a snow load factor specified on the building's drawings",
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
    Navigation_Rules.insert({'page_id': page, 'group_id': question_group, 'question_id': q1, 'decision_point': dp2, 'excluded_question': question});
    page = Pages.insert( {'name': "Change of use / Importance", "sort_order": 2, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'Importance', 'sort_order': 1, 'type': 'Simple', 'use_map': false, 'multiple': false, 'decision_points': [], 'page_id': page});
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
    question_group = Question_Groups.insert( {'name': 'Change of Use', 'sort_order': 2, 'type': 'Simple', 'use_map': false, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Has the building always been used for this purpose?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'What was the intended use of the building when it was design / constructed?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': "Don't know"},
                                                     {'value': 'Minor Storage Building'},
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
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'Have structural changes been made to the building to address any change of use?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'},
                                                     {'value': "Don't know"}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});
    question = Questions.insert( {'text': 'In what year were the structural changes made?',
                                  'type': 'Year',
                                  'help_text': '',
                                  'apply_min': true, 'apply_max': false,
                                  'min': 1900, 'min_year': 1900,
                                  //'max': null, 'max_year': null,
                                  'possible_units': [{'unit': 'year', 'multiplier': 1}],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 4});
    question = Questions.insert( {'text': 'Have these changes been appropriately documented and signed?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 5});
    question = Questions.insert( {'text': 'Have there been any other significant renovations, repairs or additions to the building since it was first constructed?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'},
                                                     {'value': "Don't know"}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 6});
    question = Questions.insert( {'text': 'Have these changes been appropriately documented and signed?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Importance'}, {'tag': 'Change of Use'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 7});

    page = Pages.insert( {'name': "Deterioration", "sort_order": 3, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'Maintenance', 'sort_order': 1, 'type': 'Simple', 'use_map': false, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'How much maintenance and other remedial work has the building required over the last two years?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'None'},
                                                     {'value': 'Less than the average for all our buildings'},
                                                     {'value': 'About average for all our buildings'},
                                                     {'value': 'More than the average for all our buildings'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Deterioration'}, {'tag': 'Maintenance'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'In the last 2 years, have there been any leaks in the roof?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'},
                                                     {'value': "N/A"}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Deterioration'}, {'tag': 'Maintenance'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'Does water significantly pool on any part of the roof after rain?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Deterioration'}, {'tag': 'Maintenance'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});

    question_group = Question_Groups.insert( {'name': 'Deterioration', 'sort_order': 2, 'type': 'Simple', 'use_map': false, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'How deteriorated is the roof structure?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>None / minor: No evidence or some minor evidence of  roof sagging or hogging, mold build-up, water damage from leaks, cracking or twisting of roof structure.</p>'+
                                               '<p>Moderate: Wider evidence of minor to moderate roof sagging or hogging, mold build-up, water damage from leaks, cracking or twisting of roof structure.</p>'+
                                               '<p>Major: Extensive evidence of moderate to major roof sagging or hogging, mold build-up, water damage from leaks, cracking or twisting of roof structure.</p>',
                                  'allowed_values': [{'value': 'None / minor'},
                                                     {'value': 'Moderate'},
                                                     {'value': 'Major'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Deterioration'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'How deteriorated is the foundation?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>None / minor: No evidence or some minor evidence of  small foundation cracks, rot or mold.</p>'+
                                               '<p>Moderate: Wider evidence of  small to medium foundation cracks. More common rot or mold.</p>'+
                                               '<p>Major: Extensive evidence of medium to large foundation cracks. Rot or mold is common.</p>',
                                  'allowed_values': [{'value': 'None / minor'},
                                                     {'value': 'Moderate'},
                                                     {'value': 'Major'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Deterioration'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'How deteriorated are the walls?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'None / minor'},
                                                     {'value': 'Moderate'},
                                                     {'value': 'Major'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Deterioration'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});
    question = Questions.insert( {'text': 'How deteriorated is the floor structure?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'None / minor'},
                                                     {'value': 'Moderate'},
                                                     {'value': 'Major'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Deterioration'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 4});
    question = Questions.insert( {'text': 'How deteriorated or damaged are the guttering, downspouts or roof seams?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'None / minor'},
                                                     {'value': 'Moderate'},
                                                     {'value': 'Major'},
                                                     {'value': 'N/A'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Deterioration'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 5});

    page = Pages.insert( {'name': "Snow, wind & roof details", "sort_order": 4, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'Wind Direction', 'sort_order': 1, 'type': 'Simple', 'use_map': true, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'In which direction does the prevailing wind come from at the building location?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>Wind direction is determined by which direction the wind is coming from (as opposed to which direction the wind is going to). This information is available from or by asking those likely to know within your community (e.g. airport staff, those reporting weather)</p>',
                                  'allowed_values': [{'value': 'North'},
                                                     {'value': 'South'},
                                                     {'value': 'West'},
                                                     {'value': 'East'},
                                                     {'value': 'Northeast'},
                                                     {'value': 'Southeast'},
                                                     {'value': 'Northwest'},
                                                     {'value': 'Southwest'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Snow'}, {'tag': 'Wind'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'In which direction do the "storm" or "high winds" come from in this area?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>Wind direction is determined by which direction the wind is coming from (as opposed to which direction the wind is going to). This information is available from or by asking those likely to know within your community (e.g. airport staff, those reporting weather)</p>',
                                  'allowed_values': [{'value': 'North'},
                                                     {'value': 'South'},
                                                     {'value': 'West'},
                                                     {'value': 'East'},
                                                     {'value': 'Northeast'},
                                                     {'value': 'Southeast'},
                                                     {'value': 'Northwest'},
                                                     {'value': 'Southwest'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Snow'}, {'tag': 'Wind'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});

    question_group = Question_Groups.insert( {'name': 'Exposure', 'sort_order': 2, 'type': 'Simple', 'use_map': true, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'How open is the building location?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>Open: The roof is completely exposed and the building is situated in open and level terrain.</p>'+
                                               '<p>Mixed: Only scattered trees, buildings and/or other minor obstructions are located in the vicinity of the building.</p>'+
                                               '<p>Sheltered: Houses, trees and/or other structures are located around and in close proximity to the building.</p>',
                                  'allowed_values': [{'value': 'Open'},
                                                     {'value': 'Mixed'},
                                                     {'value': 'Sheltered'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Exposure'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});

    question_group = Question_Groups.insert( {'name': 'Snow from other buildings', 'sort_order': 3, 'type': 'Simple', 'use_map': true, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Could snow fall from another building onto this building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Other buildings'}, {'tag': 'Snow'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});

    question_group = Question_Groups.insert( {'name': 'Roof Access', 'sort_order': 4, 'type': 'Simple', 'use_map': false, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'If possible, gain safe access to the roof. Is safe roof access possible?',
                                  'type': 'Multiple Choice',
                                  'help_text': "<p>Access to the roof is helpful, but not essential. Access makes taking snow depth and density measurements easier later on.</p>"+
                                               "<p>For more information as to what constitutes safe access, please consult GNWT's safety and health representatives for more information.</p>",
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof Access'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});

    question_group = Question_Groups.insert( {'name': 'Roof Area Details', 'sort_order': 5, 'type': 'Simple', 'use_map': true, 'multiple': true, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Trace one of the roof areas',
                                  'type': 'Geo-Area',
                                  'help_text': 'Trace a polygon with your finger to trace an area of the roof.',
                                  'label': 'Describe the Area',
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'What is the roof pitch of the roof area?',
                                  'type': 'Numeric',
                                  'help_text': '<p>Stand away from the building so you can see the roof side on. Use the roof pitch chart to help determine roof pitch. Roof pitch is measured as the angle of the roof surface from the horizontal, e.g. a flat roof has a roof pitch of 0 degrees.</p>',
                                  //'allowed_values': [{'value': 'Yes'},{'value': 'No'}],
                                  'apply_min': true, 'min': 0, 'apply_max': true, 'max': 1000,
                                  //'min_year': null, 'max_year': null,
                                  'possible_units': [{'unit': 'degrees', 'multiplier': 1}],
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'Describe the roof surface',
                                  'type': 'Multiple Choice',
                                  'help_text': "<p>Smooth and slippery: Glass, smooth metal or plastic materials.</p>"+
                                               "<p>Medium coarse: Roof tiles, asphalt or wood shingles.</p>"+
                                               "<p>Very coarse: The surface of the roof has integrated features that will prevent snow from sliding off the roof , e.g. snow guards, lateral raised edges, extra larger roof bolts etc.</p>",
                                  'allowed_values': [{'value': 'Smooth and slippery'},
                                                     {'value': 'Medium Coarse'},
                                                     {'value': 'Very Coarse'}
                                                   ],
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});

    question_group = Question_Groups.insert( {'name': 'Snow Slides', 'sort_order': 6, 'type': 'Simple', 'use_map': true, 'multiple': true, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Could snow slide from one roof level to another roof level on this building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Slide'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'Choose which roof area snow could slide from',
                                  'type': 'Geo-Point',
                                  'help_text': '<p>Touch your finger on the roof from which the snow falls.</p>',
                                  'label': 'Source Roof',
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Slide'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'Choose the roof area where the snow would accumulate',
                                  'type': 'Geo-Point',
                                  'help_text': '<p>Touch your finger on the roof to which the snow falls.</p>',
                                  'label': 'Recipient Roof',
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Slide'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});
    question = Questions.insert( {'text': 'How high is the drop between these two roof areas?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>This is the height between where the snow leaves the top roof area and lands on the roof of the lower roof area (not on the snow on the lower roof area) - i.e. roof surface to roof surface.</p>',
                                  'allowed_values': [{'value': 'Small (<1m)'},
                                                     {'value': 'Medium (1m to 2m)'},
                                                     {'value': 'Large (>2m)'}
                                                   ],
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Slide'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 4});
    question = Questions.insert( {'text': 'Is there anything on the higher roof area that could stop snow from sliding off?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>Large parapets or snow guards</p>',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Slide'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 5});

    question_group = Question_Groups.insert( {'name': 'Snow Drop', 'sort_order': 7, 'type': 'Simple', 'use_map': true, 'multiple': true, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Are there other areas where snow could potentially fall (but not slide) from one roof level to another roof level?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Drop'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'Choose which roof area snow could fall from',
                                  'type': 'Geo-Point',
                                  'help_text': '<p>Touch your finger on the roof from which the snow falls.</p>',
                                  'label': 'Source Roof',
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Fall'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'Choose the roof area where the snow would land',
                                  'type': 'Geo-Point',
                                  'help_text': '<p>Touch your finger on the roof to which the snow falls.</p>',
                                  'label': 'Recipient Roof',
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Fall'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});
    question = Questions.insert( {'text': 'How high is the drop between these two roof areas?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>This is the height between where the snow leaves the top roof area and lands on the roof of the lower roof area (not on the snow on the lower roof area) - i.e. roof surface to roof surface.</p>',
                                  'allowed_values': [{'value': 'Small (<1m)'},
                                                     {'value': 'Medium (1m to 2m)'},
                                                     {'value': 'Large (>2m)'}
                                                   ],
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Slide'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 4});
    question = Questions.insert( {'text': 'Is there a parapet or other similar feature on the edge of the high roof area that would stop snow from falling off?',
                                  'type': 'Multiple Choice',
                                  'help_text': '<p>This feature needs to be right on the edge of the higher roof area and configured so that snow cannot accumulate through wind action. If accumulation is evident, answer "No".</p>',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Slide'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 5});

    question_group = Question_Groups.insert( {'name': 'Snow Depth and Density', 'sort_order': 8, 'type': 'Simple', 'use_map': true, 'multiple': true, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Indicate where you took a snow measurement',
                                  'type': 'Geo-Point',
                                  'help_text': '<p>Touch your finger on the roof where you took your measurement.</p>',
                                  'label': 'Measurement',
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Depth'}, {'tag': 'Density'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'What is the value of the snow density measurement?',
                                  'type': 'Numeric',
                                  'help_text': '<p>These measurements are to ascertain an average "normal" snow density for the roof.</p>'+
                                               '<p>Combining depth and density allows us to compare actual pressure of snow with what the building is rated for, thereby calculating potential snowloading capacity.</p>',
                                  'apply_min': true, 'min': 0, 'apply_max': true, 'max': 1000,
                                  'possible_units': [{'unit': 'kg per cubic metre', 'multiplier': 1}],
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Depth'}, {'tag': 'Snow Density'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'What is the value of the snow depth measurement?',
                                  'type': 'Numeric',
                                  'help_text': '<p>These measurements are to ascertain an average "normal" snow depth for the roof.</p>'+
                                               '<p>Combining depth and density allows us to compare actual pressure of snow with what the building is rated for, thereby calculating potential snowloading capacity.</p>',
                                  'apply_min': true, 'min': 0, 'apply_max': true, 'max': 1000,
                                  'possible_units': [{'unit': 'metres', 'multiplier': 1},
                                                     {'unit': "centimetres", 'multiplier': 100}],
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Snow Depth'}, {'tag': 'Snow Density'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});

    question_group = Question_Groups.insert( {'name': 'Ice build-up', 'sort_order': 9, 'type': 'Simple', 'use_map': true, 'multiple': true, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Indicate an area of ice build-up',
                                  'type': 'Geo-Point',
                                  'help_text': '<p>Touch your finger on the roof where you observe ice build-up.</p>',
                                  'label': 'Ice Observed',
                                  'show_history': false, 'use_history': false, 'pictures': 'Permitted',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Ice'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'How thick is the ice?',
                                  'type': 'Numeric',
                                  'help_text': '<p>If you find ice buildup, measure the depth of the ice - taking care not to damage the roof surface.</p>',
                                  'apply_min': true, 'min': 0, 'apply_max': true, 'max': 1000,
                                  'possible_units': [{'unit': 'metres', 'multiplier': 1},
                                                     {'unit': "centimetres", 'multiplier': 100}],
                                  'show_history': false, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Roof'}, {'tag': 'Ice'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});


    page = Pages.insert( {'name': "Permafrost", "sort_order": 5, "page_colors": [{'value': "Yellow"},{'value': "Orange"},{'value': "Light Green"}], 'book_id': book});
    question_group = Question_Groups.insert( {'name': 'Permafrost Considerations', 'sort_order': 1, 'type': 'Simple', 'use_map': false, 'multiple': false, 'decision_points': [], 'page_id': page});
    question = Questions.insert( {'text': 'Is the building located on permafrost?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'},
                                                     {'value': "Don't Know"}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Permafrost'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 1});
    question = Questions.insert( {'text': 'Is there a properly-maintained and functioning thermo siphon installed in the building foundations?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Permafrost'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 2});
    question = Questions.insert( {'text': 'Is there a free airspace beneath the building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Permafrost'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 3});
    question = Questions.insert( {'text': 'Is there guttering on the roof?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Permafrost'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 4});
    question = Questions.insert( {'text': 'Are there downspouts from the guttering and associated stormwater drainage that moves stormwater at least 0.5m (2 foot) from the edge of the building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'},
                                                     {'value': 'N/A'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Permafrost'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 5});
    question = Questions.insert( {'text': 'Is there properly-engineered hard surfacing all around the building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Permafrost'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 6});
    question = Questions.insert( {'text': 'Does the ground slope away all around the building?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'},
                                                     {'value': 'N/A'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Permafrost'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 7});
    question = Questions.insert( {'text': 'Is snow regularly cleared from areas surrounding the building during snow season?',
                                  'type': 'Multiple Choice',
                                  'help_text': '',
                                  'allowed_values': [{'value': 'Yes'},
                                                     {'value': 'No'}
                                                   ],
                                  'show_history': true, 'use_history': false, 'pictures': 'disabled',
                                  'tags': [{'tag': 'Permafrost'}] });
    qig = Question_In_Group.insert({'group_id': question_group, 'question_id': question, 'sort_order': 8});
  }

  // if(cfs.images.filerecord.find().count() === 0) {
  //   cfs.images.filerecord.insert(
  //     {
  //       "_id" : "7TvM876g2KrvAedAR",
  //       "original" : {
  //         "name" : "Adult Offender.jpg",
  //         "updatedAt" : ISODate("2016-03-12T05:52:15Z"),
  //         "size" : 32152,
  //         "type" : "image/jpeg"
  //       },
  //       "owner" : "t7AkFT93iDhKS8nkX",
  //       "metadata" : {
  //         "owner" : "t7AkFT93iDhKS8nkX"
  //       },
  //       "uploadedAt" : ISODate("2016-03-12T13:27:43.452Z"),
  //       "copies" : {
  //         "images" : {
  //           "name" : "Adult Offender.jpg",
  //           "type" : "image/jpeg",
  //           "size" : 32152,
  //           "key" : "images-7TvM876g2KrvAedAR-Adult Offender.jpg",
  //           "updatedAt" : ISODate("2016-03-12T13:27:43Z"),
  //           "createdAt" : ISODate("2016-03-12T13:27:43Z")
  //         }
  //       }
  //     }
  //   );
  // }

  if(Buildings.find().count() === 0) {
    Buildings.insert( {'name': 'DOT Airport Combined Services', 'address': 'Unknown', 'region': 'Yellowknife',
                      'bounding_box': '[[62.4658007641611,-114.450533917207],[62.4670926867988,-114.44751361509]]',
                      'location': { 'type': 'Point', 'coordinates': [-114.4491216533, 62.4664625654]},
                      "picture" : "7TvM876g2KrvAedAR" }
    );
    Buildings.insert( {'name': 'Air Terminal Building', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.470475055072,-114.439726515251],[62.4717667382517,-114.436705274588]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.4397265153, 62.4711650084]}}
    );
    Buildings.insert( {'name': 'Regional Services Complex', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4693992356345,-114.427871768144],[62.4706906602649,-114.424850131112]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.4263904504, 62.4701031231]}}
    );
    Buildings.insert( {'name': 'Legislative Assembly Building', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4588789107256,-114.383942794008],[62.4601693813013,-114.380920356839]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3825279552, 62.4596318888]}}
    );
    Buildings.insert( {'name': 'Prince Of Wales Northern Heritage', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4557804625125,-114.381855487022],[62.4570708895191,-114.378833277157]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3802426274, 62.4564284676]}}
    );
    Buildings.insert( {'name': 'Arthur Laing Building', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4537434831913,-114.371107851382],[62.4550336763205,-114.368085391382]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3701928837, 62.4545877452]}}
    );
    Buildings.insert( {'name': 'Stuart Hodgson Building', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4537434831913,-114.371107851382],[62.4550336763205,-114.368085391382]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3694379143, 62.4543295046]}}
    );
    Buildings.insert( {'name': 'PWS Maintenance Shop', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4552240389814,-114.362870278526],[62.4565140507372,-114.359847316383]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3614416725, 62.4561461408]}}
    );
    Buildings.insert( {'name': 'PWS North Slave Office', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4552240389814,-114.362870278526],[62.4565140507372,-114.359847316383]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3613373648, 62.4558162323]}}
    );
    Buildings.insert( {'name': 'Tiaga Laboratory', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4531798152431,-114.362840162858],[62.4544698277454,-114.359817408129]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3618911999, 62.4539589051]}}
    );
    Buildings.insert( {'name': 'CS Lord Geoscience', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4531798152431,-114.362840162858],[62.4544698277454,-114.359817408129]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3610392107, 62.4537289121]}}
    );
    Buildings.insert( {'name': 'Rockhill - Apartments', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4485585396088,-114.363600275595],[62.4498485719321,-114.360578024915]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3620969985, 62.4492114181]}}
    );
    Buildings.insert( {'name': 'Stanton Hospital', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4468074471432,-114.4065947799],[62.44809842164,-114.403574539987]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.4047627701, 62.4474133093]}}
    );
    Buildings.insert( {'name': 'Central Warehouse', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.443973176952,-114.408076236109],[62.4452641857846,-114.40505634828]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.4071226425, 62.444748241]}}
    );
    Buildings.insert( {'name': 'Data Center', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.443973176952,-114.408076236109],[62.4452641857846,-114.40505634828]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.4059290005, 62.4444646421]}}
    );
    Buildings.insert( {'name': 'NSCF - Young Offenders', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4354808437939,-114.406723738804],[62.4367718288122,-114.403704658681]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.4052411237, 62.4360010041]}}
    );
    Buildings.insert( {'name': 'NSCF - Adult Facility', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4340929004302,-114.406203040457],[62.4353838750019,-114.403184079526]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.4046048057, 62.43482358]}}
    );
    Buildings.insert( {'name': 'ENR Warehouse', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4618949301684,-114.352659623079],[62.4631847137302,-114.349635544551]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.351271272, 62.4627292558]}}
    );
    Buildings.insert( {'name': 'ENR Regional Office', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4618949301684,-114.352659623079],[62.4631847137302,-114.349635544551]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.35169238, 62.4624948647]}}
    );
    Buildings.insert( {'name': 'ENR Lab Complex', 'address': 'Unknown', 'region': 'Yellowknife',
                       'bounding_box': '[[62.4618949301684,-114.352659623079],[62.4631847137302,-114.349635544551]]',
                       'location': { 'type': 'Point', 'coordinates': [-114.3511075912, 62.4623174136]}}
    );
  }
});
