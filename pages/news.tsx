import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import NewsComponent from '../components/news/news-component';
import 'react-toastify/dist/ReactToastify.css';

const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;
const NewsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 1em;
	justify-items: center;
`;
const NewsPage = () => {
	const [news, setNews] = useState([]);
	useQuery(
		'get-news',
		async () => {
			return await axios.get(`http://localhost:5000/news`);
		},
		{
			onSuccess: (e) => {
				setNews(e.data.reverse());
			},
		}
	);
	return (
		<Page>
			<h1>Новости и акции</h1>;
			<NewsContainer>
				{news.map((item, i) => (
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
		</Page>
	);
};
export default NewsPage;
