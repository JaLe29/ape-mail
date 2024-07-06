/* eslint-disable react/no-array-index-key */
import { Button, Space } from 'antd';

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledSpace = styled(Space)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 1em;
	padding-bottom: 2em;
	width: 100%;
`;

interface Props {
	breadcrumb: { title: string; path?: string }[];
	right?: React.ReactNode;
}

export const PageHeader = ({ breadcrumb, right }: Props) => (
	<StyledSpace>
		<div>
			{breadcrumb.map((item, index) => {
				const isLast = index === breadcrumb.length - 1;
				const withLink = (node: React.ReactNode) => {
					if (item.path) {
						return <Link to={item.path}>{node}</Link>;
					}
					return node;
				};

				const element = withLink(
					<Button size="small" type="link" key={index}>
						{item.title}
					</Button>,
				);

				if (isLast) {
					return withLink(element);
				}

				return (
					<React.Fragment key={index}>
						{element}
						<span> / </span>
					</React.Fragment>
				);
			})}
		</div>
		{right}
	</StyledSpace>
);
