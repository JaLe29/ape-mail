import { EyeOutlined } from '@ant-design/icons';
import { Button, Input, Pagination, Space, Table } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { PageHeader } from '../components/PageHeader';
import { Right } from '../components/Right';
import { RouterInput, trpc } from '../utils/trcp';

export const ContactsPage: React.FC = () => {
	const [pagination, setPagination] = useState<RouterInput['contact']['list']['pagination']>({ take: 10, skip: 0 });
	const [where, setWhere] = useState<NonNullable<RouterInput['contact']['list']['where']>>({});

	const [wherePayload] = useDebounce(where, 500);

	const list = trpc.contact.list.useQuery({ pagination, where: wherePayload });

	return (
		<div>
			<PageHeader breadcrumb={[{ title: 'Contacts', path: '/contacts' }]} />
			<Space>
				<Input
					placeholder="Email"
					value={where.email}
					onChange={e => setWhere({ ...where, email: e.target.value })}
				/>
				<Input
					placeholder="Project"
					value={where.project}
					onChange={e => setWhere({ ...where, project: e.target.value })}
				/>
			</Space>
			<br />
			<br />
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
					{
						title: 'Action',
						render: record => (
							<Space>
								<Link to={`/contacts/${record.id}`}>
									<Button type="primary" icon={<EyeOutlined />} />
								</Link>
							</Space>
						),
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
