if (Meteor.isClient) {
  Template.books.onRendered(function() {
    $.publish('page_changed',"books");
  });
}
