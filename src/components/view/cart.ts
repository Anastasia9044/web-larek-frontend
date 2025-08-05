import { Component } from '../base/component';
import { createElement, ensureElement, formatNumber } from '../../utils/utils';
import { IEvents } from '../base/events';

// Интерфейс описывает структуру данных, используемых в представлении корзины

interface TCartView {
	items: HTMLElement[];
	button: string[]; 
	price: number;
	locked: boolean;
}

// Класс компонента корзины

export class Cart extends Component<TCartView> {
	protected _items: HTMLElement;   
	protected _button: HTMLElement;
	protected _price: HTMLElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

// Ищем и сохраняем элементы по селекторам внутри контейнера

		this._items = ensureElement<HTMLElement>('.basket__list', this.container);
		this._button = ensureElement<HTMLElement>('.basket__button', this.container);
		this._price = ensureElement<HTMLElement>('.basket__price', this.container);

// Назначаем обработчик клика по кнопке заказа

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

// Инициализация свойств корзины по умолчанию

		this.price = 0;
		this.items = [];
	}

	// Сеттер для обновления списка элементов корзины

	set items(items: HTMLElement[]) {
		if (items.length) {
			// Если есть товары, заменяем содержимое списка на новые элементы
			this._items.replaceChildren(...items);
		} else {
			// Если товаров нет, показываем сообщение о пустой корзине
			this._items.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

// Сеттер для управления состоянием кнопки

	set toggleButton(value: boolean) {
        this.setDisabled(this._button, value);
    }

// Сеттер для обновления общей суммы в корзине

	set price(price: number) {
		this.setText(this._price, formatNumber(price) + ' синапсов');
    }
}