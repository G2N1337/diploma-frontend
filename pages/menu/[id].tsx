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
	height: 250px;
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	background-color: #e6e1e1;
	background-image: url('https://www.sgu.ru/sites/default/files/depnews/image/2015/02/-.png');
	background-repeat: no-repeat;
	background-size: cover; /* Resize the background image to cover the entire container */
	background-position: center; /* Center the image */

	h1 {
		background: #c1c1c1;
		border-radius: 4px;
		padding: 10px;
		backdrop-filter: blur(10px);
	}
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
const Menu: React.FC = () => {
	interface IMenu {
		name: string;
		price: string;
		count: string;
		description: string;
	}
	const [menuTypes, setMenuTypes] = useState<IMenu>();
	const [menus, setMenus] = useState([]);
	const router = useRouter();
	useQuery(
		'menu-types',
		async () => {
			return await axios.get(`http://localhost:5000/menu/type`);
		},
		{
			onSuccess: (e) => {
				console.log(e.data);
				setMenuTypes(e.data);
				// setMenus(Object.keys.e.data.filter((item) => {
				// 	return
				// }
				// )
				// );
				const newArr = e.data.map((item) => {
					console.log(Object.keys(item));
				});
			},
		}
	);

	return (
		<Page>
			<Headline>
				<h1>name</h1>
			</Headline>
			<Container>
				<InfoContainer>
					<InfoBox>
						<p>name</p>
						<p>price рублей</p>
						<p>count</p>
					</InfoBox>
					<Paragraph>{menuTypes?.description}</Paragraph>
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
export default Menu;
// export async function getStaticPaths() {
// 	const list = await axios.get(`http://localhost:5000/menu`);
// 	interface IMenu {
// 		_id: string;
// 	}
// 	return list.data?.map((item: IMenu) => ({
// 		params: {
// 			id: item?._id,
// 		},
// 	}));
// }
// export const getStaticProps: GetStaticProps = async (
// 	context: GetStaticPropsContext
// ) => {
// 	return {
// 		props: {
// 			key: context.params?.id,
// 		},
// 	};
// };
