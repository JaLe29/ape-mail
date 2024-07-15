import { Pagination, Table } from 'antd';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { RouterInput, trpc } from '../utils/trcp';

export const ContactsPage: React.FC = () => {
	const [pagination, setPagination] = useState<RouterInput['contact']['list']['pagination']>({ take: 10, skip: 0 });

	const list = trpc.contact.list.useQuery({ pagination });

	if (!list.isLoading) {
		return 'Loading';
	}

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
				pagination={false}
			/>
			<Pagination
				total={1111}
				pageSize={pagination?.take}
				current={pagination?.skip}
				size="small"
				showSizeChanger={false}
				onChange={(p, ps) => {
					setPagination({ skip: p, take: ps });
				}}
			/>
		</div>
	);
};
