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
import Modal from 'styled-react-modal';
import Select from 'react-select';

const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;
interface IProps {
	width: Number;
}
const Button = styled.button`
	width: ${(props) => (props.width ? props.width : 110)}px;
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
const ButtonSubmit = styled.button`
	width: ${(props) => (props.width ? props.width : 110)}px;
	border-radius: 4px;
	height: 38px;
	border: none;
	background: #c1c1c4;
	color: white
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
const Selector = styled(Select)`
	margin: 0 5px 0 5px;
	font-weight: 600;
	width: ${(props) => props.width}%;
	margin-bottom: 15px;
	text-align: center;
	.css-1s2u09g-control {
		background-color: #white;
		border: 1px dotted black;
		min-width: 225px;
	}
	.css-1pahdxg-control {
		background-color: #white;
		border: 1px dotted black;
		min-width: 225px;
	}
	.css-tlfecz-indicatorContainer {
		display: none;
	}
	.css-14el2xx-placeholder {
		color: black;
	}
	.css-qc6sy-singleValue {
		color: black;
	}
	.css-1gtu0rj-indicatorContainer {
		display: none;
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
	display: flex;
	align-items: flex-end;
	justify-content: center;
`;
const Model = Modal.styled`
	width: 30%;	
	height: 70%;
	background-color: white;
	border-radius: 15px;
`;
const Input = styled.input`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 0.3px dotted gray;
	background-color: white;
	margin-bottom: 15px;
	height: ${(props) => (props.height ? props.height : 5)}%;
	width: ${(props) => props.width}%;
`;
const BigInput = styled.textarea`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 0.3px dotted gray;
	background-color: white;
	margin-bottom: 15px;
	height: ${(props) => (props.height ? props.height : 5)}%;
	width: ${(props) => props.width}%;
	resize: none;
`;
const Form = styled.form`
	display: flex;
	margin: 15px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: none;
	height: 100%;
	h1 {
		display: flex;
		padding-bottom: 5px;
		justify-content: center;
		align-items: center;
		width: 70%;
		border-bottom: 1px dotted black;
	}
`;
const Entertainment: React.FC = () => {
	interface IEntertainment {
		name: string;
		price: string;
		workTime: string;
		description: string;
	}
	interface IEntertainmentList {
		_id: string;
		name: string;
	}
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	const [entertainmentsList, setEntertainmentsList] = useState([]);

	const [openModal, setOpenModal] = useState(false);
	const [name, setName] = useState(user?.fullName);
	const [entField, setEntField] = useState('');
	const [description, setDescription] = useState('');
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
	useQuery(
		'entertainments',
		async () => {
			return await axios.get(`http://localhost:5000/entertainment`);
		},
		{
			onSuccess: (e) => {
				setEntertainmentsList(
					e.data?.map((item: IEntertainmentList) => ({
						value: item?._id,
						label: item?.name,
					}))
				);
			},
		}
	);
	const toggleModal = (e: React.SyntheticEvent) => {
		setOpenModal(!openModal);
	};
	const submit = (e) => {
		e.preventDefault();
		console.log({
			id: user._id,
			name,
			entField,
			description,
		});
	};
	return (
		<Page>
			<ModalContent>
				<Model isOpen={openModal} onBackgroundClick={toggleModal}>
					<Form onSubmit={(e) => submit(e)}>
						<h1>Заказать развлечение</h1>
						<Input
							value={name}
							placeholder={'Имя'}
							width={75}
							onChange={(e) => {
								setName(e.target.value);
							}}
						/>
						<Input
							value={name}
							placeholder={'Дата и время'}
							width={75}
							onChange={(e) => {
								setName(e.target.value);
							}}
						/>
						<Selector
							options={entertainmentsList}
							isSearchable={false}
							width={75}
							placeholder={'Выбрать вид развлечения'}
							onChange={(e: any) => {
								// console.log(e);
								setEntField(e.label);
							}}
						/>
						<BigInput
							value={description}
							placeholder={'Описание'}
							width={75}
							height={30}
							onChange={(e) => {
								setDescription(e.target.value);
							}}
						/>
						<ButtonSubmit
							width={300}
							onClick={() => {
								if (!user?.login) {
									toast.error('Нужно войти в учетную запись для создания заказа');
								} else {
									setOpenModal(true);
								}
							}}
						>
							Заказать
						</ButtonSubmit>
					</Form>
				</Model>
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
						width={300}
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
