if (Meteor.isClient) {
  Template.books.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.books.onCreated(function() {
    var self = this;
    self.autorun(function() {
      if( Meteor.status().connected ) {
        Meteor.subscribe("books");
      };
    });
  });

  Template.books.helpers({
    'all_books': function() {
      var books = Books.find().fetch();
      return books;
    }
  });
}
