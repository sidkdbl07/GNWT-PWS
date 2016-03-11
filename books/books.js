if (Meteor.isClient) {
  Template.books.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.books.onCreated(function() {
    var self = this;
    self.autorun(function() {
      console.log("books 1");
      if( Meteor.status().connected ) {
        Meteor.subscribe("books");
      };
    });
  });

  Template.books.helpers({
    'all_books': function() {
      console.log("books 2");
      var books = Books.find().fetch();
      return books;
    }
  });
}
