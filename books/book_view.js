if (Meteor.isClient) {
  Template.book_view.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.book_view.helpers({
    
  });
}
