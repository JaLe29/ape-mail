import { PageHeader } from '@/components/PageHeader';
import { trpc } from '@/utils/trpc';
import { Table } from 'antd';
import type { NextPage } from 'next';

const Contacts: NextPage = () => {
	const list = trpc.contact.list.useQuery();

	return (
		<div>
			<PageHeader breadcrumb={[{ title: 'Contacts', path: '/contacts' }]} />
			<Table
				rowKey="id"
				dataSource={list.data}
				columns={[
					{
						title: 'Project',
						dataIndex: 'project',
						key: 'project',
					},
					{
						title: 'Email',
						dataIndex: 'email',
						key: 'email',
					},
					{
						title: 'Messages Count',
						dataIndex: 'messagesCount',
						key: 'messagesCount',
					},
				]}
			/>
		</div>
	);
};

export default Contacts;
