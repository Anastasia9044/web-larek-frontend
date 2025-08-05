import { Form } from './form';
import { TForm, PayMethod } from '../../types';
import { EventEmitter, IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// Класс управляет выбором способа оплаты и адресом

export class FormPrice extends Form<TForm> {
	private _typeCash: HTMLButtonElement;
	private _typeCard: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._typeCash = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);
		this._typeCard = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);

		// Назначаем обработчик клика для кнопки "при получении"

		this._typeCash.addEventListener('click', () => {
			this.onInputChange('payment', 'cash');
			this.payment = 'cash';
		});

		// Назначаем обработчик клика для кнопки "онлайн"

		this._typeCard.addEventListener('click', () => {
			this.onInputChange('payment', 'card');
			this.payment = 'card';
		});
	}

	// Сеттер для установки адреса в поле формы

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	// Сеттер для обновления визуального состояния выбранного способа оплаты

	set payment(value: PayMethod) {
		this.toggleClass(this._typeCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._typeCash, 'button_alt-active', value === 'cash');
	}
}
