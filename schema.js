var Collections = {};
var Schemas = {};

if (Meteor.isClient) {
  Template.registerHelper("Schemas", Schemas);
  Template.registerHelper("Collections", Collections);
  Template.registerHelper('isCordova', function(){
    if (Meteor.isCordova){
      return true;
    }
  });
}

if(Meteor.isCordova) Ground.Collection(Meteor.users);

Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images")]
});
Images.allow({
 insert: function(){
 return true;
 },
 update: function(){
 return true;
 },
 remove: function(){
 return true;
 },
 download: function(){
 return true;
 }
});

/////////////////////////////////////////////
// Answers
Answers = Collections.Answers = new Meteor.Collection("Answers");
if(Meteor.isCordova) Ground.Collection(Answers);
Schemas.Answers = new SimpleSchema({
  'inspection_id': {
    type: String
  },
  'question_id': {
    type: String
  },
  'group_id': {
    type: String
  },
  'instance': {
    type: Number,
    optional: true
  },
  'value': {
    type: String,
    optional: true
  },
  'number_value': {
    type: Number,
    optional: true
  },
  'location': {
    type: Object,
    optional: true
  },
  'location.type': {
    type: String,
    allowedValues: ["Point", "Polygon"]
  },
  'location.coordinates': {
    type: [String]
  },
  'units': {
    type: String,
    optional: true
  },
  'user_id': {
    type: String
  },
  'date': {
    type: Date
  },
  'override_user': {
    type: String,
    optional: true
  },
  'override_date': {
    type: Date,
    optional: true
  },
  'photos': {
    type: [Object],
    optional: true
  },
  'photos.$.caption': {
    type: String
  },
  'comments': {
    type: String,
    optional: true
  }
});
Answers.attachSchema(Schemas.Answers);
Answers.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  }
});
Meteor.methods({
  // addAnswer: function(doc) {
  //   check(doc, Schemas.Answers);
  //   var obj = {name: doc.label};
  //   return Answers.insert(obj);
  // },
  // editAnswer: function(obj) {
  //   check(obj._id, String);
  //   check(obj.updateDoc.$set, Schemas.Answers);
  //   return Answers.update({_id: obj._id}, obj.updateDoc);
  // },
  // removeAnswer: function(id) {
  //   check(id, String);
  //   return Answers.remove(id);
  // }
});
if( Meteor.isClient ) {
  Ground.methodResume([
    'addAnswer',
    'editAnswer',
    'removeAnswer'
  ]);
}

/////////////////////////////////////////////
// Books
Books = Collections.Books = new Meteor.Collection("Books");
if(Meteor.isCordova) Ground.Collection(Books);
Schemas.Books = new SimpleSchema({
  'name': {
    type: String,
    label: "Name of Book",
    max: 200,
    unique: true
  },
  'locked': {
    type: Boolean,
    label: "Locked"
  },
  'pages': {
    type: [Schemas.Pages],
    optional: true
  }
});
Books.attachSchema(Schemas.Books);
Books.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  }
});
Meteor.methods({
  addBook: function(doc) {
    check(doc, Schemas.Books);
    var obj = {name: doc.name, locked: doc.locked, pages: doc.pages};
    return Books.insert(obj);
  },
  editBook: function(obj) {
    check(obj._id, String);
    check(obj.updateDoc.$set, Schemas.Books);
    return Books.update({_id: obj._id}, obj.updateDoc);
  },
  removeBook: function(id) {
    check(id, String);
    return Books.remove(id);
  }
});
if( Meteor.isClient ) {
  Ground.methodResume([
    'addBook',
    'editBook',
    'removeBook'
  ]);
}

/////////////////////////////////////////////
// BUILDINGS
Buildings = Collections.Buildings = new Meteor.Collection("Buildings");
if (Meteor.isCordova) Ground.Collection(Buildings);

