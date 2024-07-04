import { trpc } from '@/utils/trpc';
import { Breadcrumb, Table } from 'antd';
import type { NextPage } from 'next';

const Contacts: NextPage = () => {
	const list = trpc.contact.list.useQuery();

	return (
		<div>
			<Breadcrumb items={[{ title: 'Contacts' }]} />
			<Table
				rowKey="id"
				dataSource={list.data}
				columns={[
					{
						title: 'Id',
						dataIndex: 'id',
						key: 'id',
					},
					{
						title: 'Email',
						dataIndex: 'email',
						key: 'email',
					},
					{
						title: 'MessagesCount',
						dataIndex: 'messagesCount',
						key: 'messagesCount',
					},
				]}
			/>
		</div>
	);
};

export default Contacts;
