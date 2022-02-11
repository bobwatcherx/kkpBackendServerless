
import { api, data, schedule, params } from "@serverless/cloud";
import cors from 'cors';
import fetch from 'node-fetch'
import midtransClient from 'midtrans-client';
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer';
import path from 'path'

const supabaseUrl = "https://kjdfchehyjheuutobjdb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjczMDA0OCwiZXhwIjoxOTMyMzA2MDQ4fQ.9A3uBTWE5yztfnyrVdvQb1WM_IuvIimbmM3SU3PcNZM"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

api.post("/mail",(req,res)=>{

   var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'bobwatcherx@gmail.com',
    pass: 'amigos2010'
  }
});
transporter.use('compile', hbs(handlebarOptions))
var mailOptions = {
  from: 'somerealemail@gmail.com',
  to: 'bobwatcherx@gmail.com',
  text:"123"
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    res.send(error)
  } else {
    res.send(info.response)
    console.log('Email sent: ' + info.response);
  }
});  
})
api.use(cors())
api.post("/suc",async(req,res)=>{
  const {data,error} = await supabase.from("tblpesanan")
  .update({pay_status:true},{trans_time:req.body.transaction_time})
  .match({order_id:req.body.order_id})
  if(error){
    console.log(error)
  }
  console.log(req.body)
  res.status(200)
  res.send(req.body)
})
api.post("/rec",(req,res)=>{
  res.status(200)
  console.log(req.body)
  res.send(req.body)
})
api.post("/pay",(req,res)=>{
  res.status(200)
  console.log(req.body)
  res.send(req.body)
})
api.post("/api",(req,res)=>{
let Cuid = Math.random().toString(12).substr(2,9);
// setTimeout(()=>{
//   Cuid = Math.random().toString(12).substr(2,9);
// },1000)
  let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : 'SB-Mid-server-HniBRuOEFO-DQnpdsqm_W2DA'
    });
 let parameter = {
    "transaction_details": {
        "order_id": Cuid,
        "gross_amount": req.body.totalharga
    },
    "credit_card":{
        "secure" : true
    },
    "customer_details": {
        "first_name": req.body.nama_pengirim,
        "alamat":req.body.alamat ,
        "email": req.body.email,
        "phone": req.body.phone
    }
};
    snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction token
        let transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);
  console.log(req.body)
  res.send({
    "id":Cuid,
    "token":transactionToken,
    "c_details":{
"first_name": req.body.nama_pengirim,
        "alamat":req.body.alamat ,
        "email": req.body.email,
        "phone": req.body.phone
    }
  })
    })
})




schedule.every("60 minutes", async () => {
  console.log(`Checking for overdue TODOs...`);

  // Look for items that are overdue
  let overdueItems = await data.getByLabel(
    "label1",
    `incomplete:<${new Date().toISOString()}`
  );

  if (overdueItems.items.length === 0) {
    console.log(`Nothing overdue!`);
  }

  // Loop through the overdue items
  for (let item of overdueItems.items) {
    // Here we could send an alert
    console.log(`ALERT: '${item.value.name}' is overdue!!!`);
  }
});

