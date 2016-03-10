if (Meteor.isClient) {
  Template.group_view.onRendered(function() {
    $.publish('page_changed',"books");
    $('ul.tabs').tabs();
  });

  Template.group_view.helpers({
    'book': function() {
      //console.log(this.book_id);
      var page = Pages.findOne({_id: this.page_id});
      return Books.findOne({_id: page.book_id});
    },
    'page': function() {
      //console.log(this.book_id);
      return Pages.findOne({_id: this.page_id});
    }
  });
}
