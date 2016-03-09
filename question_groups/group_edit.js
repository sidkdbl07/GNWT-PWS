if (Meteor.isClient) {
  Template.group_edit.onRendered(function() {
    $.publish('page_changed',"groups");
  });

  AutoForm.hooks({
    'update_group': {
      onSubmit: function(insertDoc, updateDoc, currentDoc) {
        var obj = {_id: Router.current().params._id, updateDoc: updateDoc};
        Meteor.call('editGroup', obj, function(error, result) {
          if (error) alert(error.reason);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your update was successful!","Group Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
