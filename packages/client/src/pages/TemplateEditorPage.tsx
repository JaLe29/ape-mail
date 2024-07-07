/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
/* eslint-disable no-console */

import { TemplateType, getTemplates, isUUID, replaceTemplates } from '@ape-mail/shared';
import { Button, Divider, Input, Radio, Select, Space, Tag, notification } from 'antd';
import format from 'html-format';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FormElement } from '../components/FormElement';
import { PageHeader } from '../components/PageHeader';
import { trpc } from '../utils/trcp';

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;

	.childA {
		width: 40%;
		padding-right: 0.5em;
	}

	.childB {
		width: 60%;
		padding-left: 0.5em;
	}
`;

const { TextArea } = Input;

interface LocalTemplate {
	id: string;
	key: string;
	name: string;
	body: string;
	subject: string;
	type: TemplateType;
	rootTemplateId?: string;
	description?: string;
}
export const TemplateEditorPage: React.FC = () => {
	const { id: queryId } = useParams();
	const navigate = useNavigate();
	const isNew = queryId === 'new';
	const [template, setTemplate] = useState<LocalTemplate | undefined>(undefined);
	const one = trpc.template.one.useQuery({ id: queryId as string }, { enabled: isUUID(queryId as string) });
	const create = trpc.template.create.useMutation();
	const update = trpc.template.update.useMutation();
	const listRootTemplates = trpc.template.list.useQuery(
		{ type: TemplateType.ROOT },
		{ enabled: template?.type === 'CHILD' },
	);

	useEffect(() => {
		if (queryId === 'new') {
			setTemplate({
				id: 'new',
				name: '',
				key: '',
				body: '',
				subject: '',
				type: TemplateType.CHILD,
			});
		}
	}, [queryId]);

	useEffect(() => {
		if (one.data) {
			setTemplate({
				...one.data,
				type: one.data.type as TemplateType,
				rootTemplateId: one.data.rootTemplateId || undefined,
				description: one.data.description || undefined,
			});
		}
	}, [one.data]);

	const onSaveClick = async () => {
		if (!template) {
			return;
		}

		try {
			if (template.id === 'new') {
				const res = await create.mutateAsync({
					name: template.name,
					body: template.body,
					key: template.key,
					subject: template.subject,
					type: template.type,
					rootTemplateId: template.rootTemplateId,
					description: template.description,
				});
				if (res) {
					navigate(`/templates/${res}`);
					notification.success({
						message: 'Successfully created',
					});
				}
			} else {
				await update.mutateAsync({
					id: template.id,
					name: template.name,
					body: template.body,
					key: template.key,
					subject: template.subject,
					type: template.type,
					rootTemplateId: template.rootTemplateId,
					description: template.description,
				});
				notification.success({
					message: 'Successfully updated',
				});
			}
		} catch (error) {
			console.error(error);
			notification.error({
				message: 'Failed',
			});
		}
	};

	if (!template) {
		return 'Loading';
	}

	const templateRoot = listRootTemplates.data?.find(t => t.id === template.rootTemplateId);
	const hasTemplate = template.type === TemplateType.CHILD && !!templateRoot;
	const htmlToShow = hasTemplate ? replaceTemplates(templateRoot.body, { body: template.body }) : template.body;

	return (
		<>
			<PageHeader
				breadcrumb={[{ title: 'Templates', path: '/templates' }, { title: isNew ? 'New' : template.name }]}
			/>

			<Wrapper>
				<div className="childA">
					<FormElement label="Type">
						<Radio.Group
							onChange={e => {
								setTemplate(prev => {
									if (!prev) {
										return prev;
									}
									const tempalteId =
										e.target.value === TemplateType.CHILD ? undefined : prev.rootTemplateId;
									return {
										...prev,
										type: e.target.value,
										tempalteId,
									};
								});
							}}
							value={template.type}
						>
							<Radio value={TemplateType.CHILD}>CHILD</Radio>
							<Radio value={TemplateType.ROOT}>ROOT</Radio>
						</Radio.Group>
					</FormElement>
					<FormElement label="Key">
						<Input
							placeholder="key"
							value={template.key}
							onChange={e =>
								setTemplate(prev => {
									if (!prev) {
										return prev;
									}
									return {
										...prev,
										key: e.target.value,
									};
								})
							}
						/>
					</FormElement>
					<FormElement label="Name">
						<Input
							placeholder="name"
							value={template.name}
							onChange={e =>
								setTemplate(prev => {
									if (!prev) {
										return prev;
									}
									return {
										...prev,
										name: e.target.value,
									};
								})
							}
						/>
					</FormElement>
					{template.type === TemplateType.CHILD && (
						<>
							<FormElement label="Subject">
								<Input
									placeholder="subject"
									value={template.subject}
									onChange={e =>
										setTemplate(prev => {
											if (!prev) {
												return prev;
											}
											return {
												...prev,
												subject: e.target.value,
											};
										})
									}
								/>
							</FormElement>
							<FormElement label="Root template">
								<Select
									onChange={newTemplateId => {
										setTemplate(prev => {
											console.log(newTemplateId);
											if (!prev) {
												return prev;
											}
											return {
												...prev,
												rootTemplateId: newTemplateId,
											};
										});
									}}
									value={template.rootTemplateId}
									style={{ width: '100%' }}
								>
									{listRootTemplates.data?.map(t => (
										<Select.Option key={t.id} value={t.id}>
											{t.name}
										</Select.Option>
									))}
									<Select.Option value="sample">Sample</Select.Option>
								</Select>
							</FormElement>
						</>
					)}
					<FormElement label="Description">
						<TextArea
							placeholder="Description"
							value={template.description}
							autoSize={{ minRows: 3, maxRows: 5 }}
							onChange={e =>
								setTemplate(prev => {
									if (!prev) {
										return prev;
									}
									return {
										...prev,
										description: e.target.value,
									};
								})
							}
						/>
					</FormElement>
					<FormElement label="Content">
						<TextArea
							placeholder="Content"
							value={template.body}
							autoSize={{ minRows: 20, maxRows: 50 }}
							onChange={e =>
								setTemplate(prev => {
									if (!prev) {
										return prev;
									}
									return {
										...prev,
										body: e.target.value,
									};
								})
							}
						/>
					</FormElement>
					<Space>
						<Button onClick={onSaveClick}>{isNew ? 'Create' : 'Update'}</Button>
						<Button
							onClick={() => {
								setTemplate(prev => {
									if (!prev) {
										return prev;
									}
									return {
										...prev,
										body: format(prev.body),
									};
								});
							}}
						>
							Format
						</Button>
					</Space>
				</div>
				<div className="childB">
					<FormElement label="Subject">
						<div>{template.subject}</div>
					</FormElement>
					<FormElement label="Content">
						<div
							className="childBs"
							dangerouslySetInnerHTML={{
								__html: htmlToShow,
							}}
						/>
					</FormElement>
					<Divider />
					<FormElement label="Templates">
						{getTemplates(htmlToShow).map((t, i) => (
							<Tag key={`${t}${i}`}>{t}</Tag>
						))}
					</FormElement>
				</div>
			</Wrapper>
		</>
	);
};
