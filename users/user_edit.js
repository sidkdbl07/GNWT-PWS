if (Meteor.isClient) {
  Template.user_edit.onRendered(function(){
    $.publish('page_changed',"users");
  });

  Template.user_edit.helpers({
    checkedIf: function(role) {
      // return roles.default_group.[0] == role;
      return Template.instance().data.roles.default_group[0] == role ? 'checked' : '';
    }
  });

  Template.user_edit.events({
    'click #submit_user_edit_info': function(event) {
      event.preventDefault();
      if( !$('[name=edit_user_email]').hasClass("valid") || !$('[name=edit_user_fullname]').hasClass("valid") ) 
      {
        $.publish('toast', ["You have to fill Full Name and eMail Address correctly!", "User Info Save Failed", 'warning']);
        return false;
      }
      var id = Template.instance().data._id;
      var email = $('[name=edit_user_email]').val();
      var fullname = $('[name=edit_user_fullname]').val();      
      
      Meteor.call("userUpdate", id, {'profile.fullname': fullname, 'emails[0].address': email}, function(error, result) {
        if(error) $.publish('toast',[error.reason,"An error occurred",'error']);
        else $.publish('toast',["Your change to user info accepted","User Info Saved",'success']);
      });

      // Meteor.users.update( {_id: id }, { $set: {'profile.fullname': fullname, 'emails[0].address': email} });  
    }
  });
}

Meteor.methods({
  userUpdate: function (id, userInfo) {
    return Meteor.users.update( {_id: id }, { $set: userInfo });
  }
});
