var rs = require('request-promise');
var cheerio = require('cheerio');
var express = require('express');
var config = require('./config');
var bodyParser=require('body-parser')
var mongoose=require('mongoose')
var model=require('./model')
mongoose.connect(config.URL)
var app = express();
app.use(bodyParser.json())
let async = require('async')
let getAllNames =[]
let counter = new Array(8).fill("");
let counters = 0; 

async.forEachSeries(counter,function(value,callback){
    var option = {
        url: `https://www.greenbook.org/market-research-firms/international?page=${counters}&rd=L`,
        transform: function (body) {
            return cheerio.load(body).html();
        }
    }
    rs(option).then((m) => {
       let $ = cheerio.load(m);
        $('.search-results').find('.article-lrg').each(function(i,el){
                 getAllNames.push($(this).find('a').attr('href'))
               
        })
        callback();
        counters++;
    })
}, function(){
    
 var result=  getAllNames.map((cname)=>{
       var option1 = {
          url: `https://www.greenbook.org${cname}`,
            transform: function (body) {
                return cheerio.load(body).html();
            }
        }
       rs(option1).then((m) => {
           let $ = cheerio.load(m);
             let name=$('.box-title').find('h2[itemprop="name"]').text().trim();
             let phoneNumber=[];
             let phoneNumber1=[];
             let socialLink=[];
             let emailId=[];
             let fax=[];
             let fax1=[];
             $('.span2').find('dd[itemprop="telephone"]').each(function(){
                   phoneNumber1.push($(this).text().trim())
                    var x=phoneNumber1.filter((name)=>{
                        if(name != "" ){
                            if(phoneNumber.indexOf(name)== -1){
                                phoneNumber.push(name)
                            }else{
                              return
                            }
                         
                        }
                    })
                 })
             
              $('.span2').find('dd[itemprop="faxNumber"]').each(function(){
                fax1.push($(this).text().trim())
                 var y=fax1.filter((name)=>{
                    if(name != ""){
                        if(fax.indexOf(name)== -1){
                            fax.push(name)
                        }else{
                            return
                        }
                      
                    }
                })
                 
              })
              $('.box-content').find('a[itemprop="email"]').each(function(m){
                  emailId.push($(this).text())
         
             })
              let urls = $('dl').find('a[itemprop="url"]').attr('href');
             let address= $('dd').find('span').text()
              $('.social-links').find('a').each(function(i,el){
                    socialLink.push($(this).attr('href')) 
                })
            var a={
            name,phoneNumber,fax,urls,address,socialLink,emailId
          }
          var user=new model(a)
          user.save((err,data1)=>{
           if(err){
               console.log(err)
           }else{
             console.log(data1);
           }
       })
    
     })
    })
  
 
})


app.listen(config.port, () => {
    console.log("server up")
})