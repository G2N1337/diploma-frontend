import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;
const Headline = styled.div`
	height: 220px;
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	background-color: #e6e1e1;
`;
const Container = styled.div`
	background-color: #c4c4c4;
	height: 100%;
	width: 100%;
`;
const InfoBox = styled.div`
	background-color: #e6e1e1;
	width: 30em;
	height: 15em;
	padding: 50px;
`;
const InfoContainer = styled.div`
	margin: 40px 0 0 48px;
	display: flex;
	flex-direction: row;
	gap: 10em;
`;
const Paragraph = styled.p`
	width: 350px;
`;
const Entertainment: React.FC = () => {
	interface IEntertainment {
		name: string;
		price: string;
		workTime: string;
		description: string;
	}
	const [entertainments, setEntertainments] = useState<IEntertainment>({});
	const router = useRouter();
	const { id } = router.query;
	useQuery(
		'entertainment',
		async () => {
			return await axios.get(`http://localhost:5000/entertainment/${id}`);
		},
		{
			onSuccess: (e) => {
				console.log(e.data);
				setEntertainments(e.data);
			},
		}
	);

	return (
		<Page>
			<Headline>
				<h1>{entertainments.name}</h1>
			</Headline>
			<Container>
				<InfoContainer>
					<InfoBox>
						<p>{entertainments.name}</p>
						<p>{entertainments.price} рублей</p>
						<p>{entertainments.workTime}</p>
					</InfoBox>
					<Paragraph>{entertainments.description}</Paragraph>
				</InfoContainer>
			</Container>
		</Page>
	);
};
export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	return {
		props: {
			key: context.params?.id,
		},
	};
};
export default Entertainment;
