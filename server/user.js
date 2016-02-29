Meteor.methods( {
  'create_user' : function(pFullname, pEmail, pPassword, pRoles) {
    var id;
    id = Accounts.createUser({
      username: "",
      email: pEmail,
      password: pPassword,
      profile: {
          fullname: pFullname
      }
    });
    Roles.addUsersToRoles(id, pRoles, 'default_group');
  }
});
