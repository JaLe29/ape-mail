import { Breadcrumb, Button as ButtonA } from 'antd';
import type { NextPage } from 'next';

const Users: NextPage = () => {
	return (
		<div>
			<Breadcrumb items={[{ title: 'Users' }]} />
			<ButtonA>Users</ButtonA>
		</div>
	);
};

export default Users;
