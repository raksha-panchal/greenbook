var model=require('./model')
const Excel = require('exceljs');

//  convert json data to excel file
function getdata(req,res){
  model.find({}).then((result)=>{
     const options = {
        filename: 'myfile.xlsx',
        useStyles: true,
        useSharedStrings: true
        };

const workbook = new Excel.stream.xlsx.WorkbookWriter(options);

const worksheet = workbook.addWorksheet('my sheet');

 worksheet.columns = [
    { header: 'name', key: 'name' },
    { header: 'phonenumber', key: 'phoneNumber' },
    { header: 'emailId', key: 'emailId' },
    { header:'urls',key:'urls'},
    { header:'fax',key:'fax'},
    { header:'address',key:'address'},
    { header:'socialLink',key:'socialLink'},

 ]

var data;
 result.map((data)=>{
    worksheet.addRow(data).commit();

 })

workbook.commit().then(function() {
  console.log('excel file cretaed');
});
  
   }).catch((err)=>{
      console.log(err)
  })
}

module.exports={
    getdata
}