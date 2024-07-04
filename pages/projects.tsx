import { trpc } from '@/utils/trpc';
import { Button, Popconfirm, Space, Table } from 'antd';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { NewProjectModal } from './components/NewProjectModal';
import { PageHeader } from './components/PageHeader';

const Projects: NextPage = () => {
	const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
	const list = trpc.project.list.useQuery();
	const remove = trpc.project.remove.useMutation();

	if (list.isLoading) {
		return (
			<div>
				<PageHeader
					breadcrumb={[{ title: 'Projects' }, { title: 'foo1' }, { title: 'foo2' }]}
					right={<Button onClick={() => setIsNewProjectModalOpen(true)}>New project</Button>}
				/>
				<>Loading</>
			</div>
		);
	}

	if (list.data?.length === 0) {
		return (
			<div>
				<PageHeader
					breadcrumb={[{ title: 'Projects' }, { title: 'foo1' }, { title: 'foo2' }]}
					right={<Button onClick={() => setIsNewProjectModalOpen(true)}>New project</Button>}
				/>
				<Table dataSource={[]} columns={[]} />
				<NewProjectModal
					isOpen={isNewProjectModalOpen}
					onClose={() => setIsNewProjectModalOpen(false)}
					refetch={list.refetch}
				/>
			</div>
		);
	}

	return (
		<div>
			<PageHeader
				breadcrumb={[{ title: 'Projects' }, { title: 'foo1' }, { title: 'foo2' }]}
				right={<Button onClick={() => setIsNewProjectModalOpen(true)}>New project</Button>}
			/>

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
						title: 'Name',
						dataIndex: 'name',
						key: 'name',
					},
					{
						title: 'Action',
						render: record => (
							<Space>
								<Link href={'/projects/' + record.id}>Detail</Link>
								<Popconfirm
									title="Delete the project"
									description="Are you sure to delete this proect?"
									onConfirm={async () => {
										await remove.mutateAsync({ id: record.id });
										await list.refetch();
									}}
									okText="Yes"
									cancelText="No"
								>
									<Button>Remove</Button>
								</Popconfirm>
							</Space>
						),
					},
				]}
			/>
			<NewProjectModal
				isOpen={isNewProjectModalOpen}
				onClose={() => setIsNewProjectModalOpen(false)}
				refetch={list.refetch}
			/>
		</div>
	);
};

export default Projects;
