import { useEffect, useState } from 'react';
import { Button, Card, Input, List, Flex, Space, Typography } from 'antd';
import { SearchOutlined, PlusOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { listLeads } from "../../services/leads.js";
import { listEmails } from "../../services/emails.js";
import toast from "../../components/Toast.js";

const { Title } = Typography;

export default function DatabaseList() {
	const [items, setItems] = useState([
		{
			id: 1,
			name: "Leads",
			count: 0,
			updatedAt: null,
			createUrl: "/leads",
		},
		{
			id: 2,
			name: "Emails",
			count: 0,
			updatedAt: null,
			createUrl: "/emails",
		},
	]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const [leadsRes, emailsRes] = await Promise.all([
					listLeads(),
					listEmails(),
				]);
				const leads = leadsRes?.data?.leads || [];
				const emails = emailsRes?.data?.emails || [];
				const lastUpdated = (arr) =>
					arr.reduce((acc, x) => {
						const t = new Date(
							x.updatedAt || x.sentAt || x.createdAt || 0
						).getTime();
						return t > acc ? t : acc;
					}, 0);
				setItems([
					{
						id: 1,
						name: "Leads",
						count: leads.length,
						updatedAt: lastUpdated(leads) || null,
						createUrl: "/leads",
					},
					{
						id: 2,
						name: "Emails",
						count: emails.length,
						updatedAt: lastUpdated(emails) || null,
						createUrl: "/emails",
					},
				]);
			} catch (err) {
				const detail =
					err?.response?.data?.message ||
					"Failed to load database counts";
				toast.error(detail);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	return (
		<div className="page-container">
			<div className="page-header">
				<Title level={2} style={{ margin: 0 }}>
					Databases
				</Title>
				<Flex justify="flex-end">
					<Input
						placeholder="Search databases..."
						prefix={<SearchOutlined />}
						style={{ width: 250 }}
					/>
					<Button type="primary" icon={<PlusOutlined />}>
						New Database
					</Button>
				</Flex>
			</div>

			<Card className="page-content">
				<List
					itemLayout="horizontal"
					loading={loading}
					dataSource={items}
					renderItem={(item) => (
						<List.Item
							actions={[
								<Link
									to={`/databases/${item.id}`}
									key="view"
									state={{ createUrl: item.createUrl }}
								>
									View
								</Link>,
								<a key="edit">Edit</a>,
								<a key="delete" style={{ color: "#ff4d4f" }}>
									Delete
								</a>,
							]}
						>
							<List.Item.Meta
								avatar={
									<DatabaseOutlined
										style={{ fontSize: 24 }}
									/>
								}
								title={
									<Link
										to={`/databases/${item.id}`}
										state={{ createUrl: item.createUrl }}
									>
										{item.name}
									</Link>
								}
								description={
									<Space size="large">
										<span>{item.count} records</span>
										<span>
											{item.updatedAt
												? `Updated ${new Date(
														item.updatedAt
												  ).toLocaleDateString()}`
												: "No updates yet"}
										</span>
									</Space>
								}
							/>
						</List.Item>
					)}
				/>
			</Card>
		</div>
	);
}

