import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';
import NewsComponent from '../components/news/news-component';
import axios from 'axios';
import { useQuery } from 'react-query';
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
	display: flex;
	width: 100%;
	gap: 45px;
	text-align: center;
	justify-content: center;
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
			onSuccess: (e) => {
				console.log(e.data);
				setNews(e.data.reverse());
			},
		}
	);
	return (
		<Page>
			<PhotoBackground>
				<Button>Консультация</Button>
			</PhotoBackground>
			<Span>Новости и акции</Span>
			<NewsContainer>
				{news.map((item) => (
					<NewsComponent
						//@ts-ignore
						name={item?.name}
						//@ts-ignore
						picture={item?.picture}
						//@ts-ignore
						description={item?.description}
					/>
				))}
			</NewsContainer>
		</Page>
	);
};

export default Home;
