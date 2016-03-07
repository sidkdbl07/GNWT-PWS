if (Meteor.isClient) {
  Template.book_view.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.book_view.helpers({
    'book': function() {
      return Books.findOne({_id: this.book_id}).fetch();
    },
    'groups': function() {
      return Question_Groups.find({page_id: this._id},{sort: {'sort_order': 1}}).fetch();
    }
  });
}
