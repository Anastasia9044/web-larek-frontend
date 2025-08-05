import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

// Интерфейс описывает структуру данных, передаваемых в попап

interface IPopupView {
	content: HTMLElement;
}

// Класс Popup управляет отображением модального окна

export class Popup extends Component<IPopupView> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	// Конструктор принимает контейнер и объект для работы с событиями

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		console.log({ events: events });

		// Находим кнопку закрытия 

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Сеттер для установки содержимого попапа

	set content(value: HTMLElement) {
		this._content.replaceChildren(value); 
	}	
	_togglePopup(state: boolean = true) {
		this.toggleClass(this.container, 'modal_active', state);
	}
	_handleEscape = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	};

	// Метод открытия попапа

	open() {
		this._togglePopup();
		document.addEventListener('keydown', this._handleEscape);
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('popup:open');
	}

	// Метод закрытия попапа

	close() {
		this._togglePopup(false);
		document.removeEventListener('keydown', this._handleEscape);
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null;
		this.events.emit('popup:close');
	}

	// Метод рендера — вызывает базовый рендер и открывает попап

	render(data: IPopupView): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
