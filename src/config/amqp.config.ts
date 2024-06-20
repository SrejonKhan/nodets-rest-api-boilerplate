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
    name: "queue.mail",
    options: {
      durable: false,
    },
  },
];

const bindings: BindingConfig[] = [
  {
    exchangeName: "exchange.mail",
    queueName: "queue.mail",
    bindingKey: "user",
  },
];

const amqpConfig = {
  EXCHANGES: exchanges,
  QUEUES: queues,
  BINDINGS: bindings,
};

export default amqpConfig;
