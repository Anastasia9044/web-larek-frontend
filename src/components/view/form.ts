import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// Интерфейс описывает состояние формы по валидации

interface IForm {
	valid: boolean;
	errors: string[];
}

// Класс Form управляет формой и её состоянием

export class Form<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	// Конструктор принимает форму и объект событий

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const value = target.value;
			const field = target.name as keyof T;
			this.onInputChange(field, value);
		});
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	//  Метод вызывается при изменении любого поля формы.

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	// Устанавливает состояние валидности формы.

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value); 
	}

	// Устанавливает текст ошибок в элемент отображения ошибок.

	set errors(value: string) {
		this.setText(this._errors, value); 
	}

	// Метод рендера — обновляет состояние формы и возвращает контейнер.

	render(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state; 
		super.render({ valid, errors }); 
		Object.assign(this, inputs); 
		return this.container; 
	}
}
