import { Category } from './category'
import { Order } from './order'
import { OrderProduct } from './order-product'
import { Payment } from './payment'
import { Product } from './product'
import { ProductCategory } from './product-category'
import { User } from './user'

export * from './user'
export * from './category'
export * from './product'
export * from './product-category'
export * from './order'
export * from './order-product'
export * from './payment'

export const models = [User, Category, Product, ProductCategory, Order, Payment, OrderProduct]