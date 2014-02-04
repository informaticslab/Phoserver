var db = require('../config/dbschema');
 
exports.findById = function(req, res) {
    //console.log('inside route');
    var id = req.params.id;
    //var id = req.query.id;
    console.log('Retrieving article: ' + id);
    db.articleModel.findById(id, function (err, article) {
        console.log('article was ' + article);
    if(err || !article)
    {
        res.send(err);        
    }
    res.send(article);
  });
    
};
 
exports.findAll = function(req, res) {
   db.articleModel.find('articles', function(err, collection) {
            if(err || !collection)
            {
                res.send(err);
            }
            res.send(collection);
        });
    
};
 
exports.addArticle= function(req, res) {
    //console.log("adding article");
    var articleblurb = req.body;
    var article = new db.articleModel(articleblurb);
    console.log('Saving article ');
    // save call is async, put grunt into async mode to work

    article.save(function(err, result) {
      if(err) {
        res.send('Error: ' + err);       
      } else {
        console.log('Success: ' + result[0]);
        res.send(result[0]);
      }
    });
};

exports.updateArticle = function(req, res) {
    var id = req.params.id;
    var articleblob = req.body;
    console.log('Updating article: ' + id);
    //console.log(JSON.stringify(articleblob));
    db.articleModel.update(id, articleblob, function (err, article) {
        //console.log('article was ' + article);
    if(err || !article)
    {
        res.send(err);        
    }
    res.send(article);
  });
};
 
exports.deleteArticle = function(req, res) {
    var id = req.params.id;
    console.log('Deleting article: ' + id);
        db.articleModel.findById(id, function (err, article) {
        console.log('article was ' + article);
        if(err || !article)
        {
            res.send({'error':'An error has occurred - ' + err});        
        }
        
        article.remove();
        console.log(' document(s) deleted');
        res.send(req.body);
  });
};
// 
///*--------------------------------------------------------------------------------------------------------------------*/
//// Populate database with sample data -- Only used once: the first time the application is started.
//// You'd typically not find this code in a real-life app, since the database would already exist.
//var populateDB = function() {
// 
//    var articles = [
//   {title:"2013-11-29 / Vol. 62 / No. 47",
//    articles:
//    [{
//       title:"Differences Between HIV-Infected Men and Women in Antiretroviral Therapy Outcomes — Six African Countries, 2004–2012",
//        already_known:"Evaluating differences between human immunodeficiency virus (HIV)-infected men and women in antiretroviral therapy (ART) enrollment characteristics and treatment outcomes can help program managers understand why proportionally more women than men are accessing ART.",
//        added_by_report:"This retrospective cohort study of six African countries found lower median CD4 counts and more World Health Organization stage IV HIV disease in men at enrollment in all six countries. In addition, the risk of attrition during ART was significantly higher in men in western and southern African countries, even after controlling for possible baseline predictors of ART outcomes. This finding suggests that unidentified factors are contributing to this higher attrition risk in these countries. In eastern Africa, risk for attrition did not differ significantly between men and women. ",
//        implications:"Further research on country-specific reasons for differences between HIV-infected men and women in ART enrollment and in attrition while on ART are needed. The results of such studies could potentially identify strategies to improve early diagnosis and treatment among men and improve program outcomes.",
//        tags:[{tag:"HIV-Infected Women"},{tag:"HIV-Infected Men"},{tag:"Antiretroviral Therapy"}],
//        url:"http://www.cdc.gov/mmwr/preview/mmwrhtml/mm6247a2.htm?s_cid=mm6247a2_w"}
//    ]},
//    {title:"2013-11-29 / Vol. 62 / No. 47",articles:[{title:"Voluntary Medical Male Circumcision — Southern and Eastern Africa, 2010–2012",already_known:"Voluntary medical male circumcision (VMMC) has been recognized by the World Health Organization and Joint United Nations Programme on HIV/AIDS as an effective human immunodeficiency virus (HIV) prevention intervention in settings with a generalized HIV epidemic and low male circumcision prevalence.",added_by_report:"This report summarizes progress toward the 2011 World AIDS Day VMMC target of 4.7 million circumcisions by 2013. During 2010–2012, VMMC progress has been increasing in nine countries where CDC supports VMMC service delivery, with 137,096 VMMCs in 2010, 347,724 in 2011, and 535,604 in 2012.",implications:"Accelerated VMMC scale-up can be achieved in southern and eastern Africa while maintaining high acceptance of HIV testing and counseling and low rates of adverse events.",
//                                                      tags:[{tag:"Male Circumcision"},{tag:"Voluntary"}],
//                                                      url:"http://www.cdc.gov/mmwr/preview/mmwrhtml/mm6247a3.htm?s_cid=mm6247a3_w"}
//                                                    
//]}
//    ];
// 
//    db.collection('articles', function(err, collection) {
//        collection.insert(articles, function(err, result) {});
//    });
// 
//};