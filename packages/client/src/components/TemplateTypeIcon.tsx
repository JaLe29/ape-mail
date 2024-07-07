import { BookOutlined, CrownOutlined } from '@ant-design/icons';
import { TemplateType } from '@ape-mail/shared';
import { Tooltip } from 'antd';

interface Props {
	type: TemplateType;
}

export const TemplateTypeIcon: React.FC<Props> = ({ type }) => {
	switch (type) {
		case TemplateType.ROOT:
			return (
				<Tooltip placement="top" title="Root template">
					<CrownOutlined />
				</Tooltip>
			);
		case TemplateType.CHILD:
			return (
				<Tooltip placement="top" title="Child template">
					<BookOutlined />
				</Tooltip>
			);
		default:
			return null;
	}
};
