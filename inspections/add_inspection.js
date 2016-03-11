if (Meteor.isClient) {
  Template.inspection_add.onRendered(function() {
    $.publish('page_changed',"buildings");
  });

  Template.inspection_add.helpers({
    'building': function() {
      return Books.findOne({_id: this.params._id});
    },
    'all_books': function() {
      return Books.find({}, {fields: {name: 1}, sort: {name: 1}}).map(function (q){
        return {label: q.name, value: q._id};
      });
    }
  });

  Template.inspection_add.events({

  });

  AutoForm.hooks({
    'insert_inspection': {
      before: {
        insert: function(doc) {
          // doc.group_id = this.group._id;
          // var newestQuestionInGroup = Question_In_Group.findOne({}, { sort: {sort_order: -1} });
          // doc.sort_order = newestQuestionInGroup ? newestQuestionInGroup.sort_order + 1 : 0 ;
          return doc;
        }
      },
      onSubmit: function(insertDoc) {
        Meteor.call('addInspection', insertDoc, function(error, result) {
          if(error) $.publish('toast',[error.reason,"An Error Occurred",'error']);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your addition was successful!","Insepction Added",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
