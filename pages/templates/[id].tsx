import css from '@/styles/Template.module.css';
import { getTemplates, isUUID } from '@/utils/string';
import { trpc } from '@/utils/trpc';
import { Breadcrumb, Button, Divider, Input } from 'antd';
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
}
const Template: NextPage = () => {
	const router = useRouter();
	const queryId = router.query.id;
	const isNew = queryId === 'new';
	const [template, setTemplate] = useState<LocalTemplate | undefined>(undefined);
	const one = trpc.template.one.useQuery({ id: queryId as string }, { enabled: isUUID(queryId as string) });
	const create = trpc.template.create.useMutation();
	const update = trpc.template.update.useMutation();

	useEffect(() => {
		if (queryId === 'new') {
			setTemplate({
				id: 'new',
				name: '',
				key: '',
				body: '',
				subject: '',
			});
		}
	}, [queryId]);

	useEffect(() => {
		if (one.data) {
			setTemplate(one.data);
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
			});
		}
	};

	if (!template) {
		return 'Loading';
	}

	return (
		<>
			<Breadcrumb
				items={[{ title: 'Templates', path: '/templates' }, { title: isNew ? 'New' : template.name }]}
			/>

			<div className={css.root}>
				<div className={css.childA}>
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
					<TextArea
						placeholder="Html template"
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
				</div>
				<div className={css.childBs}>
					<div>{template.subject}</div>
					<div className={css.childBs} dangerouslySetInnerHTML={{ __html: template.body }} />
					<Divider />
					{'Templates: ' + getTemplates(template.body).join(', ')}
				</div>
			</div>
		</>
	);
};

export default Template;
