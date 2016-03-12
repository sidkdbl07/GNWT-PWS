if (Meteor.isClient) {
  Template.answer_draw_at_a_location.onRendered(function() {
    $.publish('page_changed',"buildings");
  });

  Template.answer_draw_at_a_location.helpers({
    'questions_in_group': function() {
      return Question_In_Group.Find({group_id: this.group._id},{sort: {sort_order: 1}}).fetch();
    }
  });
}
