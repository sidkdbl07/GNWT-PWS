if (Meteor.isClient) {
  Template.book_add.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.book_add.helpers({

  });

  Template.book_add.events({

  });

  AutoForm.hooks({
    'insert_book': {
      before: {
        insert: function(doc) {
          doc.pages = [];
          return doc;
        }
      },
      onSubmit: function(insertDoc) {
        Meteor.call('addBook', insertDoc, function(error, result) {
          if(error) $.publish('toast',[error.reason,"An Error Occurred",'error']);
        });
        $(".back-button").click();
        return false;
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
