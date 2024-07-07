import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table } from 'antd';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { TemplateTypeIcon } from '../components/TemplateTypeIcon';
import { trpc } from '../utils/trcp';

export const TemplatesPage: React.FC = () => {
	const list = trpc.template.list.useQuery({});
	const remove = trpc.template.remove.useMutation();

	if (list.isLoading) {
		return (
			<div>
				<PageHeader
					breadcrumb={[{ title: 'Templates' }]}
					right={<Link to="/templates/new">New template</Link>}
				/>
				<>Loading</>
			</div>
		);
	}

	return (
		<div>
			<PageHeader breadcrumb={[{ title: 'Templates' }]} right={<Link to="/templates/new">New template</Link>} />
			<Table
				rowKey="id"
				dataSource={list.data}
				columns={[
					{
						title: 'Type',
						render: record => <TemplateTypeIcon type={record.type} />,
					},
					{
						title: 'Subject',
						dataIndex: 'subject',
						key: 'subject',
					},
					{
						title: 'Name',
						dataIndex: 'name',
						key: 'name',
					},
					{
						title: 'Key',
						dataIndex: 'key',
						key: 'key',
					},
					{
						title: 'Action',
						render: record => (
							<Space>
								<Link to={`/templates/${record.id}`}>
									<Button type="primary" icon={<EyeOutlined />} />
								</Link>
								<Popconfirm
									title="Delete the template"
									description="Are you sure to delete this template?"
									onConfirm={async () => {
										await remove.mutateAsync({ id: record.id });
										await list.refetch();
									}}
									okText="Yes"
									cancelText="No"
								>
									<Button danger icon={<DeleteOutlined />} />
								</Popconfirm>
							</Space>
						),
					},
				]}
			/>
		</div>
	);
};
