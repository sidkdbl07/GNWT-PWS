if (Meteor.isClient) {
  Meteor.subscribe("directory");
  Template.users.helpers({
    'all_users': function() {
      return Meteor.users.find().fetch();
    }
  });
  Template.users.onRendered(function(){
    $("#btn_new_user").leanModal();
  });
  Template.users.events({
    'click .btn_edit_user': function(e, t) {
      $("#edit_user_id").val(this._id);
      $("#edit_user_fullname").val(this.profile.fullname);
      $("#edit_user_fullname").next('label').addClass('active');
      $("#edit_user_email").val(this.emails[0].address);
      $("#edit_user_email").next('label').addClass('active');
      $("input[name=edit_user_role][value="+this.roles.default_group[0]+"]").attr('checked', 'checked');
      $("#user_edit_modal").openModal();
    }
  });
  Template.user_new.events({
    'click #submit_user_new': function () {
      $('#form_user_new').submit();
    },
    'submit #form_user_new': function(event){
      event.preventDefault();
      var fullname = $('[name=create_user_fullname]').val();
      var email = $('[name=create_user_email]').val();
      var password = $('[name=create_user_password]').val();
      var role = $('[name=create_user_role]:checked').val();
      // We call the function to create the new user on the
      // server, otherwise it will change the current user
      // to the one we just created.
      Meteor.call('create_user', fullname, email, password, [role]);
      // Clean up the form and close the dialog
      $('#user_new_modal').closeModal();
      $('[name=create_user_fullname]').val("");
      $('[name=create_user_email]').val("");
      $('[name=create_user_password]').val("");
    }
  });
}
