export interface ICard {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
}

export interface ICardsList {
  cards: ICard[];
  total: number;
}

export interface IOrder {
  cards: ICard[];
  payment: 'card' | 'cash';
  email: string;
  address: string;
  phone: string;
  total: number;
}

export interface ICartPopup {
  cards: ICard[];
  total: number | null;
  count: number;
}