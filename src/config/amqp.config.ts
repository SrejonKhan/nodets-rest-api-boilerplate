import { BindingConfig, ExchangeConfig, QueueConfig } from "../interfaces/amqp.interface";

const exchanges: ExchangeConfig[] = [
  {
    name: "exchange.mail",
    type: "direct",
    options: {
      durable: false,
    },
  },
];

const queues: QueueConfig[] = [
  {
    name: "queue.mail.user",
    options: {
      durable: false,
    },
  },
];

const bindings: BindingConfig[] = [
  {
    exchangeName: "exchange.mail",
    queueName: "queue.mail.user",
    bindingKey: "user",
  },
  {
    exchangeName: "exchange.mail",
    queueName: "queue.mail.user",
    bindingKey: "change_pass",
  },
  {
    exchangeName: "exchange.mail",
    queueName: "queue.mail.user",
    bindingKey: "change_pass_confirmation",
  },
];

const amqpConfig = {
  EXCHANGES: exchanges,
  QUEUES: queues,
  BINDINGS: bindings,
};

export default amqpConfig;
