import { AMQPClient } from "@cloudamqp/amqp-client";
import {} from 'dotenv/config';
const url =process.env.URL;
async function startProducer(){
    try {
        const connection=new AMQPClient(url);
        await connection.connect();
        const channel=await connection.channel();
        console.log("[✅] Connection over channel established");
      await channel.exchangeDeclare("slack_notifications","direct");
        await channel.queueDeclare("hr_queue");
        await channel.queueDeclare("marketing_queue");
        await channel.queueDeclare("support_queue");
        await channel.queueBind('hr_queue','slack_notifications','hr');
        await channel.queueBind('marketing_queue','slack_notifications','marketing');
        await channel.queueBind('support_queue','slack_notifications','support');
        async function sendToQueue(routingKey,body){
            await channel.basicPublish('slack_notifications',routingKey,body);
            console.log("[📥] Message sent to queue", body);
        }
        sendToQueue('hr',"this is hr_queue");
        sendToQueue('marketing',"this is marketing_queue");
        sendToQueue('support',"this is supporting queue");
        setTimeout(()=>{
            connection.close();
            console.log("[❎] Connection closed");
            process.exit(0);
        },500);
    } catch (error) {
        console.error(error);
        setTimeout(()=>{
            startProducer();
        },300)
        
    }
}
startProducer();