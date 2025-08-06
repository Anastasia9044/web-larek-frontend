export type TCard = {
  id: string;
  title: string;
  image: string;
  price: number| null;
  description: string;
  category: string;
}

export type TContact = {
  email?: string;
	phone?: string;
}
export type PayMethod = 'card' | 'cash';

export type TForm = {
  payment: PayMethod;
  address: string;
}
export type TOrder = TForm & TContact & {
	items?: string[]
	total?: number;
}

export type FormErrors = Partial<Record<keyof TOrder, string>>;

export type TOrderResult = {
	id: string;
	total: number;
}

export type TCartPopup = {
  items: string[];
  price: number | null;
}
