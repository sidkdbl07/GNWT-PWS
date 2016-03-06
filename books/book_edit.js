if (Meteor.isClient) {
  Template.book_edit.onRendered(function() {
    $.publish('page_changed',"books");
  });

  AutoForm.hooks({
    'update_building': {
      onSubmit: function(insertDoc, updateDoc, currentDoc) {
        var obj = {_id: Router.current().params._id, updateDoc: updateDoc};
        Meteor.call('editBook', obj, function(error, result) {
          if (error) alert(error.reason);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your update was successful!","Book Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  })
}