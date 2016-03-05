if (Meteor.isClient) {
  Template.question_add.onRendered(function() {
    $.publish('page_changed',"questions");
    $(".collapsible").collapsible();
  });

  Template.question_add.onCreated(function() {
    this.number_of_tags = new ReactiveVar(0);
  });

  Template.question_add.helpers({
    'number_of_tags': function() {
      return Template.instance().number_of_tags.get();
    }
  });

  Template.question_add.events({
    'blur input[type="text"][name^="tags"]': function(event, template) {
      template.number_of_tags.set($('input[type="text"][name^="tags"]').length);
    },
    'click button.autoform-remove-item[data-autoform-field="tags"]': function(event, template) {
      template.number_of_tags.set($('input[type="text"][name^="tags"]').length - 1);
    }
  });

  AutoForm.hooks({
    'insert_question': {
      before: {
        insert: function(doc) {
          return doc;
        }
      },
      onSubmit: function(insertDoc) {
        Meteor.call('addQuestion', insertDoc, function(error, result) {
          if(error) alert(error.reason);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your addition was successful!","Question Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
