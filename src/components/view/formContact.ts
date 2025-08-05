import { Form } from "./form";
import { TForm } from "../../types";
import { EventEmitter, IEvents } from "../base/events";

// Класс FormContact расширяет базовый класс Form, добавляя специфичные для контакта поля

export class FormContact extends Form<TForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    // Сеттер для установки значения поля 'phone' в форме

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    // Сеттер для установки значения поля 'email' в форме
    
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}