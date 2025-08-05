import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

// Интерфейс для обработки кликов по карточке

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Интерфейс, описывающий структуру данных для отображения карточки

export interface ICardView {
	id: string;
	index?: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price?: number;
	available: boolean;
	categoryClass: string;
}

// Класс карточки, расширяющий базовый компонент, реализующий отображение и управление данными карточки

export class Card<T> extends Component<ICardView> {
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price?: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._title = ensureElement<HTMLElement>(
			`.${blockName}__title`,
			this.container
		);
		this._image = container.querySelector(`.${blockName}__image`);
		this._price = ensureElement<HTMLElement>(
			`.${blockName}__price`,
			this.container
		);
		this._description = container.querySelector(`.${blockName}__description`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._index = container.querySelector('.basket__item-index');

// Установка обработчика клика, сли есть кнопка — на нее, иначе — на весь контейнер.
		
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

// Геттеры и сеттеры для управления свойствами карточки

	set id(value: string) {
		this.container.dataset.id = value; 
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		this.setDisabled(this._button, value === null);
	}

	set category(value: string) {
		this.setText(this._category, value); // установка категории
	}

	set categoryClass(value: string) {
		this.toggleClass(this._category, `card__category_${value}`); // добавление CSS класса для категории
	}

	set available(value: boolean) {
		// Обновление текста кнопки в зависимости от доступности товара.
		this.setText(this._button, value ? 'Удалить' : 'Купить');
	}

	set index(value: number) {
		this.setText(this._index, value); // отображение порядкового номера или индекса.
	}
}
