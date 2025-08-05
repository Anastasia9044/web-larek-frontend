import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IPageState {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}

export class Page extends Component<IPageState> {
    protected _pageContainer: HTMLElement;
	protected _counterCart: HTMLElement;
	protected _productGallery: HTMLElement;
	protected _ButtonCart: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

// Инициализация элементов по селекторам

        this._pageContainer = ensureElement<HTMLElement>(
			'.page__wrapper',
			this.container
		);
		this._counterCart = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.container
		);
		this._productGallery = ensureElement<HTMLElement>(
			'.gallery',
			this.container
		);
		this._ButtonCart = ensureElement<HTMLElement>(
			'.header__basket',
			this.container
		);

// Обработчик клика по корзине

		this._ButtonCart.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// Обновление счетчика товаров в корзине

	set cartItemCount(value: number) {
		this.setText(this._counterCart, String(value));
	}

// Обновление отображения товаров в галерее

	set productItems(items: HTMLElement[]) {
		this._productGallery.replaceChildren(...items);
	}

	// Установка состояния блокровки страницы

	set isLocked(value: boolean) {
		this.toggleClass(this._pageContainer, 'page__wrapper_locked', value);
	}
}
