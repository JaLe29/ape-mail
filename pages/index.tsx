import { trpc } from '@/utils/trpc';
import { Card, Col, Row } from 'antd';
import type { NextPage } from 'next';
const style: React.CSSProperties = { padding: '8px 0' };

interface MyCardProps {
	title: string;
	description: string;
	isLoading?: boolean;
}
const MyCard: React.FC<MyCardProps> = ({ title, description, isLoading = false }) => {
	return (
		<Card style={style} title={title} size="small" bordered={false} loading={isLoading}>
			{description}
		</Card>
	);
};
const Home: NextPage = () => {
	const totalEmails = trpc.message.totalEmails.useQuery();
	const totalEmailsToday = trpc.message.totalEmailsToday.useQuery();
	const totalEmailsLastWeek = trpc.message.totalEmailsLastWeek.useQuery();
	const totalEmailsLastHour = trpc.message.totalEmailsLastHour.useQuery();

	const totalContacts = trpc.contact.totalContacts.useQuery();
	const totalContactsToday = trpc.contact.totalContactsToday.useQuery();
	const totalContactsLastWeek = trpc.contact.totalContactsLastWeek.useQuery();
	const totalContactsLastHour = trpc.contact.totalContactsLastHour.useQuery();

	return (
		<div>
			<Row gutter={16}>
				<Col span={6}>
					<MyCard
						title="Total e-mails"
						description={totalEmails.data + '' ?? '-'}
						isLoading={totalEmails.isLoading}
					/>
				</Col>
				<Col span={6}>
					<MyCard
						title="Total e-mails today"
						description={totalEmailsToday.data + '' ?? '-'}
						isLoading={totalEmailsToday.isLoading}
					/>
				</Col>
				<Col span={6}>
					<MyCard
						title="Total e-mails last week"
						description={totalEmailsLastWeek.data + '' ?? '-'}
						isLoading={totalEmailsLastWeek.isLoading}
					/>
				</Col>
				<Col span={6}>
					<MyCard
						title="Total e-mails last hour"
						description={totalEmailsLastHour.data + '' ?? '-'}
						isLoading={totalEmailsLastHour.isLoading}
					/>
				</Col>
			</Row>
			<br />
			<Row gutter={16}>
				<Col span={6}>
					<MyCard
						title="Total contacts"
						description={totalContacts.data + '' ?? '-'}
						isLoading={totalContacts.isLoading}
					/>
				</Col>
				<Col span={6}>
					<MyCard
						title="Total contacts today"
						description={totalContactsToday.data + '' ?? '-'}
						isLoading={totalContactsToday.isLoading}
					/>
				</Col>
				<Col span={6}>
					<MyCard
						title="Total contacts last week"
						description={totalContactsLastWeek.data + '' ?? '-'}
						isLoading={totalContactsLastWeek.isLoading}
					/>
				</Col>
				<Col span={6}>
					<MyCard
						title="Total contacts last hour"
						description={totalContactsLastHour.data + '' ?? '-'}
						isLoading={totalContactsLastHour.isLoading}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default Home;
