import { Pagination, Table } from 'antd';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Right } from '../components/Right';
import { RouterInput, trpc } from '../utils/trcp';

export const ContactsPage: React.FC = () => {
	const [pagination, setPagination] = useState<RouterInput['contact']['list']['pagination']>({ take: 10, skip: 0 });

	const list = trpc.contact.list.useQuery({ pagination });

	return (
		<div>
			<PageHeader breadcrumb={[{ title: 'Contacts', path: '/contacts' }]} />
			<Table
				loading={list.isLoading}
				rowKey="id"
				dataSource={list.data?.data}
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
			{!list.isLoading && (
				<>
					<br />
					<Right>
						<Pagination
							total={list.data?.total}
							pageSize={pagination?.take}
							current={pagination?.skip}
							showSizeChanger={false}
							onChange={(p, ps) => {
								setPagination({ skip: p, take: ps });
							}}
						/>
					</Right>
				</>
			)}
		</div>
	);
};
