import amqp from "amqplib";
import config from "../config/base.config";
import { BindingConfig, ExchangeConfig, QueueConfig } from "../interfaces/amqp.interface";

const getConnection = (function () {
  let connection: amqp.Connection;

  return async function () {
    if (!connection) {
      connection = await amqp.connect(config.AMQP_URI);
    }
    return connection;
  };
})();

const getChannel = (function () {
  let channel: amqp.Channel;

  return async function () {
    const conn = await getConnection();
    if (!channel) {
      channel = await conn.createChannel();
    }
    return channel;
  };
})();

const sendToQueue = async (queueName: string, content: any, options?: amqp.Options.Publish): Promise<boolean> => {
  const channel = await getChannel();
  return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(content)), options);
};

const sendToExchange = async (
  exchangeName: string,
  routingKey: string,
  content: any,
  options?: amqp.Options.Publish
): Promise<boolean> => {
  const channel = await getChannel();
  return channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(content)), options);
};

const consume = async (
  queueName: string,
  onMessage: (msg: amqp.ConsumeMessage, channel: amqp.Channel) => void,
  options?: amqp.Options.Consume
): Promise<amqp.Replies.Consume> => {
  const channel = await getChannel();
  return channel.consume(queueName, (msg) => onMessage(msg, channel), options);
};

const init = async (exchanges: ExchangeConfig[], queues: QueueConfig[], bindings: BindingConfig[]) => {
  const channel = await getChannel();

  // asserting all exchanges
  for (const exchange of exchanges) {
    await channel.assertExchange(exchange.name, exchange.type, exchange.options);
  }

  // asserting all queues
  for (const queue of queues) {
    await channel.assertQueue(queue.name, queue.options);
  }

  // bind all exchanges and queues
  for (const binding of bindings) {
    await channel.bindQueue(binding.queueName, binding.exchangeName, binding.bindingKey);
  }
};

export { init, sendToQueue, sendToExchange, consume };
