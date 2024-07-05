import css from '@/styles/PageHeader.module.css';
import { Button, Space } from 'antd';
import Link from 'next/link';
import React from 'react';
interface Props {
	breadcrumb: { title: string; path?: string }[];
	right?: React.ReactNode;
}

export const PageHeader = ({ breadcrumb, right }: Props) => {
	return (
		<Space className={css.root}>
			<div>
				{breadcrumb.map((item, index) => {
					const isLast = index === breadcrumb.length - 1;
					const withLink = (node: React.ReactNode) => {
						if (item.path) {
							return <Link href={item.path}>{node}</Link>;
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
		</Space>
	);
};
