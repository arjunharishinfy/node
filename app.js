const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fetch = require('node-fetch');
const xl = require('excel4node');

const app = express()

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.post('/export-excel', function(rq, rs) {
  //console.log(request.body);
  rs.writeHead(200, {'Content-Type': 'application/json'});
  // Do perform validation before implementation
  const request = rq.body;
  if(request.products)
  {
    exportExcel({...request});
  }
  rs.end();
})

const exportExcel = ({fileName, products}) => {

  products.map(async(pD, pI ) => {
    const index = pI+2;

    const bufferData = await fetch(pD.imgUrl).then(res => res.buffer());
    await fs.writeFile(`./pdp_image_`+index+`.jpeg`, bufferData,() => { });

  });
  setTimeout(() => {
      
    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1',{
      sheetFormat: {
        defaultRowHeight: 80
      }
    });

    // Create a reusable style
    var style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    // Set value of cell A1 to 100 as a number type styled with paramaters of style
    ws.cell(1, 1)
      .string('Product')
      .style(style);

    // Set value of cell B1 to 200 as a number type styled with paramaters of style
    ws.cell(1, 2)
      .string('Price')
      .style(style);

    // Set value of cell C1 to a formula styled with paramaters of style
    ws.cell(1, 3)
      .string('Image')
      .style(style);

    products.map(async(pD, pI ) => {
      const index = pI+2;
      
      ws.cell(index, 1)
        .string(pD.name);

      ws.cell(index, 2)
        .number(pD.price);
        
      ws.addImage({
        path: `./pdp_image_`+index+`.jpeg`,
        type: 'picture',
        position: {
          type: 'oneCellAnchor',
          from: {
            col: 3,
            colOff: '0.05in',
            row: index,
            rowOff: 0,
          },
        },
      });
    });

    wb.write(fileName+'.xlsx');
  }, 500);

}

const port = 3000;
app.listen(port)
console.log(`Listening at http://localhost:${port}`)
