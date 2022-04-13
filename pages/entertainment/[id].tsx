import styled from 'styled-components';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../../context';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'styled-react-modal';
import Select from 'react-select';
import { imageOptimizer } from 'next/dist/server/image-optimizer';
import EntertainmentContainer from '../../components/entertainment-container.component/entertainment-container.component';

const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;
interface IProps {
	width: Number;
}
const Button = styled.button<{ width?: number }>`
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
const ButtonSubmit = styled.button<{ width?: number }>`
	width: ${(props) => (props.width ? props.width : 110)}px;
	border-radius: 4px;
	height: 38px;
	border: none;
	background-color: black;
	/* background: #c1c1c4; */
	color: white;
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
const Selector = styled(Select)<{ width?: number }>`
	margin: 0 5px 0 5px;
	font-weight: 600;
	width: ${(props) => props.width}%;
	margin-bottom: 15px;
	text-align: center;
	.css-1s2u09g-control {
		background-color: white;
		border: 1px dotted black;
		min-width: 225px;
	}
	.css-1pahdxg-control {
		background-color: white;
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
export const ModalContent = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: center;
`;
export const Model = Modal.styled`
	width: 30%;	
	height: 95%;
	background-color: white;
	border-radius: 15px;
`;
const PriceLabel = styled.label`
	margin: 0;
	font-size: 10pt;
`;
const Input = styled.input<{
	width?: number;
	height?: number;
	onChange?: (e: any) => void;
}>`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 0.3px dotted gray;
	background-color: white;
	margin-bottom: 15px;
	height: ${(props) => (props.height ? props.height : 5)}%;
	width: ${(props) => props.width}%;
`;

