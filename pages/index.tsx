import { Breadcrumb, Button as ButtonA } from 'antd';
import type { NextPage } from 'next';

const Home: NextPage = () => {
	return (
		<div>
			<Breadcrumb items={[{ title: 'Home' }]} />
			<ButtonA>Button</ButtonA>
		</div>
	);
};

export default Home;
