Album = new Mongo.Collection("album");


if (Meteor.isClient) {
  // counter starts at 0

      Template.body.helpers({
        fotos: function(){
          return Album.find({});
          console.log(Album.find({}));
        },
        test:function () {
            return Meteor.user().services.instagram.accessToken;
        },
        id:function () {
          return Meteor.user().services.instagram.id;
        }
      });

      Template.body.events({
          'submit .new-pic': function(event){
              event.preventDefault();
              var url = event.target.url.value;
              var title = event.target.title.value;

              Album.insert({
                  createAt: new Date(),
                  url: url,
                  title: title,
                  photo_url: url
              });

              event.target.url.value = "";
              event.target.title.value = "";
          },
      });


    Template.instafeed.events({

        'keypress .style-5':function(event,template){
            if(event.keyCode === 13){

                Session.set('tagValue',template.$('.style-5').val()); //Setting value to be used on Instafeed constructor.

                $("html, body").animate({ scrollTop: $(document).height() }, "slow"); //Simulate Scroll Down

                template.$('.style-5').val('') // Clean the input

            }
        }
    });

    Session.set('accessToken',Meteor.user().services.instagram.accessToken);
    Session.set('clientId',3733380);

    //Meteor.call("getAccessToken", function(error, accessToken){
    //    console.log(accessToken);
    //    Session.set('accessToken',accessToken);
    //});
    //
    //Meteor.call("getClientId", function(error, clientId){
    //    console.log(clientId);
    //    Session.set('clientId',clientId);
    //});

    console.log(Session.get('clientId'));
    console.log(Session.get('accessToken'));

    //Computation

    Tracker.autorun(function(){

        feed = new Instafeed({
            //get: 'tagged',
            //tagName: Session.get('tagValue'), //here is where we use the session setted on the event
            //clientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx', //your's clientId
            //template: '<div class="instagramContainer"><img src="{{image}}" class="instagramImage" /></br><span class="glyphicon glyphicon-heart">{{likes}}</span> <span class="glyphicon glyphicon-comment">{{comments}}</span><p class="caption">{{caption}}</p></div>',

            get: 'user',
            userId: Session.get('clientId'),
            accessToken: Session.get('accessToken'),
            resolution: "standard_resolution",
            limit: 24,
            useHttp: true,
            sortBy: 'random',
            //template: '<li class="instagramContainer"><img src="{{image}}" class="instagramImage" /></br><span class="glyphicon glyphicon-heart">{{likes}}</span> <span class="glyphicon glyphicon-comment">{{comments}}</span><p class="caption">{{caption}}</p></div>',
            template: '<li class="col-xs-4 col-sm-3 instagramContainer"><a href="{{link}}" title="{{caption}}"><img class="img50" alt="{{caption}}" src="{{image}}"></a></li>'
        });

        feed.run(); //run the new Instafeed({})
    });

    Meteor.loginWithInstagram(function (err, res) {
        if (err !== undefined)
            console.log('sucess ' + res)
        else
            console.log('login failed ' + err)
    });

    console.log();

}

if (Meteor.isServer) {
      Meteor.startup(function () {
        // code to run on server at startup
      });

    ServiceConfiguration.configurations.remove({
        service: "instagram"
    });
    ServiceConfiguration.configurations.insert({
        service: "instagram",
        clientId: "83430318c59a47bfa0f4b26de58d40fb",
        scope:'basic',
        secret: "c0577b2cf3454eada1132883e8699056"
    });

    //Meteor.methods({
    //    getAccessToken : function() {
    //        try {
    //            //Session.set('accessToken', Meteor.user().services.instagram.accessToken);
    //            return Meteor.user().services.instagram.accessToken;
    //        } catch(e) {
    //            return null;
    //        }
    //    }
    //});
    //
    //Meteor.methods({
    //    getClientId : function() {
    //        try {
    //            //Session.set('clientId', Meteor.user().services.instagram.clientId);
    //            return Meteor.user().services.instagram.id;
    //        } catch(e) {
    //            return null;
    //        }
    //    }
    //});
}


//var userFeed = new Instafeed({
//    get: 'user',
//    userId: 3733380,
//    accessToken: '3733380.cf0499d.edbd0e81c60246379393c506013e09f8',
//    resolution: "standard_resolution",
//    limit: 12,
//    sortBy: "random"
//});
//userFeed.run();