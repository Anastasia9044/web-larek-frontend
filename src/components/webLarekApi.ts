import { Api, ApiListResponse } from './base/api';
import { TOrder, TOrderResult, TCard } from '../types';

/**
 * Модель взаимдоействия с Api
 */
export interface IWebLarekApiModel {
	getProduct: (id: string) => Promise<TCard>;
	getProductList: () => Promise<TCard[]>;
	placeOrder: (order: TOrder) => Promise<TOrderResult>;
}

export class LarekApi extends Api implements IWebLarekApiModel {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProduct(id: string): Promise<TCard> {
		return this.get(`/product/${id}`).then((item: TCard) => ({
			...item,
			image: this.cdn + item.image.replace('.svg', '.png'),
		}));
	}

	getProductList(): Promise<TCard[]> {
		return this.get('/product').then((response: ApiListResponse<TCard>) =>
			response.items.map((item) => ({
				...item,
				image: this.cdn + item.image.replace('.svg', '.png'),
			}))
		);
	}

	placeOrder(order: TOrder): Promise<TOrderResult> {
		return this.post('/order', order).then(
			(response: TOrderResult) => response
		);
	}
}