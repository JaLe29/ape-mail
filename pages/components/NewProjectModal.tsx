import { createApp } from '@/schema/project.schema';
import { trpc } from '@/utils/trpc';
import { Button, Form, Input, Modal } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useEffect, useState } from 'react';

const rule = createSchemaFieldRule(createApp);

interface Props {
	isOpen: boolean;
	onClose: () => void;
	refetch: () => Promise<any>;
}

export const NewProjectModal: React.FC<Props> = ({ isOpen, onClose, refetch }) => {
	const [form] = Form.useForm();
	const [isCreating, setIsCreating] = useState(false);
	const create = trpc.project.create.useMutation();

	const onCreateLocal = async (values: { name: string }) => {
		setIsCreating(true);
		await create.mutateAsync(values);
		await refetch();
		setIsCreating(false);
		onClose();
	};

	useEffect(() => {
		if (!isOpen) {
			form.resetFields();
		}
	}, [isOpen, form]);

	return (
		<Modal
			title="Create new project"
			open={isOpen}
			onOk={() => onClose()}
			onCancel={() => onClose()}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
		>
			<Form layout="vertical" onFinish={onCreateLocal} form={form}>
				<Form.Item label="Name" name="name" rules={[rule]}>
					<Input />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isCreating}>
						Submit
					</Button>
				</Form.Item>
			</Form>
			<Button type="link" htmlType="submit" style={{ width: '100%' }} onClick={() => onClose()}>
				Close
			</Button>
		</Modal>
	);
};
