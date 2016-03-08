if (Meteor.isClient) {
  Template.page_add.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.page_add.helpers({

  });

  Template.page_add.events({

  });

  AutoForm.hooks({
    'insert_page': {
      before: {
        insert: function(doc) {
          // doc.book_id = this.template.data.params.book_id;
          return doc;
        }
      },
      onSubmit: function(insertDoc) {
        Meteor.call('addPage', insertDoc, function(error, result) {
          if(error) $.publish('toast',[error.reason,"An Error Occurred",'error']);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your addition was successful!","Page Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
