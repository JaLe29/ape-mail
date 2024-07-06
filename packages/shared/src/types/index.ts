// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT

export enum TemplateType {
	ROOT = 'ROOT',
	CHILD = 'CHILD',
}

export interface Contact {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	project?: string;
	messages: Message[];
}

export interface Template {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	description?: string;
	key: string;
	subject: string;
	body: string;
	messages: Message[];
	type: TemplateType;
	rootTemplateId?: string;
}

export interface Message {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	subject: string;
	body: string;
	templateId: string;
	template: Template;
	contactId: string;
	contact: Contact;
}
