if (Meteor.isClient) {
  ////////////////////////////////////////
  // Setup Subscriptions
  ////////////////////////////////////////
  Meteor.subscribe("site_pages");
  var userData = Meteor.subscribe('user');

  /////////////////////////////////////////
  // Menu events and helpers
  /////////////////////////////////////////
  Template.menu.helpers({
    'currentUser': function() {
      return Meteor.user();
    }
  });
  Template.menu.events({
    'click #menu_button': function () {
      $('#menu_slide').animate({ width: 'toggle'});
    },
    'click .menu_slide_button': function () {
      setTimeout(function() { $('#menu_slide').animate({ width: 'toggle'});}, 500);
    }
  });
  /////////////////////////////////////////
  // Not neccessarily part of menus but closely related is this custom
  // subscription that monitors the routing and changes the menu
  // accordingly.
  /////////////////////////////////////////
  $.subscribe("page_changed", function(e, page_name) {
    if(page_name === "home") // default page
      page_name = "buildings";
    //var menu_object = Pages.findOne({'route': page_name}); // Asynchronous
    //$.publish('toast',[menu_object.include_in_menu,"Include",'info']);
    $(".menu_nav_button").removeClass("menu_nav_button_active");
    $(".menu_slide_button").removeClass("menu_slide_button_active");
    $("#menu_nav_"+page_name).addClass("menu_nav_button_active");
    $("#menu_slide_"+page_name).addClass("menu_slide_button_active");
  });

  ////////////////////////////////////////
  // Login helpers, render events and events
  ////////////////////////////////////////
  Template.login.onRendered(function() {
    $("#login_button").leanModal();
  });
  Template.login.events({
    'click #submit_logout': function (event) {
      event.preventDefault();
      Meteor.logout();
      $('#login_modal').closeModal();
      $.publish('toast', ["You have been logged out", "Logout Successful!", "success"]);
    },
    'click #submit_login': function (e) {
      e.preventDefault();
      $('#form_login').submit();
    },
    'submit form': function(e){
      e.preventDefault();
      var email = $('#email').val();
      var password = $('#password').val();
      Meteor.loginWithPassword(email, password, function(error) {
        if(error) {
          $.publish('toast', ["That didnt work. Check your email and password", "Login Not Successful!", "error"]);
        } else {
          $.publish('toast', ["You are now logged in", "Login Successful!", "success"]);
        }
      });
      $('#login_modal').closeModal();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });
}

///////////////////////////////////////
// Routing
///////////////////////////////////////
Router.configure({
  layoutTemplate: 'main'
});
Router.route('/', {
  name: 'home',
  template: 'buildings',
  subscriptions: function() {
    this.subscribe('buildings');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Buildings";
  }
});
Router.route('/books', {
  name: 'books',
  onAfterAction: function() {
    document.title = "GNWT PWS - Books";
  }
});
Router.route('/book/:_id', {
  name: 'book_view',
  template: 'book_view',
  data: function(id) {
    return Books.findOne(this.params._id);
  },
  waitOn: function() {
    this.subscribe('book', this.params._id);
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Book";
  }
});
Router.route('/book/add', {
  name: 'book_add',
  template: "book_add",
  onAfterAction: function() {
    document.title = "GNWT PWS - Add a Book";
  }
});
Router.route('/book/update/:_id', {
  name: 'book_edit',
  template: 'book_edit',
  data: function(id) {
    return Books.findOne(this.params._id);
  },
  waitOn: function() {
    this.subscribe('book', this.params._id);
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Edit Book";
  }
});

Router.route('/buildings', {
  name: 'buildings',
  subscriptions: function() {
    this.subscribe('buildings');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Buildings";
  }
});
Router.route('/building/add', {
  name: 'building_add',
  template: 'building_add',
  subscriptions: function() {
    this.subscribe('buildings');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Add a Building";
  }
});
Router.route('/building/update/:_id', {
  name: 'building_edit',
  template: 'building_edit',
  data: function(id) {
    return Buildings.findOne(this.params._id);
  },
  waitOn: function() {
    this.subscribe('building', this.params._id);
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Edit Building";
  }
});
Router.route('/buildings_map', {
  name: 'buildings_map',
  template: 'buildings_map',
  subscriptions: function() {
    this.subscribe('buildings');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Buildings";
  }
});
Router.route('/questions', {
  name: 'questions',
  subscriptions: function() {
    this.subscribe('questions');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Questions";
  }
});
Router.route('/question/add', {
  name: 'question_add',
  template: 'question_add',
  subscriptions: function() {
    this.subscribe('questions');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Add a question";
  }
});
Router.route('/question/update/:_id', {
  name: 'question_edit',
  template: 'question_edit',
  data: function(id) {
    return Questions.findOne(this.params._id);
  },
  waitOn: function() {
    this.subscribe('question', this.params._id);
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Edit Question";
  }
});
Router.route('/users', {
  name: 'users',
  onAfterAction: function() {
    document.title = "GNWT PWS - Users";
  }
});
Router.route('/users/update/:_id', {
  name: 'edit_user',
  template: 'user_edit',
  data: function() {
    var currentUser = this.params._id;
    return Meteor.user.findOne({ _id: currentUser });
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Edit User";
  }
});

var IronRouter_BeforeHooks = {
  is_logged_in: function() {
    if(Meteor.user() === null) {
      $.publish('toast', ["Click the button above to access the features of this application.", "You are not logged in!", "info"]);
      Router.go('/buildings');
      //$.publish('page_changed', [Router.current().route.getName()]);
      // this.next();
    }
    if (!userData.ready()) {
      //this.render('logingInLoading');
      //$.publish('page_changed', [Router.current().route.getName()]);
    }
    this.next();
  }
}
Router.before( IronRouter_BeforeHooks.is_logged_in, {except: ['buildings','buildings_map']});
