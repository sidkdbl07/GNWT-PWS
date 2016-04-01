if (Meteor.isClient) {
  Template.user_edit.onRendered(function(){
    $.publish('page_changed',"users");
    
    $( '#user_info_form' ).validate({
      submitHandler: function(form) {
        console.log("form submit");

        var id = $('[name=user_id]').val();
        var email = $('[name=edit_user_email]').val();
        var fullname = $('[name=edit_user_fullname]').val();      

        Meteor.call("userUpdate", id, {'profile.fullname': fullname, 'emails[0].address': email}, function(error, result) {
          if(error) $.publish('toast',[error.reason,"An error occurred",'error']);
          else $.publish('toast',["Your change to user info accepted","User Info Saved",'success']);
        });
      }
    });

    // $( '#user_permission_form' ).validate({
    //   submitHander: function(form) {
    //     var id = $('[name=user_id]').val();
    //     var role = $('[name=edit_user_role]:checked')[0].value;

    //     Meteor.call("updateRoles", id, new Array(role), function(error, result) {
    //       if(error) $.publish('toast',[error.reason,"An error occurred",'error']);
    //       else $.publish('toast',["Your change to user info accepted","User Info Saved",'success']);
    //     });
    //   }
    // });

  });

  Template.user_edit.helpers({
    checkedIf: function(role) {
      // return roles.default_group.[0] == role;
      return Template.instance().data.roles.default_group[0] == role ? 'checked' : '';
    }
  });

  Template.user_edit.events({
    'click #submit_user_edit_perm': function(event) {
      event.preventDefault();
      
      var id = $('[name=user_id]').val();
      var role = $('[name=edit_user_role]:checked')[0].value;

      Meteor.call("updateRoles", id, new Array(role), function(error, result) {
        if(error) $.publish('toast',[error.reason,"An error occurred",'error']);
        else $.publish('toast',["Your change to user info accepted","User Info Saved",'success']);
      });
    }
  });
}

Meteor.methods({
  userUpdate: function (id, userInfo) {
    return Meteor.users.update( {_id: id }, { $set: userInfo });
  },
  updateRoles: function (targetUserId, roles, group = 'default_group') {
    var loggedInUser = Meteor.user()

    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser, ['admin'], 'default_group')) {
      throw new Meteor.Error(403, "Access denied")
    }

    Roles.setUserRoles(targetUserId, roles, group)
  }
});
