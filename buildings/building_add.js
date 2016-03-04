if (Meteor.isClient) {
  Template.building_add.onRendered(function() {
    $.publish('page_changed',"buildings");
  });

  AutoForm.hooks({
    'insert_building': {
      before: {
        insert: function(doc) {
          doc.location.type = 'Point';
          return doc;
        }
      },
      onSubmit: function(insertDoc) {
        Meteor.call('addBuilding', insertDoc, function(error, result) {
          if(error) $.publish('toast',[error.reason,"An error occurred",'error']);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your addition was successful!","Building Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
