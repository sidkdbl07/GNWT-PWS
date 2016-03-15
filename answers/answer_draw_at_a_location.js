if (Meteor.isClient) {
  var map = null, drawnItems;
  var marker_id = null;

  Meteor.subscribe("images");
  Meteor.subscribe("answers");

  let deleteAnswer = function(question_id, inspection_id) {
    let answer = Answers.findOne({'question_id': question_id, 'inspection_id': inspection_id});
    if (answer)
    {
      // Answers.remove(answer._id);
       Meteor.call("deleteAnswer", answer._id);
    }
  };

  let saveAnswer = function(question_id, inspection_id, {value = null, number_value = null, units = null}) {
    let answerObject = {
      'inspection_id': inspection_id,
      'question_id': question_id,
      'sort_order': -1,
      'user_id': Meteor.userId(),
      'date': new Date()
    };
    let question = Questions.findOne({_id: question_id});
    let coordinates = [];
    if(question.type === "Geo-Point") {
      coordinates.push(`[${map._layers[question_id]._latlng.lat}, ${map._layers[question_id]._latlng.lng}]`);
      answerObject.location = {
        'type': "Point",
        'coordinates': coordinates
      };
    }
    else if(question.type === "Geo-Area") {
      for(let latlng of map._layers[question_id]._latlngs) {
        coordinates.push(`[${latlng.lat}, ${latlng.lng}]`);
      }

      answerObject.location = {
        'type': "Polygon",
        'coordinates': coordinates
      };
    }
    else if(question.type === "Multiple Choice") {
      answerObject.value = value;
    }
    else if (question.type === "Year") {
      answerObject.value = value;
    }
    else if (question.type === "Numeric") {
      answerObject.number_value = Number(number_value);
      answerObject.units = units;
    }

    let originalAnswer = Answers.findOne({'question_id': question_id, 'inspection_id': inspection_id});

    if (originalAnswer)
    {
      // Answers.update(originalAnswer._id, {
      //   $set: answerObject
      // });
      Meteor.call("updateAnswer", originalAnswer._id, answerObject);
    }
    else
    {
      // Answers.insert(answerObject);
      Meteor.call("insertAnswer", answerObject);
    }

  };

  let deleteMarker = function(_id) {
    let layers = drawnItems._layers;
    for (let key in layers)
    {
      let val = layers[key];
      if(val._leaflet_id  === _id) {
        drawnItems.removeLayer(val);
        break;
      }
    }
  };

  let handleButtons = function(quesiton_id, hide = true) {
    let question_btn = $("#btn_" + quesiton_id);
    if(hide)
    {
      question_btn.addClass("btn-invisible");
      question_btn.siblings("button").removeClass("btn-invisible");
    }
    else
    {
      question_btn.removeClass("btn-invisible");
      question_btn.siblings("button").addClass("btn-invisible");
    }
  };

  let markersInsert = function(feature) {
    switch(feature.layerType) {
      case 'marker':
        let marker = L.marker(feature.latlng);
        marker._leaflet_id = feature._id;
        marker.addTo(drawnItems);
        break;
      case 'polygon':
        var polygon = L.polygon(feature.latlngs);
        polygon._leaflet_id = feature._id;
        polygon.addTo(drawnItems);
        break;
    }
  };

  Template.answer_draw_at_a_location.helpers({
    'fire_for_answer_draw': function() {
      let currData = Template.currentData();
      Meteor.defer(function() {
        // building = Buildings.findOne({_id: this.building._id}).fetch();
        let building = currData.building;
        let imageUrl, imageBounds;

        if(map)
        {
          map.remove();
        }

        map = L.map('answer-map', {zoomControl: false, minZoom: 14}).setView([building.location.coordinates[1], building.location.coordinates[0]], 15);

        //only display open streetmap for web users
        if(!Meteor.isCordova){
         L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png').addTo(map);
        }

        if (building.picture) {
          imageUrl = Images.findOne({_id: building.picture}).url();
          if(building.bounding_box){
            imageBounds = JSON.parse(building.bounding_box);
            L.imageOverlay(imageUrl, imageBounds).addTo(map);
            //$.publish('toast',['Drawing an ImageOverlay','Image Overlay','info']);
          }
        } else {
          $.publish('toast',['Functionality may be restricted','No Aerial Image!','warning']);
        }

        L.Icon.Default.imagePath = Meteor.absoluteUrl() + 'packages/bevanhunt_leaflet/images';

        drawnItems = L.featureGroup().addTo(map);

        map.addControl(new L.Control.Draw({
          draw: {
            polyline: false,
            circle: false,
            rectangle: false
          },
          edit: {
            featureGroup: drawnItems,
            edit: false,
            remove: true
          }
        }));

        map.on('draw:created', function(event) {
          var layer = event.layer;
          // console.log(event.layer);
          // console.log(event.layerType);
          // console.log(drawnItems);
          var feature = {
            options: event.layer.options,
            layerType: event.layerType,
            _id: marker_id
          };
          switch (event.layerType) {
          case 'marker':
            feature.latlng = event.layer._latlng;
            break;
          case 'polygon':
            feature.latlngs = event.layer._latlngs;
            break;
          }
          // console.log(feature);
          markersInsert(feature);
          handleButtons(feature._id);
        });
      });
    }
  });

  Template.answer_draw_at_a_location.onRendered(function() {

    // this.autorun(function() {
    //   let currData = Template.currentData();

    //   $.publish('page_changed',"buildings");

    //   if (currData.building && currData.group.use_map) {
    //     Meteor.defer(function() {

    //       // building = Buildings.findOne({_id: this.building._id}).fetch();
    //       let building = currData.building;
    //       let imageUrl, imageBounds;

    //       map = L.map('answer-map', {zoomControl: false, minZoom: 14}).setView([building.location.coordinates[1], building.location.coordinates[0]], 15);

    //       //only display open streetmap for web users
    //       if(!Meteor.isCordova){
    //        L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png').addTo(map);
    //       }

    //       if (building.picture) {
    //         imageUrl = Images.findOne({_id: building.picture}).url();
    //         if(building.bounding_box){
    //           imageBounds = JSON.parse(building.bounding_box);
    //           L.imageOverlay(imageUrl, imageBounds).addTo(map);
    //           //$.publish('toast',['Drawing an ImageOverlay','Image Overlay','info']);
    //         }
    //       } else {
    //         $.publish('toast',['Functionality may be restricted','No Aerial Image!','warning']);
    //       }

    //       L.Icon.Default.imagePath = Meteor.absoluteUrl() + 'packages/bevanhunt_leaflet/images';

    //       drawnItems = L.featureGroup().addTo(map);

    //       map.addControl(new L.Control.Draw({
    //         draw: {
    //           polyline: false,
    //           circle: false,
    //           rectangle: false
    //         },
    //         edit: {
    //           featureGroup: drawnItems,
    //           edit: false,
    //           remove: true
    //         }
    //       }));

    //       map.on('draw:created', function(event) {
    //         var layer = event.layer;
    //         // console.log(event.layer);
    //         // console.log(event.layerType);
    //         // console.log(drawnItems);
    //         var feature = {
    //           options: event.layer.options,
    //           layerType: event.layerType,
    //           _id: marker_id
    //         };
    //         switch (event.layerType) {
    //         case 'marker':
    //           feature.latlng = event.layer._latlng;
    //           break;
    //         case 'polygon':
    //           feature.latlngs = event.layer._latlngs;
    //           break;
    //         }
    //         // console.log(feature);
    //         markersInsert(feature);
    //         handleButtons(feature._id);
    //       });
    //     });
    //   }
    // });
  });

  Template.registerHelper("has_decision_point", function(qig_id){
    var n = Decision_Points.find({qig_id: qig_id}).count();
    $.publish('toast',[n,"Decision Points",'info']);
    if(n > 0) {
      return true;
    }
    return false;
  });

  Template.answer_draw_at_a_location.helpers({
    'questions_in_group': function() {
      return Question_In_Group.find({group_id: this.group._id},{sort: {sort_order: 1}}).fetch();
    }
  });

  Template.answer_draw_at_a_location.events({
    'click #btn_zoomin': function() {
      map.zoomIn();
    },
    'click #btn_zoomout': function() {
      map.zoomOut();
    },
    'click .btn-geo-point': function(event) {
      event.stopImmediatePropagation();
      console.log('geo point button clicked');
      marker_id = event.target.id.substr(4);
      $(".leaflet-draw-draw-marker")[0].click();
    },
    'click .btn-geo-area': function(event) {
      event.stopImmediatePropagation();
      console.log('geo area button clicked');
      marker_id = event.target.id.substr(4);
      $(".leaflet-draw-draw-polygon")[0].click();
    },
    'click .btn-delete': function(event) {
      let question_id = $(event.target).siblings(".btn-geo")[0].id.substr(4);
      deleteAnswer(question_id, Template.instance().parent().data.inspection_id);
      deleteMarker(question_id);
      handleButtons(question_id, hide=false);
    },
    'click .btn-save': function(event) {
      let question_id = $(event.target).siblings(".btn-geo")[0].id.substr(4);
      saveAnswer(question_id, Template.instance().parent().data.inspection_id);
      $(event.target).addClass("btn-invisible");
    },
    'change .multiple_choice_answer': function(event) {
      let question_id = $(event.target)[0].id.substr(4);
      let newVal = $(event.target).val();
      if(newVal === "")
      {
        deleteAnswer(question_id, Template.instance().parent().data.inspection_id);
      }
      else {
        saveAnswer(question_id, Template.instance().parent().data.inspection_id, {value: newVal});
      }      
    }, 
    'change .year_answer': function(event) {
      let question_id = $(event.target)[0].id.substr(4);
      let newVal = $(event.target).val();
      if(newVal === "")
      {
        deleteAnswer(question_id, Template.instance().parent().data.inspection_id);
      }
      else {
        saveAnswer(question_id, Template.instance().parent().data.inspection_id, {value: newVal});
      } 
    },
    'blur .numeric_answer_value': function(event) {
      console.log("blur");
      let question_id = $(event.target)[0].id.substr(8);
      let newVal = $(event.target).val();
      if(newVal === "")
      {
        deleteAnswer(question_id, Template.instance().parent().data.inspection_id);
      }
      else {
        saveAnswer(question_id, Template.instance().parent().data.inspection_id, {number_value: newVal, units: $(event.target).closest(".row").find("select.numeric_answer_unit").val()});
      } 
    },
    'change .numeric_answer_unit': function(event) {
      let question_id = $(event.target)[0].id.substr(6);
      let newVal = $(event.target).val();
      let value = $(event.target).closest(".row").find(".numeric_answer_value").val();
      if(value === "")
      {
        deleteAnswer(question_id, Template.instance().parent().data.inspection_id);
      }
      else {
        saveAnswer(question_id, Template.instance().parent().data.inspection_id, {number_value: value, units: newVal});
      } 
    }
  });


  Template.question_to_answer.onRendered(function() {
    $('select').material_select();
    $('.modal-trigger').leanModal();
    $('.tooltipped').tooltip({delay: 50});
  });

  Template.question_to_answer.events({
    "click .help": function(event, template){
       event.preventDefault();
       $("#help_text_content_"+this._id).html( this.help_text );
       $("#help_text_"+this._id).toggle();
    },
    "click .comment": function(event, template){
       event.preventDefault();
       $("#comment_"+this._id).toggle();
    }
  });

  Template.question_to_answer.helpers({
    'has_answer': function(question_id) {
      let answer = Answers.findOne({'question_id': question_id, 'inspection_id': Template.instance().parent().data.inspection_id});
      if (answer)
      {
        if (answer.location)
        {
          // $("#btn_" + answer.question_id).addClass("btn-invisible").siblings(".btn-delete").removeClass("btn-invisible");
          let feature = {
            _id: answer.question_id
          };
          if (answer.location.type === "Point") {
            feature.layerType = 'marker';
            console.log("marker position is ", answer.location.coordinates[0]);
            feature.latlng = JSON.parse(answer.location.coordinates[0]);
          }
          else {
            feature.layerType = 'polygon';
            feature.latlngs = [];
            for(let coordinate of answer.location.coordinates)
            {
              feature.latlngs.push(JSON.parse(coordinate));
            }
          }
          markersInsert(feature);
        }
        return true;
      }
      return false;
    },
    'has_help_text': function(question_id){
      var question = Questions.findOne({_id: question_id});
      if(question.help_text && question.help_text !== "") {
        return true;
      }
      return false;
    },
    'is_geo_point': function(question_id) {
      var question = Questions.findOne({_id: question_id});
      if(question.type === "Geo-Point") {
        return true;
      }
      return false;
    },
    'is_geo_area': function(question_id) {
      var question = Questions.findOne({_id: question_id});
      if(question.type === "Geo-Area") {
        return true;
      }
      return false;
    },
    'matched': function(answer_value = null, column) {
      var answer = Answers.findOne({question_id: Template.parentData()._id, inspection_id: Template.instance().parent().data.inspection_id});
      if (!answer)
        return false;
      // return answer.value === answer_value;
      if(answer[column] == answer_value) {
        return true;
      }
      else {
        return false;  
      }
      
    },
    'number_value': function(question_id) {
      var answer = Answers.findOne({question_id: question_id, inspection_id: Template.instance().parent().data.inspection_id});
      if (!answer)
        return "";
      else 
        return answer.number_value;
    },
    'is_multiple_choice': function(question_id) {
      var question = Questions.findOne({_id: question_id});
      if(question.type === "Multiple Choice") {
        return true;
      }
      return false;
    },
    'is_numeric': function(question_id) {
      var question = Questions.findOne({_id: question_id});
      if(question.type === "Numeric") {
        return true;
      }
      return false;
    },
    'is_year': function(question_id) {
      var question = Questions.findOne({_id: question_id});
      if(question.type === "Year") {
        return true;
      }
      return false;
    },
    'question': function(question_id) {
      //$.publish('toast',[question_id,"Getting Question", 'info']);
      return Questions.findOne({_id: question_id});
    },
    'years_for_year_question': function(question_id) {
      //$.publish('toast',["asking for years","Years",'info']);
      var question = Questions.findOne({_id: question_id});
      var this_year = parseInt(moment().format("YYYY"));
      return _.map(_.range(question.min, this_year), function(i) {
        return {'year': i};
      });
    }
  });
}

Meteor.methods({
  insertAnswer: function (answerObject) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Answers.insert(answerObject);
    // $.publish('toast',['New Answer inserted','Answer Added!','info']);
  },
  deleteAnswer: function (id) {
    Answers.remove(id);
    // $.publish('toast',['Corresponding Answer removed','Answer Deleted!','info']);
  },
  updateAnswer: function (id, answerObject) {
    Answers.update(id, { $set: answerObject });
    // $.publish('toast',['Corresponding Answer modified','Answer Updated!','info']);
  }
});
