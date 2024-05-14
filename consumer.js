import { AMQPClient } from "@cloudamqp/amqp-client";
import {} from 'dotenv/config';
const url=process.env.URL;
let args=process.argv;
args=args.slice(2);
async function startConsumer(){
    const connection=new AMQPClient(url);
    await connection.connect();
    const channel=await connection.channel();
    console.log("[✅] Connection over channel established");
    console.log("[❎] Waiting for messages. To exit press CTRL+C ");
    const p=await channel.queue('hr_queue');
    const q=await channel.queue('marketing_queue');
    const r=await channel.queue('support_queue');
    let counter=0;
    for(let i=0;i<args.length;i++){
        if(args[i]==='hr'){
            await p.subscribe({noAck:true},async(msg)=>{
                try {
                    console.log('This is hr_queue');
                    console.log(`[📤] Message received (${++counter})`, msg.bodyToString())
                } catch (error) {
                    console.error(error);
                }
            })
        }
        if(args[i]==='marketing'){
            await q.subscribe({noAck:true},async(msg)=>{
                try {
                    console.log('This is marketing_queue');
                    console.log(`[📤] Message received (${++counter})`, msg.bodyToString())
                } catch (error) {
                    console.error(error);
                }
            })
        }
        if(args[i]==='support'){
            await r.subscribe({noAck:true},async(msg)=>{
                try {
                    console.log('This is support_queue');
                    console.log(`[📤] Message received (${++counter})`, msg.bodyToString())
                } catch (error) {
                    console.error(error);
                }
            })
        }
    }
    process.on('SIGINT',()=>{
        channel.close();
        connection.close();
        console.log("[❎] Connection closed")
    process.exit(0)
    })
}
startConsumer().catch(console.error);