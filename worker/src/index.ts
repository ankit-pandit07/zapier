import {Kafka} from "kafkajs"

const TOPIC_NAME="zap-events";

const kafka=new Kafka({
    clientId:'outbox-processor',
    brokers:['localhost:9092']
})

async function main(){
    const consumer=kafka.consumer({groupId:"main-worker"});
    while(1){

    }
}

main();