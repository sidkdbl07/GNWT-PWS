if (Meteor.isClient) {
  Template.book_view.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.book_view.helpers({
    'pages': function() {
      return Pages.find({book_id: this._id},{sort: {'sort_order': 1}}).fetch();
    }
  });
}