Schemas.Buildings = new SimpleSchema({
  'name': {
    type: String,
    label: 'What is the name of the building?',
    max: 200,
    unique: true
  },
  'picture': {
    type: String,
    max: 200,
    optional: true,
    label: " ",
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        accept: 'image/*',
        label: 'Choose Aerial Image'
      }
    }
  },
  'bounding_box': {
    type: String,
    label: 'Bounding Box',
    optional: true
  },
  'address': {
    type: String,
    label: "What is the street address?",
    max: 200,
    optional: true
  },
  'region': {
    type: String,
    allowedValues: ['Fort Simpson','Fort Smith','Yellowknife', 'Pink Paradise'],
    label: "What region is the building in?",
    autoform: {
      firstOption: false,
      options: 'allowed'
    },
    optional: false
  },
  'location': {
    type: Object
  },
  'location.type': {
    type: String,
    allowedValues: ['Point'],
    autoform: {
      type: 'hidden',
      label: false
    }
  },
  'location.coordinates': {
    type: Array,
    minCount: 2,
    maxCount: 2
  },
  'location.coordinates.$': {
    type: Number,
    decimal: true,
    custom: function() {
      if(!(-180 <= this.value[0] <= 0))
        return 'lonOutOfRange';
      if(!(0 <= this.value[1] <= 90))
        return 'latOutOfRange';
    }
  }
});
Schemas.Buildings.messages = {
  lonOutOfRange: "Longitude out of range. Must be a negaive number between -180 and 0",
  latOutOfRange: "Latitude out of range. Must be a positive number between 0 and 90"
}
Buildings.attachSchema(Schemas.Buildings);
Buildings.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  }
});
Meteor.methods({
  addBuilding: function(doc) {
    check(doc, Schemas.Buildings);
    var obj = {name: doc.name, address: doc.address, region: doc.region, 'location': { 'type': 'Point', 'coordinates': [-119, 60]}};
    return Buildings.insert(obj);
  },
  editBuilding: function(obj) {
    check(obj._id, String);
    check(obj.updateDoc.$set, Schemas.Buildings);
    return Buildings.update({_id: obj._id}, obj.updateDoc);
  },
  removeBuilding: function(id) {
    check(id, String);
    return Buildings.remove(id);
  }
});

if( Meteor.isClient ) {
  Ground.methodResume([
    'addBuilding',
    'editBuilding',
    'removeBuilding'
  ]);
}

/////////////////////////////////////////////
// Decision Points
Decision_Points = Collections.Decision_Points = new Meteor.Collection("Decision_Points");
if(Meteor.isCordova) Ground.Collection(Decision_Points);
Schemas.Decision_Points = new SimpleSchema({
  'type': {
    type: String,
    allowedValues: ["Range","Value/Label"],
    autoform: {
      firstOption: "Choose a type",
      options: 'allowed'
    }
  },
  'qig_id': {
    type: String
  },
  'label': {
    type: String,
    label: "Label"
  },
  'value': {
    type: String,
    label: "Value",
    optional: true
  },
  'min': {
    type: Number,
    label: "Minimum",
    optional: true
  },
  'max': {
    type: Number,
    label: "Maximum",
    optional: true
  },
  'sort_order': {
    type: Number,
    decimal: false
  }
});
Decision_Points.attachSchema(Schemas.Decision_Points);
Decision_Points.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  }
});
Meteor.methods({
  addDecision_Point: function(doc) {
    check(doc, Schemas.Books);
    var obj = {name: doc.name};
    return Decision_Points.insert(obj);
  },
  editDecision_Point: function(obj) {
    check(obj._id, String);
    check(obj.updateDoc.$set, Schemas.Decision_Points);
    return Decision_Points.update({_id: obj._id}, obj.updateDoc);
  },
  removeDecision_Point: function(id) {
    check(id, String);
    return Decision_Points.remove(id);
  }
});
if( Meteor.isClient ) {
  Ground.methodResume([
    'addDecision_Point',
    'editDecision_Point',
    'removeDecision_Point'
  ]);
}

/////////////////////////////////////////////
// Inpections
Inspections = Collections.Inspections = new Meteor.Collection("Inspections");
if(Meteor.isCordova) Ground.Collection(Inspections);
Schemas.Inspections = new SimpleSchema({
  'book_id': {
    type: String
  },
  'building_id': {
    type: String
  },
  'date': {
    type: Date,
    autoValue: function() {
      return new Date();
    }
  },
  'user_id': { // User that attached the book
    type: String,
    autoValue: function() {
      return Meteor.userId();
    }
  }
});
Inspections.attachSchema(Schemas.Inspections);
Inspections.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  }
});
Meteor.methods({
  addInspection: function(doc) {
    check(doc, Schemas.Inspections);
    var obj = {name: doc.name, locked: doc.locked, pages: doc.pages};
    return Inspections.insert(obj);
  },
  editInspection: function(obj) {
    check(obj._id, String);
    check(obj.updateDoc.$set, Schemas.Inspections);
    return Inspections.update({_id: obj._id}, obj.updateDoc);
  },
  removeInspection: function(id) {
    check(id, String);
    return Inspections.remove(id);
  }
});

