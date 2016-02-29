if (Meteor.isClient) {
  Template.building_add.onRendered(function() {
    // Make sure that the page has a title
    if($('#header_page_title').html() == "")
      $('#header_page_title').html("Buildings");
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
        Neteor.call('addBuilding', insertDoc, function(error, result) {
          if(error) alert(error.reason);
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
