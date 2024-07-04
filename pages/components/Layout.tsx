import css from '@/styles/Layout.module.css';
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout as LayoutAntd, Menu, theme } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

const { Header, Sider, Content } = LayoutAntd;

interface Props {
	children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<LayoutAntd className={css.root}>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				LOGO
				<div className="demo-logo-vertical" />
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={['1']}
					items={[
						{
							key: '0',
							icon: <UserOutlined />,
							label: <Link href="/">Home</Link>,
						},
						{
							key: '2',
							icon: <VideoCameraOutlined />,
							label: <Link href="/templates">Templates</Link>,
						},
						{
							key: '3',
							icon: <UploadOutlined />,
							label: <Link href="/contacts">Contacts</Link>,
						},
					]}
				/>
			</Sider>
			<LayoutAntd>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: '16px',
							width: 64,
							height: 64,
						}}
					/>
				</Header>
				<Content
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
					}}
				>
					{children}
				</Content>
			</LayoutAntd>
		</LayoutAntd>
	);
};