/////////////////////////////////////////////
// Navigation Rules
Navigation_Rules = Collections.Navigation_Rules = new Meteor.Collection("Navigation_Rules");
if(Meteor.isCordova) Ground.Collection(Navigation_Rules);
Schemas.Navigation_Rules = new SimpleSchema({
  'page_id': {
    type: String,
  },
  'group_id': {
    type: String,
  },
  'question_id': {
    type: String
  },
  'decision_point': {
    type: String
  },
  'excluded_question': {
    type: String
  }
});
Navigation_Rules.attachSchema(Schemas.Navigation_Rules);
Navigation_Rules.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  }
});
Meteor.methods({
  addNavigation_Rule: function(doc) {
    check(doc, Schemas.Navigation_Rules);
    var obj = {name: doc.name, locked: doc.locked, pages: doc.pages};
    return Navigation_Rules.insert(obj);
  },
  editNavigation_Rule: function(obj) {
    check(obj._id, String);
    check(obj.updateDoc.$set, Schemas.Navigation_Rules);
    return Navigation_Rules.update({_id: obj._id}, obj.updateDoc);
  },
  removeNavigation_Rule: function(id) {
    check(id, String);
    return Navigation_Rules.remove(id);
  }
});

/////////////////////////////////////////////
// Pages
Pages = Collections.Pages = new Meteor.Collection("Pages");
if(Meteor.isCordova) Ground.Collection(Pages);
Schemas.Pages = new SimpleSchema({
  'name': {
    type: String,
    label: "Name of Page",
    max: 200
  },
  'sort_order': {
    type: Number,
    optional: false,
    decimal: false
  },
  'page_colors': {
    type: Array,
    minCount: 1,
    maxCount: 5
  },
  'page_colors.$': {
    type: Object,
    label: "Page Colours",
  },
  'page_colors.$.value': {
    type: String,
    label: "Colour",
    allowedValues: ["Red","Orange","Yellow","Light Green","Dark Green"],
    autoform: {
      firstOption: false,
      options: 'allowed'
    }
  },
  'book_id': {
    type: String,
    optional: false
  }
});
Pages.attachSchema(Schemas.Pages);
Pages.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  }
});
Meteor.methods({
  addPage: function(doc) {
    check(doc, Schemas.Pages);
    var obj = {name: doc.name};
    return Pages.insert(obj);
  },
  editPage: function(obj) {
    check(obj._id, String);
    check(obj.updateDoc.$set, Schemas.Pages);
    return Pages.update({_id: obj._id}, obj.updateDoc);
  },
  removePage: function(id) {
    check(id, String);
    return Pages.remove(id);
  }
});


///////////////////////////////////////////
// QUESTIONS
Questions = Collections.Questions = new Meteor.Collection("Questions");
if (Meteor.isCordova) Ground.Collection(Questions);

