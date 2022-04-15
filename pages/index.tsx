import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';
import NewsComponent from '../components/news/news-component';
import axios from 'axios';
import { useQuery } from 'react-query';
import HolidayOrder from '../components/forms/holiday-order.component';
import BanquetModal from '../components/modal/banquet-modal.component';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatComponent from '../components/chat-component/chat.component';
const Form = styled.div`
	min-height: 150px;
	width: 200px;
	display: flex;
	flex-direction: column;
`;
const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;
const PhotoBackground = styled.div`
	width: 100%;
	height: 220px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #e6e1e1;
`;
const NewsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 1em;
	justify-items: center;
`;
const Button = styled.button`
	border-radius: 4px;
	width: 245px;
	font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
		Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
	font-weight: 600;
	height: 63px;
	background: #c4c4c4;
	border: none;
	&:hover {
		cursor: pointer;
	}
`;
const Span = styled.span`
	width: 100%;
	justify-content: center;
	display: flex;
	margin: 2em 0em 2em 0em;
`;

const Home: NextPage = () => {
	const [news, setNews] = useState([]);
	useQuery(
		'get-news',
		async () => {
			return await axios.get(`http://localhost:5000/news`);
		},
		{
			refetchInterval: 3000,
			onSuccess: (e) => {
				setNews(e.data.reverse());
			},
		}
	);

	const toBase64 = (file: Blob) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	return (
		<Page>
			<PhotoBackground>
				<Button>Консультация</Button>
			</PhotoBackground>
			<Span>Новости и акции</Span>
			<NewsContainer>
				{news.slice(0, 5).map((item, i) => (
					<NewsComponent
						key={`news-component-${i}`}
						name={item?.name}
						picture={item?.picture}
						description={item?.description}
						id={item?._id}
						item={item}
					/>
				))}
				<ToastContainer position='bottom-left' theme='dark' />
			</NewsContainer>
			<Span>Показаны последние 5 новостей</Span>
		</Page>
	);
};

export default Home;
