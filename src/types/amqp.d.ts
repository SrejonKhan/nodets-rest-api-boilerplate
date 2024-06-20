interface ExchangeConfig {
  name: string;
  type: string;
  options?: amqp.Options.AssertExchange;
}

interface QueueConfig {
  name: string;
  options?: amqp.Options.AssertQueue;
}

interface BindingConfig {
  queueName: string;
  exchangeName: string;
  bindingKey: string;
}