Schemas.Questions = new SimpleSchema({
  'text': {
    type: String,
    label: "Your Question",
    max: 200,
    autoform: {
      rows: 1
    }
  },
  'help_text': {
    type: String,
    label: "Text to help answer the question",
    max: 1000,
    optional: true,
    autoform: {
      rows: 1
    }
  },
  'type': {
    type: String,
    allowedValues: ['Multiple Choice', 'Numeric', 'Year', 'Geo-Point', 'Geo-Area'],
    label: 'What type of question are you asking?',
    autoform: {
      firstOption: "Please select one type",
      options: 'allowed'
    },
    optional: false
  },
  'show_history': {
    type: Boolean,
    label: 'Allow user to see past responses'
  },
  'use_history': {
    type: Boolean,
    label: "Pre-populate field with historical response"
  },
  'pictures': {
    type: String,
    allowedValues: ['Disabled','Permitted','Required'],
    label: 'Photos',
    autoform: {
      firstOption: false,
      options: 'allowed'
    }
  },
  'tags': {
    type: Array,
    optional: true,
    minCount: 0
  },
  'tags.$': {
    type: Object
  },
  'tags.$.tag': {
    type: String,
    label: ""
  },
  'allowed_values': {
    type: Array,
    minCount: 0,
    optional: true
  },
  'allowed_values.$': {
    type: Object
  },
  'allowed_values.$.value': {
    type: String,
    label: "Possible Answer",
    min: 1,
    max: 100
  },
  'label': {
    type: String,
    optional: true,
    label: 'Label'
  },
  'apply_min': {
    type: Boolean,
    optional: true,
    label: "Apply Minimum",
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox"
      }
    }
  },
  'min': {
    type: Number,
    optional: true
  },
  'min_year': {
    type: Number,
    optional: true,
    decimal: false,
    min: 1900,
    max: function() {
      return parseInt(new Date().getFullYear());
    }
  },
  'apply_max': {
    type: Boolean,
    optional: true,
    label: "Apply Maximum",
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox"
      }
    }
  },
  'max': {
    type: Number,
    optional: true,
    label: 'Maximum'
  },
  'max_year': {
    type: Number,
    optional: true,
    decimal: false,
    min: 1900,
    max: function() {
      return parseInt(new Date().getFullYear());
    }
  },
  'possible_units': {
    type: Array,
    optional: true,
    minCount: 0,
    label: 'Possible Units'
  },
  'possible_units.$': {
    type: Object
  },
  'possible_units.$.unit': {
    type: String
  },
  'possible_units.$.multiplier': {
    type: Number
  }
});
if (Meteor.isClient) {
  Template.registerHelper('question_min_label', function() {
    if(AutoForm.getFieldValue("type")=="Year")
      return "Minimum Year";
    else
      return "Minimum Value";
  });

}
Questions.attachSchema = new SimpleSchema(Schemas.Questions);
Questions.allow({
  insert: function (userId, doc) {
    debugger;
    if(userId && Roles.userIsInRole(userId, ['admin'], 'default_group')) {
      return true;
    } else {
      return false
    }
  },
  update: function(userId, doc, fields, modifier) {
    if(userId && Roles.userIsInRole(userId, ['admin'], 'default_group')) {
      return true;
    } else {
      return false
    }
  }
});

///////////////////////////////////////////
// QUESTION GROUPS
Question_Groups = Collections.Question_Groups = new Meteor.Collection("Question_Groups");
if (Meteor.isCordova) Ground.Collection(Question_Groups);

Schemas.Question_Groups = new SimpleSchema({
  'name': {
    type: String,
    label: 'Name of Group',
    optional: false
  },
  'sort_order': {
    type: Number,
    decimal: false,
    optional: false
  },
  'type': {
    type: String,
    label: 'Type of Group',
    allowedValues: ['Simple', 'Math', 'Lookup'],
    autoform: {
      firstOption: false,
      options: 'allowed'
    }
  },
  'multiple': {
    type: Boolean,
    label: 'Allow multiple?',
    optional: true
  },
  'use_map': {
    type: Boolean,
    label: "Display map?",
    optional: true
  },
  'page_id': {
    type: String,
    optional: false
  },
  'decision_points': {
    type: [String],
    optional: true
  }
});

Question_Groups.attachSchema = new SimpleSchema(Schemas.Question_Groups);
Question_Groups.allow({
  insert: function (userId, doc) {
    debugger;
    if(userId && Roles.userIsInRole(userId, ['admin'], 'default_group')) {
      return true;
    } else {
      return false
    }
  },
  update: function(userId, doc, fields, modifier) {
    if(userId && Roles.userIsInRole(userId, ['admin'], 'default_group')) {
      return true;
    } else {
      return false
    }
  }
});

///////////////////////////////////////////
// QUESTION IN GROUP
Question_In_Group = Collections.Question_In_Group = new Meteor.Collection("Question_In_Group");
if (Meteor.isCordova) Ground.Collection(Question_In_Group);

Schemas.Question_In_Group = new SimpleSchema({
  'group_id': {
    type: String
  },
  'question_id': {
    type: String
  },
  'sort_order': {
    type: Number,
    decimal: false
  },
  'operator': {
    type: String,
    label: "Operator",
    optional: true,
    allowedValues: ["No Operation", "Add next value", "subtract next value", "Multiply next value", "Divide by next value"],
    autoform: {
      firstOption: false,
      options: 'allowed'
    }
  },
  'decision_points': {
    type: [String],
    optional: true
  }
});

Question_In_Group.attachSchema = new SimpleSchema(Schemas.Question_In_Group);
Question_In_Group.allow({
  insert: function (userId, doc) {
    if(userId && Roles.userIsInRole(userId, ['admin'], 'default_group')) {
      return true;
    } else {
      return false
    }
  },
  update: function(userId, doc, fields, modifier) {
    if(userId && Roles.userIsInRole(userId, ['admin'], 'default_group')) {
      return true;
    } else {
      return false
    }
  }
});
