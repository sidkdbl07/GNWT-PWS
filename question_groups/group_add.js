if (Meteor.isClient) {
  Template.group_add.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.group_add.helpers({

  });

  Template.group_add.events({

  });

  AutoForm.hooks({
    'insert_group': {
      before: {
        insert: function(doc) {
          return doc;
        }
      },
      onSubmit: function(insertDoc) {
        Meteor.call('addGroup', insertDoc, function(error, result) {
          if(error) $.publish('toast',[error.reason,"An Error Occurred",'error']);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your addition was successful!","Group Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
