import { TOrderResult } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

// Интерфейс для определения действий, которые можно выполнить при успехе

interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

// Класс Success отображает информацию о успешном завершении заказа

export class Success extends Component<TOrderResult> {
	protected _price: HTMLElement;
	protected _close: HTMLButtonElement;

	constructor(
		protected blockName: string,
		protected container: HTMLFormElement,
		actions?: ISuccessActions
	) {
		super(container);
		this._price = ensureElement<HTMLElement>(
			`.${blockName}__description`,
			this.container
		);
		this._close = ensureElement<HTMLButtonElement>(
			`.${blockName}__close`,
			this.container
		);

		// Если передан обработчик onClick в actions
		if (actions?.onClick) {
			if (this._close) {
				// Назначаем обработчик клика на кнопку закрытия
				this._close.addEventListener('click', actions.onClick);
			} else {
				// Если кнопка не найдена, назначаем обработчик на весь контейнер
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Сеттер для установки текста цены/описания стоимости

	set price(value: number) {
		this.setText(this._price, `Списано ${value} синапсов`);
	}
}
