import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/cs';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { InAppLayout } from './components/InAppLayout';
import { ContactsPage } from './pages/ContactsPage';
import { HomePage } from './pages/HomePage';
import { TemplateEditorPage } from './pages/TemplateEditorPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { trpc, trpcClient } from './utils/trcp';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

const App: React.FC = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route element={<InAppLayout />} path="/">
					<Route path="" Component={HomePage} />
					<Route path="/templates" Component={TemplatesPage} />
					<Route path="/templates/:id" Component={TemplateEditorPage} />
					<Route path="/contacts" Component={ContactsPage} />
				</Route>
			</>,
		),
	);

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#2875ea',
					colorSuccess: '#52c41a',
					colorWarning: '#faad14',
					colorError: '#ff4d4f',
					colorInfo: '#2875ea',
				},
			}}
		>
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</trpc.Provider>
		</ConfigProvider>
	);
};

export default App;
