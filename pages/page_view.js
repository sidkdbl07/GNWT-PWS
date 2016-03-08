if (Meteor.isClient) {
  Template.page_view.onRendered(function() {
    $.publish('page_changed',"books");
    $('ul.tabs').tabs();
  });

  Template.page_view.helpers({
    'book': function() {
      //console.log(this.book_id);
      return Books.findOne({_id: this.book_id}).fetch();
    },
    'groups': function() {
      return Question_Groups.find({page_id: this._id},{sort: {'sort_order': 1}}).fetch();
    }
  });
}
