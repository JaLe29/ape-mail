import { Breadcrumb, Button as ButtonA } from 'antd';
import type { NextPage } from 'next';

const Templates: NextPage = () => {
	return (
		<div>
			<Breadcrumb items={[{ title: 'Templates' }]} />
			<ButtonA>Templates</ButtonA>
		</div>
	);
};

export default Templates;
