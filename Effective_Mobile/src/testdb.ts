import { Repository } from "typeorm";
import { PostgresDataSource } from "./PostgresDataSource";
import { Requests } from "./observation.entity";
import express from "express";

const repository = Repository

const app = express();

const PORT = 3000;

var ithem1;
var date_end;
var date_start: string;
app.use(express.json());  // Готов принять JSON

(async () => {

 await PostgresDataSource.initialize()
  .then(async connection => {
     //console.log("Data Source has been initialized successfully.");
        
        app.get("/", function(req, res) {
          console.log("Something was catched!" + req.method, __dirname);
          res.sendFile('/index.html', {root: __dirname });
        });

            //Создать обращение
        app.post('/create-request', async (req, res) => {
              // Теперь в req.body – данные от клиента
              const req_body = req.body;
              // console.log(req.body);
              const sampleItem = new Requests();
              sampleItem.request = req_body.request;
              sampleItem.status = req_body.status;
              sampleItem.theme = req_body.theme;
              sampleItem.reason_for_cancellation = "";
              sampleItem.reply = "";
              await connection.manager.save(sampleItem);
              res.setHeader('Content-Type', 'application/json').json(sampleItem)
        });

            //Список всех обращений
        app.get('/list-of-requests', async (req, res) => {
            ithem1 = await connection
              .getRepository(Requests)
              .createQueryBuilder("requests")
              .getMany();
              console.log(ithem1);
              res.setHeader('Content-Type', 'application/json').json(ithem1)
              return 
        }); 

              //список обращенй фильтр по дате
        app.post('/list-of-requests', async (req, res) => {
                // Теперь в req.body – данные от клиента
                const req_body = req.body;
                var ds, ms, ys, de, me, ye;
                console.log(req_body);
                if(req_body.ys != undefined && req_body.ys != ''){
                ds = req_body.ds;
                ms = req_body.ms;
                ys = req_body.ys;
                if((ds== undefined||ms== undefined||ys == undefined)||(ds== ''||ms== ''||ys == '')) ds=ms=ys=undefined;
                date_start = ys+"-"+ms+"-"+ds;
                const sd = new Date(date_start);
                console.log(ds, ms, ys, sd);
                }
                
                if(ye != undefined && ye != ''){
                  de = String(Number(req_body.de) +1);
                  me = req_body.me;
                  ye = req_body.ye;
                  if((de== undefined||me== undefined||ye == undefined)||(de== ''||me== ''||ye == '')) de=me=ye=undefined;
                  date_end = ye+"-"+me+"-"+de;
                  const se = new Date(date_end);
                  console.log(de, me, ye, se);
                } else  {
                  const de = String(Number(req_body.ds) + 1);
                  const me = req_body.ms;
                  const ye = req_body.ys;
                  date_end = ye+"-"+me+"-"+de;
                  const se = new Date(date_end);
                  console.log(de, me, ye, se);
                }
                if(ys ==''){}
                if(ys == undefined || ys == ''){
                  //console.log('все', req_body);
                ithem1 = await connection
                .getRepository(Requests)
                .createQueryBuilder("requests")
                .getMany();
                //console.log(ithem1);
                res.setHeader('Content-Type', 'application/json').json(ithem1)
                }
                
                if(ys != undefined && ys != ''){
                  //console.log('диапазон', req_body);
                ithem1 = await connection
                        
              .createQueryBuilder()
              .select("requests")
              .from(Requests, "requests")
              .where(`requests.date > :startDate`, {startDate: new Date(date_start)})
              .andWhere(`requests.date < :endDate`, {endDate: new Date(date_end)})
              
              .getMany()
              //console.log(ithem1);
              {res.setHeader('Content-Type', 'application/json').json(ithem1)}
              
                }
        });

            //Взять обращение в работу
        app.get('/take-on-job', async (req, res) => {

              //const {requests_id} =req.query
              const request_id = req.query.id
              console.log('id= ', request_id);
              ithem1 = await connection
              .createQueryBuilder()
              .update<Requests>(Requests, { status: "В работе" })
              .where('requests.id = :id', { id: request_id })
              .returning(['id', 'status'])
              .updateEntity(true)
              .execute()
              //console.log(ithem1);
              res.setHeader('Content-Type', 'application/json').json(ithem1)
              

        }); 

        //Завершить обработку обращения
        app.post('/complete-request', async (req, res) => {

          //const {requests_id} =req.query
          const request_id = req.body.id
          const reply = req.body.reply
          //console.log('id= ', requests_id, request_id);
          ithem1 = await connection
          .createQueryBuilder()
          .update<Requests>(Requests, { status: "Завершено", reply: reply })
          .where('requests.id = :id', { id: request_id })
          .returning(['id', 'status'])
          .updateEntity(true)
          .execute()
          //console.log(ithem1);
          res.setHeader('Content-Type', 'application/json').json(ithem1)
        });

        //Отмена обращения
        app.post('/cancel-request', async (req, res) => {
          console.log('/cancel-request');
          //const {requests_id} =req.query
          const request_id = await req.body.id
          const reply = await req.body.reply
          //console.log('id= ', requests_id, request_id);
          console.log('id= ', request_id, 'reply ', reply);
          //return
          ithem1 = await connection
          .createQueryBuilder()
          .update<Requests>(Requests, { status: "Отменено", reason_for_cancellation: reply })
          .where('requests.id = :id', { id: request_id })
          .returning(['id', 'status'])
          .updateEntity(true)
          .execute()
          //console.log(ithem1);
          res.setHeader('Content-Type', 'application/json').json(ithem1)
        });
        //получить  обращение по id
        app.get('/list-of-requests-id', async (req, res) => {
              const request_id = req.query.id
              //console.log('id= ', request_id);
              const ithem1 = await connection
                .getRepository(Requests)
                .createQueryBuilder("requests")
                .where('requests.id = :id', { id: /*request_id*/ Number(3) })
                .getOne();
                //console.log(ithem1);
                res.setHeader('Content-Type', 'application/json').json(ithem1)
            
        });
        //отменить все обращения "В работе"
        app.get('/job-all-cancel', async (req, res) => {
              ithem1 = await connection
              .createQueryBuilder()
              .update<Requests>(Requests, { status: "Отменено" })
              .where('requests.status = :status', { status: "В работе" })
              .returning(['id', 'status', 'theme', 'request'])
              .updateEntity(true)
              .execute()
              //console.log(ithem1);
              res.setHeader('Content-Type', 'application/json').json(ithem1)
        })

    app.listen(PORT, () => 
      console.log(`⚡Server is running here 👉 https://localhost:${PORT}`));
  })
  .catch((err)  => {
    console.error("Error during Data Source initialization:${err}"/*, err*/);
    
    /*await*/ PostgresDataSource.destroy();
  });

})();

 
