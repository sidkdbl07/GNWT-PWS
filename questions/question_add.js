if (Meteor.isClient) {
  Template.question_add.onRendered(function() {
    $(".collapsible").collapsible();
    // Make sure that the page has a title
    if($('#header_page_title').html() == "")
      $('#header_page_title').html("Questions");
  });

  Template.question_add.helpers({
    'number_of_tags': function() {
      console.log($("input[name^='tags']").length);
      return $("input[name^='tags']").length;
    }
  });

  Template.question_add.events({

  });

}
