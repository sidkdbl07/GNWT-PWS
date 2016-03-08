if (Meteor.isClient) {
  Template.page_edit.onRendered(function() {
    $.publish('page_changed',"pages");
  });

  AutoForm.hooks({
    'update_page': {
      onSubmit: function(insertDoc, updateDoc, currentDoc) {
        var obj = {_id: Router.current().params._id, updateDoc: updateDoc};
        Meteor.call('editBook', obj, function(error, result) {
          if (error) alert(error.reason);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your update was successful!","Page Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  })
}