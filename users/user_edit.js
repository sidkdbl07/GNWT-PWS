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
  });

  Template.user_edit.helpers({
    checkedIf: function(role) {
      // return roles.default_group.[0] == role;
      return Template.instance().data.roles.default_group[0] == role ? 'checked' : '';
    }
  });

  Template.user_edit.events({
    // 'click #submit_user_edit_info': function(event) {
    //   event.preventDefault();
      
    //   var id = Template.instance().data._id;
    //   var email = $('[name=edit_user_email]').val();
    //   var fullname = $('[name=edit_user_fullname]').val();      

    //   if( $('[name=edit_user_email]').hasClass("invalid") || $('[name=edit_user_fullname]').hasClass("invalid") || email == "" || fullname == "" ) 
    //   {
    //     $.publish('toast', ["You have to fill Full Name and eMail Address correctly!", "User Info Save Failed", 'warning']);
    //     return false;
    //   }
      
    //   Meteor.call("userUpdate", id, {'profile.fullname': fullname, 'emails[0].address': email}, function(error, result) {
    //     if(error) $.publish('toast',[error.reason,"An error occurred",'error']);
    //     else $.publish('toast',["Your change to user info accepted","User Info Saved",'success']);
    //   });

    //   // Meteor.users.update( {_id: id }, { $set: {'profile.fullname': fullname, 'emails[0].address': email} });  
    // }
  });
}

Meteor.methods({
  userUpdate: function (id, userInfo) {
    return Meteor.users.update( {_id: id }, { $set: userInfo });
  }
});
