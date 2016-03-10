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
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        accept: 'image/*',
        label: 'Choose file'
      }
    }
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
    allowedValues: ['Multiple Choice', 'Numeric', 'Year', 'Geo-Point'],
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
    maxCount: 5,
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
    allowedValues: ['Simple', 'Math', 'Lookup', 'Measurements at a Location'],
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
  'page_id': {
    type: String,
    optional: false
  },
  'decision_points': {
    type: [Schemas.Decision_Points],
    optional: true
  },
  'questions': {
    type: Array,
    optional: true
  },
  'questions.$': {
    type: Object
  },
  'questions.$.question': {
    type: String
  },
  'questions.$.sort_order': {
    type: Number,
    decimal: false
  },
  'questions.$.operator': {
    type: String,
    label: "Operator",
    optional: true,
    allowedValues: ["No Operation", "Add next value", "subtract next value", "Multiply next value", "Divide by next value"],
    autoform: {
      firstOption: false,
      options: 'allowed'
    }
  },
  'questions.$.decision_points': {
    type: [Schemas.Decision_Points],
    optional: true
  }
});
Decision_Points = Schemas.Decision_Points = new SimpleSchema({
  'label': {
    type: String,
    label: "Label"
  },
  'min': {
    type: Number,
    label: "Lower Bound",
    optional: true
  },
  'max': {
    type: Number,
    label: "Upper Bound",
    optional: true
  },
  'value': {
    type: String,
    label: "Value"
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
    type: [Schemas.Decision_Points],
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
