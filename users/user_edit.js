if (Meteor.isClient) {
  Template.user_edit.events({
    'click #submit_user_edit_info': function(event) {
      event.preventDefault();
      var id = $('[name=create_user_id]').val();
      var email = $('[name=create_user_email]').val();
      var fullname = $('[name=edit_user_fullname]').val();
      Meteor.users.update( {_id: id }, { $set: {'profile.fullname': fullname, 'emails[0].address': email} });
    }
  });
}
