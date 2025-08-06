import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/webLarekApi';
import { App, CatalogItem } from './components/model/model';
import { Page } from './components/view/page';
import { Popup } from './components/view/popup';
import { Cart } from './components/view/cart';
import { Card } from './components/view/card';
import { FormPrice } from './components/view/formPrice';
import { TCard, TContact, TForm, TOrder, TOrderResult } from './types';
import { FormContact } from './components/view/formContact';
import { Success } from './components/view/success';

const events = new EventEmitter();
const api = new LarekApi(API_URL, CDN_URL);
const app = new App({}, events);

//Инициализация шаблонов элементов интерфейса

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalEl = ensureElement<HTMLElement>('#modal-container');

//Создание основных компонентов страницы и интерфейса

const page = new Page(document.body, events);
const basket = new Cart(cloneTemplate(basketTemplate), events);
const modal = new Popup(modalEl, events);
const order = new FormPrice(cloneTemplate(orderTemplate), events);
const contacts = new FormContact(cloneTemplate(contactsTemplate), events);

//Обновление каталога товаров

events.on('catalog:update', () => {
	page.productItems = app.items.map((item) => {
		const card = new Card('card', cloneTemplate(cardTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			categoryClass: item.categoryClass,
		});
	});
});

//Обработка выбора товара для просмотра
//Устанавливает выбранный товар для предварительного просмотра

events.on('card:select', (item: CatalogItem) => {
	app.setPreview(item);
});

//Открытие модального окна с подробной информацией о товаре

events.on('preview:change', (item: CatalogItem) => {
	const inBasket = app.basket.items.includes(item.id);
	const card = new Card('card', cloneTemplate(previewTemplate), {
		onClick: () => {
			events.emit(`${inBasket ? 'card:remove' : 'basket:add'}`, item);
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			available: inBasket,
			categoryClass: item.categoryClass,
		}),
	});
});

//Открытие модального окна с содержимым корзины покупок

events.on('basket:open', () => {
	basket.toggleButton = app.basket.items.length === 0;
	basket.price = app.basket.price;
	modal.render({
		content: basket.render({}),
	});
});

// Добавление выбранного товара в корзину покупок

events.on('basket:add', (item: CatalogItem) => {
	app.addToBasket(item);
});

// Удаление товара из корзины покупок

events.on('basket:remove', (item: CatalogItem) => {
	app.removeFromBasket(item);
});

// Удаление товара из карточки товара

events.on('card:remove', (item: CatalogItem) => {
	app.removeFromCard(item);
});

//Обработка изменений в корзине
//Обновляет список товаров в корзине и общую сумму

events.on('basket:change', () => {
	let price = 0;
	basket.items = app.basket.items.map((id, index) => {
		console.log({ index });

		const item = app.items.find((item) => item.id === id);
		price += item.price;

		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove', item),
		});

		return card.render({
			index: (index + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});

	app.basket.price = price;
	basket.toggleButton = app.basket.items.length === 0;
	basket.price = app.basket.price;
	page.cartItemCount = app.basket.items.length;
});

//Открытие формы оформления заказа в модальном окне

events.on('order:open', () => {
	app.validateOrder(); // обновляем ошибки и валидность
	modal.render({
		content: order.render({
			valid: Object.keys(app.formErrors).length === 0,
			errors: Object.values(app.formErrors),
		}),
	});
});

//Обработка изменений в полях формы заказа

events.on(
	/^order\..*:change/,
	(data: { field: keyof TForm; value: string }) => {
		app.setOrderField(data.field, data.value);
	}
);

//Валидация формы заказа, бновление состояния валидности и ошибок формы.

events.on('order:validate', (errors: Partial<TOrder>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment; // форма валидна если нет ошибок по адресу и способу оплаты
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

//Открытие формы контактов для ввода данных пользователя перед оформлением заказа

events.on('order:submit', () => {
	app.validateContacts(); // обновляем ошибки и валидность
	modal.render({
		content: contacts.render({
			valid: Object.keys(app.formErrors).length === 0,
			errors: Object.values(app.formErrors),
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TContact; value: string }) => {
		app.setContactsField(data.field, data.value);
	}
);

//Изменилось состояние валидации формы контактов

events.on('contacts:validate', (errors: Partial<TOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	api
		.placeOrder(app.order)
		.then((result: TOrderResult) => {
			app.clearBasket(); // очистить корзину после успешного оформления заказа
			const success = new Success(
				'order-success',
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
					},
				}
			);
			success.price = result.total;
			modal.render({
				content: success.render(),
			});
		})
		.catch(console.error); // обработка ошибок при отправке заказа
});

//Открытие модального окна с формой контактов для ввода данных клиента перед подтверждением заказа

events.on('modal:open', () => {
	page.isLocked = true; // блокировка страницы при открытом модальном окне
});

// Разблокировка страницы после закрытия модального окна

events.on('modal:close', () => {
	page.isLocked = false; // разблокировка страницы после закрытия модального окна
});

// Загрузка списка товаров с сервера при инициализации приложения.

api.getProductList().then(app.setCatalog.bind(app)).catch(console.error);
