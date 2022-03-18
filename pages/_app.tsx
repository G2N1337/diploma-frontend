import '../styles/globals.css';
import type { AppProps } from 'next/app';
import HeaderComponent from '../components/header/header-component';

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

export default MyApp;
