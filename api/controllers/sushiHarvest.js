var request = require('request');

exports.testHarvest = function(req, res) {
    console.log(req.params.view)
        return test_get_sushi(req,res)

}
exports.harvest = function(req, res) {
   /* if(req.params.view == "tr_j3")
    {
        return get_tr_j3(req,res)
    }
    if(req.params.view.includes("dr"))
    {
        return get_dr(req,res)
    }*/
    return get_sushi(req,res)
   }; 

function test(req,res){
    request({"url":req.body.url,
    "rejectUnauthorized": false},
function(error, response, body) {
 if (!error && response.statusCode === 200) {            
     var data = JSON.parse(body)
     var result =  data.Report_Items.map(function(record){  
       var obj = {}
       obj["resource_id"] = req.body.resourceId
       obj["report_id"] = req.body.reportId
      record.Performance.map(function(i){
       var obj1 = {};
         obj1["year"] = i.Period.Begin_Date.split("-")[0]
         obj1["month"] = i.Period.Begin_Date.split("-")[1]
         obj1["period_begin"] = i.Period.Begin_Date
         obj1["period_end"] = i.Period.End_Date
          i.Instance
          .filter(function(d){return d.Metric_Type == "Total_Item_Requests"})
          .map(function(d){
            obj1["total"]=d.Count;
           console.log(Object.assign(obj, obj1))
           return Object.assign(obj, obj1)
         })              
     })
     return obj
 })
 //var items = getGroupSum(result,"month","total")
 res.json(result)
}
else {
   res.json(error);
}
})
}

function test_get_sushi(req,res){
    request({"url":req.body.url,
            "rejectUnauthorized": false},
        function(error, response, body) {
          if (!error && response.statusCode === 200) {            
              var dataCount = JSON.parse(body).Report_Items.length
          //var items = getGroupSum(result,"month","total")
          res.json({"Nombre d'items : ":dataCount})
        }
        else {
            res.json(error);
        }
    })
}

function get_sushi(req,res){
    var report_filter;
    switch (req.params.view) {
        case 'tr_j3':
          report_filter = "Total_Item_Requests"
          break;
        case 'tr_b3':
          report_filter = "Total_Item_Requests"
          break;
        case 'pr_p1':
          report_filter = "Searches_Platform"
          break;
      }
  console.log(req.body.url)
    request({"url":req.body.url,
             "rejectUnauthorized": false},
        function(error, response, body) {
          if (!error && response.statusCode === 200) {            
              var data = JSON.parse(body) 
              //console.log(data.Report_Items.map(function(record){ return record.Performance.map(function(i){return i.Period.Begin_Date})}))   
              var result = data.Report_Items.map(function(record){  
                   return record.Performance.map(function(i){
                      var obj = {};
                        obj["month"] = i.Period.Begin_Date.split("-")[1]
                         i.Instance
                         .filter(function(d){return d.Metric_Type == report_filter})
                         .map(function(d){
                          return obj["total"]=d.Count;
                          //console.log(Object.assign(obj, obj1))
                        }) 
                        return obj            
                    })
                    .filter(function(d){if(d.hasOwnProperty("total")){return d}})
                })
                var aggResult = getGroupSum(flatDeep(result),"month","total")
                res.json(aggResult)
        }
        else {
            res.json(error);
        }
    })
}

function object2array(obj){
    var arr = []
    Object.keys(obj).forEach(function(key){
     var value = obj[key];
     arr.push({"dimension":key,"count":value})});
     return arr;
}

function getGroupSum(data,labelField,aggField) {
    var agg = data.reduce(function(memo,item) {
        memo[item[labelField]] = (memo[item[labelField]] || 0) + item[aggField];
        return memo;
    }, {})
    return object2array(agg)
    }
function flatDeep(arr) {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val), []);
 };