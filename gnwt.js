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
Router.route('/book/add', {
  name: 'book_add',
  template: "book_add",
  onAfterAction: function() {
    document.title = "GNWT PWS - Add a Book";
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
    this.subscribe('pages');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Book";
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
Router.route('/building/:_id', {
  name: 'building_view',
  template: 'building_view',
  data: function(_id) {
    var building = Buildings.findOne(this.params._id);
    building.picture = Images.findOne({_id: building.picture});
    return building;
  },
  waitOn: function() {
    this.subscribe('building', this.params._id);
    this.subscribe('images');
    this.subscribe('users');
    this.subscribe('books');
    this.subscribe('inspections');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Building";
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
  waitOn: function() {
    this.subscribe('buildings');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Buildings";
  }
});
Router.route('/building/inspection/add/:building_id', {
  name: 'inspection_add',
  template: 'inspection_add',
  data: function(id) {
    return Buildings.findOne(this.params.building_id);
  },
  waitOn: function() {
    this.subscribe('books');
    this.subscribe('building', this.params.building_id);
    this.subscribe('inspections');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Add Inspection";
  }
});
Router.route('/group/:_id', {
  name: 'group_view',
  template: 'group_view',
  data: function(_id) {
    return Question_Groups.findOne(this.params._id);
  },
  waitOn: function() {
    this.subscribe('pages');
    this.subscribe('question_group', this.params._id);
    this.subscribe('question_in_groups');
    this.subscribe('questions');
    this.subscribe('books');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Question Group";
  }
});
Router.route('/group/add/:page_id', {
  name: 'group_add',
  template: 'group_add',
  data: function(page_id) {
    let newestGroups = Question_Groups.findOne({}, { sort: {sort_order:-1}});
    return {
      'page': Pages.findOne(this.params.page_id),
      'sort_order': (newestGroups ? newestGroups.sort_order + 1 : 0)
    };
  },
  waitOn: function() {
    this.subscribe('pages');
    this.subscribe('question_groups');
    this.subscribe('books');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Add Question Goup";
  }
});
Router.route('/group/update/:_id', {
  name: 'group_edit',
  template: 'group_edit',
  data: function(_id) {
    return Question_Groups.findOne(this.params._id)
  },
  waitOn: function() {
    this.subscribe('question_group', this.params._id);
    this.subscribe('pages');
    this.subscribe('books');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Edit Question Goup";
  }
});
Router.route('/group/question/add/:group_id', {
  name: 'add_question_to_group',
  template: 'add_question_to_group',
  data: function() {
    let newestQuestionInGroup = Question_In_Group.findOne({}, { sort: {sort_order:-1}});
    return {
      'group': Question_Groups.findOne(this.params.group_id),
      'sort_order': (newestQuestionInGroup ? newestQuestionInGroup.sort_order + 1 : 0)
    };
  },
  waitOn: function() {
    this.subscribe('pages');
    this.subscribe('questions');
    this.subscribe('question_groups');
    this.subscribe('question_in_group');
    this.subscribe('books');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Add Question to Goup";
  }
});
Router.route('/group/question/:_id', {
  name: 'question_in_group_view',
  template: 'question_in_group_view',
  data: function() {
    return Question_In_Group.findOne(this.params._id);
  },
  waitOn: function() {
    this.subscribe('pages');
    this.subscribe('questions');
    this.subscribe('question_groups');
    this.subscribe('question_in_group', this.params._id);
    this.subscribe('books');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Question to Goup";
  }
});
Router.route('/inspection/:_id', {
  name: 'inspection_view',
  template: 'inspection_view',
  data: function() {
    return Inspections.findOne(this.params._id)
  },
  waitOn: function() {
    this.subscribe('books');
    this.subscribe('buildings');
    this.subscribe('inspection', this.params._id);
    this.subscribe('pages');
    this.subscribe('question_groups');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Inpsection";
  }
});
Router.route('/inspection/go/:inspection_id/:group_id', {
  name: 'inspection_go',
  template: 'inspection_go',
  data: function() {
    var inspection = Inspections.findOne({_id: this.params.inspection_id});
    var group = Question_Groups.findOne({_id: this.params.group_id});
    // var images = Images.find({}).fetch();
    // console.log("Images in data: ", images);
    return {
      'inspection': inspection,
      'group': group
    };
  },
  waitOn: function() {
    this.subscribe('books');
    this.subscribe('buildings');
    this.subscribe('inspection', this.params.inspection_id);
    this.subscribe('pages');
    this.subscribe('question_groups');
    this.subscribe('question_in_groups');
    // this.subscribe('images');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Inpsection";
  }
});
Router.route('/page/:_id', {
  name: 'page_view',
  template: 'page_view',
  data: function() {
    return Pages.findOne(this.params._id)
  },
  waitOn: function() {
    this.subscribe('page', this.params._id);
    this.subscribe('question_groups');
    this.subscribe('books');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Page";
  }
});
Router.route('/page/add/:book_id', {
  name: 'page_add',
  template: 'page_add',
  data: function(book_id) {
    let newestPage = Pages.findOne({}, { sort: {sort_order:-1}});
    return {
      'book': Books.findOne(this.params.book_id),
      'sort_order': (newestPage ? newestPage.sort_order + 1 : 0)
    };
  },
  waitOn: function() {
    this.subscribe('book', this.params.book_id);
    this.subscribe('pages');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Add a Page";
  }
});
Router.route('/page/update/:_id', {
  name: 'page_edit',
  template: 'page_edit',
  data: function(_id) {
    return Pages.findOne(this.params._id)
  },
  waitOn: function() {
    this.subscribe('page', this.params._id);
    this.subscribe('books');
  },
  onAfterAction: function() {
    document.title = "GNWT PWS - Edit Page";
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