import { BaseProps, Entity } from './Entity'

export abstract class AggregateRoot<Brand, Props extends BaseProps> extends Entity<Brand, Props> {}
