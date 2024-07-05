import { FormElement } from '@/components/FormElement';
import { PageHeader } from '@/components/PageHeader';
import css from '@/styles/Template.module.css';
import { getTemplates, isUUID, replaceTemplates } from '@/utils/string';
import { trpc } from '@/utils/trpc';
import { TemplateType } from '@prisma/client';
import { Button, Divider, Input, Radio, Select, Space, Tag } from 'antd';
import format from 'html-format';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

interface LocalTemplate {
	id: string;
	key: string;
	name: string;
	body: string;
	subject: string;
	type: TemplateType;
	rootTemplateId?: string;
}
const Template: NextPage = () => {
	const router = useRouter();
	const queryId = router.query.id;
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
			setTemplate({ ...one.data, rootTemplateId: one.data.rootTemplateId || undefined });
		}
	}, [one.data]);

	const onSaveClick = async () => {
		if (!template) {
			return;
		}

		if (template.id === 'new') {
			const res = await create.mutateAsync({
				name: template.name,
				body: template.body,
				key: template.key,
				subject: template.subject,
				type: template.type,
				rootTemplateId: template.rootTemplateId,
			});
			if (res) {
				router.push(`/templates/${res}`);
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
			});
		}
	};

	if (!template) {
		return 'Loading';
	}

	const templateRoot = listRootTemplates.data?.find(t => t.id === template.rootTemplateId);
	const hasTemplate = template.type === TemplateType.CHILD && !!templateRoot;
	const htmlToShow = hasTemplate ? replaceTemplates(templateRoot.body, { body: template.body }) : template.body;

	console.log(listRootTemplates.data);
	console.log(template.rootTemplateId);
	console.log({ templateRoot });

	return (
		<>
			<PageHeader
				breadcrumb={[{ title: 'Templates', path: '/templates' }, { title: isNew ? 'New' : template.name }]}
			/>

			<div className={css.root}>
				<div className={css.childA}>
					<FormElement label="Type">
						<Radio.Group
							onChange={e => {
								setTemplate(prev => {
									if (!prev) return prev;
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
									if (!prev) return prev;
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
									if (!prev) return prev;
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
											if (!prev) return prev;
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
											if (!prev) return prev;
											return {
												...prev,
												rootTemplateId: newTemplateId,
											};
										});
									}}
									value={template.rootTemplateId}
									style={{ width: '100%' }}
								>
									{listRootTemplates.data?.map(template => (
										<Select.Option key={template.id} value={template.id}>
											{template.name}
										</Select.Option>
									))}
									<Select.Option value="sample">Sample</Select.Option>
								</Select>
							</FormElement>
						</>
					)}
					<FormElement label="Content">
						<TextArea
							placeholder="Content"
							value={template.body}
							autoSize={{ minRows: 20, maxRows: 50 }}
							onChange={e =>
								setTemplate(prev => {
									if (!prev) return prev;
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
									if (!prev) return prev;
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
				<div className={css.childBs}>
					<FormElement label="Subject">
						<div>{template.subject}</div>
					</FormElement>
					<FormElement label="Content">
						<div
							className={css.childBs}
							dangerouslySetInnerHTML={{
								__html: htmlToShow,
							}}
						/>
					</FormElement>
					<Divider />
					<FormElement label="Templates">
						{getTemplates(htmlToShow).map((t, i) => (
							<Tag key={t + '' + i}>{t}</Tag>
						))}
					</FormElement>
				</div>
			</div>
		</>
	);
};

export default Template;
