if (Meteor.isClient) {
  Template.question_edit.onRendered(function() {
    $.publish('page_changed',"questions");
    $(".collapsible").collapsible();
  });

  Template.question_edit.onCreated(function() {
    this.number_of_tags = new ReactiveVar(this.data.tags === undefined ? 0 : this.data.tags.length);
  });

  Template.question_edit.helpers({
    'number_of_tags': function() {
      return Template.instance().number_of_tags.get();
    }
  });

  Template.question_edit.events({
    'blur input[type="text"][name^="tags"]': function(event, template) {
      template.number_of_tags.set($('input[type="text"][name^="tags"]').length);
    },
    'click button.autoform-remove-item[data-autoform-field="tags"]': function(event, template) {
      template.number_of_tags.set($('input[type="text"][name^="tags"]').length - 1);
    }
  });

  AutoForm.hooks({
    'update_question': {
      onSuccess: function(formType, result) {
        $.publish('toast',["Your update was successful!","Question Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  })
}
