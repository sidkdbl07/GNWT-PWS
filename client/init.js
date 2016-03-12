Meteor.startup(function () {
	if (Meteor.isCordova) {
		Meteor.subscribe("buildings");
		Meteor.subscribe("books");
		Meteor.subscribe("images");
		Meteor.subscribe("inspections");
		Meteor.subscribe("pages");
		Meteor.subscribe("questions");
		Meteor.subscribe("question_groups");
		Meteor.subscribe("question_in_groups");
		Meteor.subscribe("users");
	}
});