import css from '@/styles/PageHeader.module.css';
import { Breadcrumb, Space } from 'antd';
import { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb';
interface Props {
	breadcrumb: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[];
	right?: React.ReactNode;
}

export const PageHeader = ({ breadcrumb, right }: Props) => {
	return (
		<Space className={css.root}>
			<Breadcrumb items={breadcrumb} />
			{right}
		</Space>
	);
};
