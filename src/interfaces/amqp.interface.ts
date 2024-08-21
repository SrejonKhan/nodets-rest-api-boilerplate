import amqp from "amqplib";

export interface ExchangeConfig {
  name: string;
  type: string;
  options?: amqp.Options.AssertExchange;
}

export interface QueueConfig {
  name: string;
  options?: amqp.Options.AssertQueue;
}

export interface BindingConfig {
  queueName: string;
  exchangeName: string;
  bindingKey: string;
}
