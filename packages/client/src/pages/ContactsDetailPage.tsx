/* eslint-disable react/no-danger */
import { EyeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Table } from 'antd';
import modal from 'antd/es/modal';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { trpc } from '../utils/trcp';

export const ContactsDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const contact = trpc.contact.one.useQuery({ id: id! });

	if (contact.isLoading) {
		return <div>Loading...</div>;
	}

	if (!contact.data) {
		return <div>Not found</div>;
	}

	return (
		<div>
			<PageHeader
				breadcrumb={[{ title: 'Contacts', path: '/contacts' }, { title: contact.data?.email ?? 'Loading...' }]}
			/>
			<Descriptions title="Contact Info" bordered>
				<Descriptions.Item label="Email">{contact.data.email}</Descriptions.Item>
				<Descriptions.Item label="Project">{contact.data.project}</Descriptions.Item>
				<Descriptions.Item label="Messages Count">{contact.data.messagesCount}</Descriptions.Item>
			</Descriptions>
			<br />
			<br />
			<Table
				rowKey="id"
				dataSource={contact.data.messages}
				columns={[
					{
						title: 'Template ID',
						dataIndex: 'templateId',
						key: 'templateId',
					},
					{
						title: 'Subject',
						dataIndex: 'subject',
						key: 'subject',
					},
					{
						title: 'Created At',
						dataIndex: 'createdAt',
						key: 'createdAt',
						render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
					},
					{
						title: 'Action',
						render: record => (
							<Button
								type="primary"
								icon={<EyeOutlined />}
								onClick={async () => {
									await modal.confirm({
										title: record.subject,
										content: (
											<div
												dangerouslySetInnerHTML={{
													__html: record.body,
												}}
											/>
										),
										okText: 'Close',
									});
								}}
							/>
						),
					},
				]}
				pagination={false}
			/>
		</div>
	);
};
