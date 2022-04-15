import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserContext } from '../context';
import { ModalProvider } from 'styled-react-modal';

import Page from '../components/page/page-component';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient();
	const [user, setUser] = useState(null);
	useEffect(() => {
		if (user !== null) {
			sessionStorage.setItem('user', JSON.stringify(user));
		}
	});
	useEffect(() => {
		setUser(
			sessionStorage.getItem('user') !== null
				? JSON.parse(
						//@ts-ignore
						sessionStorage.getItem('user')
				  )
				: null
		);
	}, []);
	return (
		<>
			<Head>
				<title>Заказать праздник, еду, развлечения</title>
			</Head>
			<QueryClientProvider client={queryClient}>
				<UserContext.Provider value={{ user, setUser }}>
					<ModalProvider>
						<Page>
							<Component {...pageProps} />
						</Page>
					</ModalProvider>
				</UserContext.Provider>
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
