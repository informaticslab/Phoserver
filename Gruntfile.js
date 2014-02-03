var db = require('./config/dbschema');

module.exports = function(grunt) {

  grunt.registerTask('dbseed', 'seed the database', function() {
    grunt.task.run('adduser:admin:admin@example.com:secret:true:05/27/81');
    grunt.task.run('adduser:bob:bob@example.com:secret:false:05/27/82');
  });
  
  grunt.registerTask('articleseed', 'seed the database with articles', function(){
      grunt.tast.run('addarticle');
  });

  grunt.registerTask('adduser', 'add a user to the database', function(usr, emailaddress, pass, adm, apitoken) {
    // convert adm string to bool
    adm = (adm === "true");

    var user = new db.userModel({ username: usr
    				, email: emailaddress
    				, password: pass
    				, admin: adm
                                , APItoken: apitoken});
    
    // save call is async, put grunt into async mode to work
    var done = this.async();

    user.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
        done(false);
      } else {
        console.log('saved user: ' + user.username);
        done();
      }
    });
  });

grunt.registerTask('addarticle', 'add an article to the database', function() {
    // convert adm string to bool
    //adm = (adm === "true");
    var article = new db.articleModel({
           "issue-date":"2014-01-31"
            ,"issue-vol":"63"
            ,"issue-no":"04"
            ,"title":"Rapidly Building Global Health Security Capacity — Uganda Demonstration Project, 2013"
            ,"already_known":"Security against epidemic disease threats for all countries is dependent on their capacity to prevent, detect, and respond to outbreaks as early and effectively as possible. However, 80% of International Health Regulations signatories have not met their 2012 objectives, including Uganda. CDC has committed to assist countries with national surveillance and response activities to prevent, detect, and respond to public health threats. "
            ,"added_by_report":"This report describes rapid global health security enhancements in Uganda targeting three areas: laboratory systems, information systems, and coordination of information through emergency operations centers. These enhancements resulted in substantial improvements in the ability of Uganda's public health system to detect and respond to health threats in 6 months."
            ,"implications":"This report provides a potential model for U.S. government collaborative efforts in building international global health security capacity in other countries."
            ,"tags":[{"tag":"Government"},{"tag":"collaborative"},{"tag":"effort"}]
            ,"url":"http://www.cdc.gov/mmwr/preview/mmwrhtml/mm6304a2.htm?s_cid=mm6304a2_w"
            ,"content-ver":"1"
            ,"schema-ver":"1"}
    
    );
    console.log('saving article ');
    // save call is async, put grunt into async mode to work
    var done = this.async();

    article.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
        done(false);
      } else {
        console.log('saved article: ' + article.title);
        done();
      }
    });
  });

  grunt.registerTask('dbdrop', 'drop the database', function() {
    // async mode
    var done = this.async();

    db.mongoose.connection.on('open', function () { 
      db.mongoose.connection.db.dropDatabase(function(err) {
        if(err) {
          console.log('Error: ' + err);
          done(false);
        } else {
          console.log('Successfully dropped db');
          done();
        }
      });
    });
  });

};
