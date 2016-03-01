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

///////////////////////////////////////////
// PAGES
Pages = Collections.Pages = new Meteor.Collection("Pages");
if (Meteor.isCordova) Ground.Collection(Pages);

Schemas.Pages = new SimpleSchema({
  'name': {
    type: String,
    label: 'Name',
    max: 100
  },
  'icon': {
    type: String,
    label: 'Name',
    max: 100
  },
  'route': {
    type: String,
    label: 'Name',
    max: 100
  },
  'include_in_menu': {
    type: Boolean,
    label: 'Name'
  },
  'protected': {
    type: Boolean,
    label: 'Administrator Only'
  },
});
Pages.attachSchema(Schemas.Pages);

///////////////////////////////////////////
// QUESTIONS
Questions = new Meteor.Collection("Questions");
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
      rows: 5
    }
  },
  'type': {
    type: String,
    allowedValues: ['Multiple Choice', 'Numeric', 'Date'],
    label: 'What type of question are you asking?',
    autoform: {
      firstOption: true,
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
  'map_annotations': {
    type: String,
    allowedValues: ['Disabled','Points Only Permitted','Points Only Required','Line Only Permitted','Line Only Required','Areas Only Permitted','Areas Only Required','All Permitted', 'All Required'],
    label: 'Map Annotations',
    autoform: {
      firstOption: false,
      options: 'allowed'
    }
  },
  'tags': {
    type: Array,
    optional: true
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
    maxCount: 5
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
  'numbers': {
    type: Array,
    optional: true
  },
  'numbers.$': {
    type: Object
  },
  'numbers.$.label': {
    type: String,
    optional: false,
    label: 'Label'
  },
  'numbers.$.apply_min': {
    type: Boolean,
    optional: true,
    label: "Apply Minimum",
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox"
      }
    }
  },
  'numbers.$.min': {
    type: Number,
    optional: true,
    label: 'Minimum'
  },
  'numbers.$.apply_max': {
    type: Boolean,
    optional: true,
    label: "Apply Maximum",
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox"
      }
    }
  },
  'numbers.$.max': {
    type: Number,
    optional: true,
    label: 'Maximum'
  },
  'numbers.$.possible_units': {
    type: Array,
    optional: true,
    label: 'Possible Units'
  },
  'numbers.$.possible_units.$': {
    type: Object
  },
  'numbers.$.possible_units.$.unit': {
    type: String
  },
  'numbers.$.possible_units.$.multiplier': {
    type: Number
  },
  'numbers.$.operator': {
    type: String,
    allowedValues: ['No operation','Multiply by next','Divide by next','Add next','Subtract next'],
    label: "Operator",
    autoform: {
      firstOption: false,
      options: 'allowed'
    }
  },
  'dates': {
    type: Array,
    optional: true
  },
  'dates.$': {
    type: Object
  },
  'dates.$.label': {
    type: String,
    optional: false,
    label: 'Label'
  },
  'dates.$.apply_min': {
    type: Boolean,
    optional: true,
    label: "Apply Minimum",
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox"
      }
    }
  },
  'dates.$.min': {
    type: Number,
    optional: true,
    label: 'Minimum'
  },
  'dates.$.apply_max': {
    type: Boolean,
    optional: true,
    label: "Apply Maximum",
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox"
      }
    }
  },
  'dates.$.max': {
    type: Number,
    optional: true,
    label: 'Maximum'
  }
});
Questions.attachSchema = new SimpleSchema(Schemas.Questions);
Questions.allow({
  insert: function() {
    if(this.userId && Roles.userIsInRole(this.userId, ['admin'], 'default_group')) {
      return true;
    } else {
      return false
    }
  },
  update: function() {
    if(this.userId && Roles.userIsInRole(this.userId, ['admin'], 'default_group')) {
      return true;
    } else {
      return false
    }
  }
});