const BigInput = styled.textarea<{
	width?: number;
	height?: number;
	onChange?: (e: any) => void;
}>`
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
		price: string | number;
		workTime: string;
		description: string;
		_id: string;
		image: string;
	}
	interface IEntertainmentList {
		_id: string;
		name: string;
	}
	interface IOrderItem {
		value: string;
		time: number;
	}
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	const [entertainmentsList, setEntertainmentsList] = useState([]);
	const [order, setOrder] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openFormModal, setOpenFormModal] = useState(false);
	const [openAddModal, setOpenAddModal] = useState(false);
	const [unique, setUnique] = useState(false);
	const [entField, setEntField] = useState('');
	const [description, setDescription] = useState('');
	const [priceData, setPriceData] = useState<number>(0);
	const [time, setTime] = useState('');
	const [date, setDate] = useState('');
	const [entertainments, setEntertainments] = useState<IEntertainment>();
	const [entArr, setEntArr] = useState<IEntertainment>();
	// admin
	const [name, setName] = useState(entertainments?.name);
	const [price, setPrice] = useState(entertainments?.price);
	const [descriptionA, setDescriptionA] = useState(entertainments?.description);
	const [workTime, setWorkTime] = useState(entertainments?.workTime);
	const [image, setImage] = useState(entertainments?.image);

	const router = useRouter();
	const { id } = router.query;
	useQuery(
		'entertainment',
		async () => {
			return await axios.get(`http://localhost:5000/entertainment/${id}`);
		},
		{
			onSuccess: (e) => {
				setEntertainments(e.data);
				setName(e.data.name);
				setPrice(e.data.price);
				setDescriptionA(e.data.description);
				setWorkTime(e.data.workTime);
				setImage(e.data.image);
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
				setEntArr(e.data);
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
	const toggleModalEdit = (e: React.SyntheticEvent) => {
		setOpenFormModal(!openFormModal);
	};
	const toggleModalAdd = (e: React.SyntheticEvent) => {
		setOpenAddModal(!openAddModal);
	};
	const mutation = useMutation(
		async () => {
			console.log('xuy');
			return await axios.post(
				`http://localhost:5000/entorder`,
				{
					id,
					name: 'Заказ ' + Math.round(Math.random() * 10000).toString(),
					entertainments: JSON.stringify(order),
					price: 0,
					workTime: date,
					description,
					unique,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('token')}`,
					},
				}
			);
		},
		{
			onSuccess: (e) => {
				toast.success(
					`Заявка на проведение развлечения успешно отправлена! Название: ${e.data.name}.`
				);
				console.log(e);
			},
		}
	);
	const mutationAdd = useMutation(
		async () => {
			return await axios.post(
				`http://localhost:5000/entertainment`,
				{
					id,
					name: name,
					description: descriptionA,
					price: price,
					workTime: workTime,
					image: image,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('token')}`,
					},
				}
			);
		},
		{
			onSuccess: (e) => {
				toast.success(`Успешно добавлено!`);
				console.log(e);
				router.push('/');
			},
		}
	);
	const mutationEdit = useMutation(
		async () => {
			return await axios.put(
				`http://localhost:5000/entertainment/${id}`,
				{
					id,
					name: name,
					description: descriptionA,
					price: price,
					workTime: workTime,
					image: image,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('token')}`,
					},
				}
			);
		},
		{
			onSuccess: (e) => {
				toast.success(`Успешно изменено`);
				console.log(e);
				router.push('/');
			},
		}
	);
	const submitAdmin = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (name) {
			//@ts-ignore
			mutationEdit.mutate({
				id,
				name: name,
				description: descriptionA,
				price: price,
				workTime: workTime,
				image: image,
			});
		}
	};
	const submitAdd = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (name) {
			//@ts-ignore
			mutationAdd.mutate({
				id,
				name: name,
				description: descriptionA,
				price: price,
				workTime: workTime,
				image: image,
			});
		}
	};
	const submit = (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (order.length > 0 && date) {
			//@ts-ignore
			mutation.mutate({
				id: user._id,
				name: 'Заказ ' + Math.round(Math.random() * 10000).toString(),
				entertainments: JSON.stringify(order),
				price: 0,
				workTime: date,
				description: description,
				unique: unique,
			});
		}

		if (order.length < 1) {
			toast.error('Добавьте развлечения!');
		}
		if (time && parseInt(time) < 1) {
			toast.error('Укажите правильное время!');
		}
		if (!date) {
			toast.error('Укажите дату!');
		}
	};

	return (
		<Page>
			<ModalContent>
				<Model isOpen={openFormModal} onBackgroundClick={toggleModalEdit}>
					<Form onSubmit={submitAdmin}>
						<h1>Изменить развлечение {entertainments?.name}</h1>
						<Input
							width={75}
							value={name}
							onChange={(e) => {
								setName(e.target.value);
							}}
							placeholder='Название'
						/>
						<Input
							width={75}
							value={price}
							onChange={(e) => {
								setPrice(e.target.value);
							}}
							placeholder='Цена'
						/>
						<Input
							width={75}
							value={workTime}
							onChange={(e) => {
								setWorkTime(e.target.value);
							}}
							placeholder='Время работы'
						/>
						<Input width={75} placeholder='Картинка' />

						<BigInput
							placeholder={'Описание'}
							width={75}
							value={descriptionA}
							onChange={(e) => {
								setDescriptionA(e.target.value);
							}}
							height={30}
						/>
						<Button type='submit'>Подтвердить</Button>
					</Form>
				</Model>
				<Model isOpen={openAddModal} onBackgroundClick={toggleModalAdd}>
					<Form onSubmit={submitAdd}>
						<h1>Добавить новое развлечение</h1>
						<Input
							width={75}
							value={name}
							onChange={(e) => {
								setName(e.target.value);
							}}
							placeholder='Название'
						/>
						<Input
							width={75}
							value={price}
							onChange={(e) => {
								setPrice(e.target.value);
							}}
							placeholder='Цена'
						/>
						<Input
							width={75}
							value={workTime}
							onChange={(e) => {
								setWorkTime(e.target.value);
							}}
							placeholder='Время работы'
						/>
						<Input width={75} placeholder='Картинка' />

						<BigInput
							placeholder={'Описание'}
							width={75}
							value={descriptionA}
							onChange={(e) => {
								setDescriptionA(e.target.value);
							}}
							height={30}
						/>
						<Button type='submit'>Подтвердить</Button>
					</Form>
				</Model>
				<Model isOpen={openModal} onBackgroundClick={toggleModal}>
					<Form onSubmit={(e) => submit(e)}>
						<h1>Заказать развлечение</h1>

						<Input
							type='date'
							value={date}
							placeholder={'День'}
							width={75}
							onChange={(e) => {
								setDate(e.target.value);
							}}
						/>

						{entArr?.map((item) => (
							<EntertainmentContainer
								key={item._id}
								item={item}
								orderList={order}
								setOrderList={(items) => setOrder(items)}
							/>
						))}
						<BigInput
							value={description}
							placeholder={'Описание'}
							width={75}
							height={20}
							onChange={(e) => {
								setDescription(e.target.value);
							}}
						/>
						<div>
							<label>Не включать в заказ праздника (заказать отдельно)</label>
							<input
								type='checkbox'
								checked={unique}
								onChange={(e) => {
									setUnique(!unique);
								}}
							></input>
						</div>

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
				{user?.role === 'admin' && (
					<>
						<Button
							onClick={() => {
								setOpenFormModal(true);
							}}
						>
							Изменить
						</Button>
						<Button
							onClick={() => {
								setOpenAddModal(true);
							}}
						>
							Добавить
						</Button>
						<Button
							style={{ backgroundColor: 'red', color: 'white' }}
							onClick={() => {
								axios
									.delete(`http://localhost:5000/entertainment/${id}`, {
										headers: {
											Authorization: `Bearer ${sessionStorage.getItem('token')}`,
										},
									})
									.then(() => {
										console.log('удалино');
									});
								router.reload();
							}}
						>
							Удалить
						</Button>
					</>
				)}
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
