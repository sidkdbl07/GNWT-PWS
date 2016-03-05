if (Meteor.isClient) {
  Template.book_add.onRendered(function() {
    $.publish('page_changed',"books");
  });

  AutoForm.hooks({
    'insert_book': {
      before: {
        insert: function(doc) {
          return doc;
        }
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your addition was successful!","Book Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
