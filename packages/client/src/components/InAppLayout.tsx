import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout as LayoutAntd, Menu, theme } from 'antd';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Sider, Content } = LayoutAntd;

const StyledLayout = styled(LayoutAntd)`
	height: 100vh;
`;

export const InAppLayout: React.FC = () => {
	const { pathname } = useLocation();

	const isHomePage = pathname === '/';

	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<StyledLayout>
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
							label: <Link to="/">Home</Link>,
						},
						{
							key: '2',
							icon: <VideoCameraOutlined />,
							label: <Link to="/templates">Templates</Link>,
						},
						{
							key: '3',
							icon: <UploadOutlined />,
							label: <Link to="/contacts">Contacts</Link>,
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
						background: isHomePage ? undefined : colorBgContainer,
						borderRadius: isHomePage ? undefined : borderRadiusLG,
					}}
				>
					<Outlet />
				</Content>
			</LayoutAntd>
		</StyledLayout>
	);
};
