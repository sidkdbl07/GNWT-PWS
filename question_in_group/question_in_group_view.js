if (Meteor.isClient) {
  Template.question_in_group_view.onRendered(function() {
    $.publish('page_changed',"books");
    $('ul.tabs').tabs();
    $.publish("toast",["Select","Select",'info']);
    $('select').material_select();
  });

  Template.question_in_group_view.helpers({
    'question': function() {
      return Questions.findOne({_id: this.question_id});
    },
    'group': function() {
      return Question_Groups.findOne({_id: this.group_id});
    },
    'page': function() {
      var group = Question_Groups.findOne({_id: this.group_id});
      return Pages.findOne({_id: group.page_id});
    },
    'book': function() {
      var group = Question_Groups.findOne({_id: this.group_id});
      var page = Pages.findOne({_id: group.page_id});
      return Books.findOne({_id: page.book_id});
    },
    'is_geo': function() {
      var question = Questions.findOne({_id: this.question_id});
      if(question.type === "Geo-Point" || question.type === "Geo-Area") {
        return true;
      }
      return false;
    },
    'is_numeric': function() {
      var question = Questions.findOne({_id: this.question_id});
      if(question.type === "Numeric" || question.type === "Year") {
        return true;
      }
      return false;
    },
    'is_mc': function() {
      var question = Questions.findOne({_id: this.question_id});
      if(question.type === "Multiple Choice") {
        return true;
      }
      return false;
    }
  });

  Template.question_in_group_view.events({
    "click #btn_add_mc": function(event, template){
      event.preventDefault();
      $.publish('toast',["This should add value: "+$("#value").val()+" and label: "+$("#label").val(),"Add Clicked",'info']);
      $("#value").val("");
      $("#label").val("");
    },
    "click #btn_add_num": function(event, template){
      event.preventDefault();
      $.publish('toast',["This should add min: "+$("#min").val()+", max: "+$("#max").val()+" and label: "+$("#label").val(),"Add Clicked",'info']);
      $("#min").val("");
      $("#max").val("");
      $("#label").val("");
    }
  });

}
