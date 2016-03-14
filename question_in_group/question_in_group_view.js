if (Meteor.isClient) {
  Template.question_in_group_view.onRendered(function() {
    $.publish('page_changed',"books");
    $('ul.tabs').tabs();
    $('select').material_select();
  });

  Template.question_in_group_view.helpers({
    'decision_points': function() {
      return Decision_Points.find({qig_id: this._id}, {sort: {sort_order: 1}}).fetch();
    },
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
      //$.publish('toast',["This should add value: "+$("#value").val()+" and label: "+$("#label").val(),"Add Clicked",'info']);
      if($("#value").val() !== "" && $("#label").val() !== "") {
        var next = Decision_Points.find({qig_id: this._id}).count() + 1; // determine sort_order
        // TODO: need this to sve to the DB
        var new_dp = Decision_Points.insert({type: 'Value/Label', qig_id: this._id, label: $("#label").val(), value: $("#value").val(), sort_order: next});
        if(new_dp) {
          $.publish('toast',["Decision Point added!","Success",'success']);
          $("#value").val("");
          $("#label").val("");
        } else {
          $.publish('toast',["Decision Point was not added!","Error",'error']);
        }
      } else {
        $.publish('toast',["You must enter values for value and label","Error",'error']);
      }
    },
    "click #btn_add_num": function(event, template){
      event.preventDefault();
      $.publish('toast',["This should add min: "+$("#min").val()+", max: "+$("#max").val()+" and label: "+$("#label").val(),"Add Clicked",'info']);
      if($("#min").val() !== "" && $("#max").val() !== "" && $("#label").val() !== "") {
        var next = Decision_Points.find({qig_id: this._id}).count() + 1; // determine sort_order
        // TODO: need this to sve to the DB
        var new_dp = Decision_Points.insert({type: 'Range', qig_id: this._id, label: $("#label").val(), min: $("#min").val(), max: $("#max").val(), sort_order: next});
        if(new_dp) {
          $.publish('toast',["Decision Point added!","Success",'success']);
          $("#min").val("");
          $("#max").val("");
          $("#label").val("");
        } else {
          $.publish('toast',["Decision Point was not added!","Error",'error']);
        }
      } else {
        $.publish('toast',["You must enter values for min, max and label","Error",'error']);
      }
    }
  });

}
