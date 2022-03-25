import styled from 'styled-components';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../../context';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const Button = styled.button`
	width: 110px;
	border-radius: 4px;
	height: 38px;
	border: none;
	background: #fff;
	font-weight: 600;
	margin-top: 15px;
	font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
		Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
	margin-left: 25px;
	margin-right: 25px;

	&:hover {
		cursor: pointer;
	}
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
const ModalContent = styled.div`
	.ReactModal__Content {
		width: fit-content;
	}
`;
const Entertainment: React.FC = () => {
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	const [openModal, setOpenModal] = useState(false);
	interface IEntertainment {
		name: string;
		price: string;
		workTime: string;
		description: string;
	}
	const [entertainments, setEntertainments] = useState<IEntertainment>();
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
			<ModalContent>
				<Modal isOpen={openModal} contentLabel='Example Modal'>
					<p>пидарок</p>
				</Modal>
			</ModalContent>
			<Headline>
				<h1>{entertainments?.name}</h1>
			</Headline>
			<Container>
				<InfoContainer>
					<InfoBox>
						<p>{entertainments?.name}</p>
						<p>{entertainments?.price} рублей</p>
						<p>{entertainments?.workTime}</p>
					</InfoBox>
					<Paragraph>{entertainments?.description}</Paragraph>
					<Button
						onClick={() => {
							if (!user?.login) {
								toast.error('Нужно войти в учетную запись для создания заказа');
							} else {
								setOpenModal(true);
							}
						}}
					>
						Заказать
					</Button>
				</InfoContainer>
			</Container>
			<ToastContainer position='bottom-left' theme='dark' />
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
// export async function getStaticPaths() {
// 	const list = await axios.get(`http://localhost:5000/entertainment`);
// 	interface IEntertainment {
// 		_id: string;
// 	}
// 	return list.data?.map((item: IEntertainment) => ({
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
