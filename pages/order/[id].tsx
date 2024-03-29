import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import React, { useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { UserContext } from '../../context';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'styled-react-modal';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import ChatComponent from '../../components/chat-component/chat.component';
import InputMask from 'react-input-mask';
import RatingForm from '../../components/place-rating';
import EditOrder from '../../components/forms/edit-order.component';

interface IWHData {
	width?: number;
	height?: number;
}

interface IMenu {
	name: string;
	price: string;
	count: string;
	menu: any;
	description: string;
}

export interface IOrderItem {
	menu: string;
	price: number;
	name: string;
}

const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	margin: 15px;
`;
const ButtonSubmit = styled.button<IWHData>`
	width: ${(props) => (props.width ? props.width : 110)}px;
	border-radius: 4px;
	height: 38px;
	border: none;
	background: #c1c1c4;
	color: white;
	font-weight: 600;
	margin-top: 15px;
	font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
		Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
	margin-left: 25px;
	margin-right: 25px;

	cursor: pointer;

	&:hover {
		cursor: pointer;
	}
`;
const Button = styled.button<IWHData>`
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
	border-bottom: 1px dotted #c1c1c1;
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
display:flex;
justify-content:center;
align-items:center;
`;
const PriceLabel = styled.label`
	margin: 0;
	font-size: 10pt;
`;
const Selector = styled(Select)<IWHData>`
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
const Input = styled.input<IWHData>`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 0.3px dotted gray;
	background-color: white;
	margin-bottom: 15px;
	height: ${(props) => (props.height ? props.height : 5)}%;
	width: ${(props) => props.width}%;
`;
const InputMaske = styled(InputMask)<IWHData>`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 0.3px dotted gray;
	background-color: white;
	margin-bottom: 15px;
	height: ${(props) => (props.height ? props.height : 5)}%;
	width: ${(props) => props.width}%;
`;
const BigInput = styled.textarea<{ height: number; width: number }>`
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
const EntertainmentList = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
`;
const EntertainmentContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	border-bottom: 1px dotted black;
`;
const Menu: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const [openModal, setOpenModal] = useState(false);
	const [openPaymentModal, setOpenPaymentModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	const [name, setName] = useState(user?.fullName);
	const [menu, setMenu] = useState<any[]>([]);
	const [cardNumber, setCardNumber] = useState('');
	const [date, setDate] = useState('');
	const [cvv, setCvv] = useState('');
	const [cardName, setCardName] = useState('');
	const [success, setSuccess] = useState(false);

	//Заказ
	const [order, setOrder] = useState<IOrder>();

	const toggleRatingModal = (e: React.SyntheticEvent) => {
		setOpenModal(!openModal);
	};
	const togglePaymentModal = (e: React.SyntheticEvent) => {
		setOpenPaymentModal(!openPaymentModal);
	};
	const toggleEditModal = () => {
		setEditModal(!editModal);
	};
	const submitHandler = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (
			cardNumber.replace(/\D/g, '').length === 16 &&
			cvv.replace(/\D/g, '').length === 3 &&
			date.replace(/\D/g, '').length === 4 &&
			cardName.length > 2
		) {
			console.log({
				cardNumber,
				cvv,
				date,
				cardName,
			});
			axios.put(
				`http://localhost:5000/order-ent/payment/${id}`,
				{
					status: true,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('token')}`,
					},
				}
			);
			setSuccess(true);
		}
	};
	const { isSuccess } = useQuery(
		'menu-idk',
		async () => {
			return await axios.get(`http://localhost:5000/order-ent/${id}`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			});
		},

		{
			onSuccess: (e) => {
				setOrder(e.data);
				console.log(e.data);
			},
		}
	);
	interface IOrder {
		_id: string;
		name: string;
		description: string;
		status: string;
		paymentStatus: boolean;
		workTime: string;
		price: number;
		chat: string;
		menu: IMenuItem;
		entertainment: IEntertainmentOrder;
		food: IMenu[];
		program: IProgram;
		banquettype: IBanquetType;
	}
	interface IEntertainmentOrder {
		price: number;
		name: string;
		entertainments: IEntertainmentItem[];
	}
	interface IEntertainmentItem {
		name: string;
		price: number;
		time: number;
	}
	interface IMenuItem {
		name: string;
		price: number;
		count: number;
	}
	interface IBanquetType {
		price: number;
		name: string;
	}
	interface IProgram {
		price: number;
		name: string;
	}
	interface IMenu {
		_id: string;
		count: number;
		name: string;
	}
	return (
		<Page>
			<h1>{order?.name}</h1>
			{order?.status === 'accepted' && order?.paymentStatus === false && (
				<Button style={{ backgroundColor: 'grey' }} onClick={togglePaymentModal}>
					Оплатить
				</Button>
			)}
			{order?.status === 'accepted' && (
				<Button
					onClick={toggleRatingModal}
					style={{ backgroundColor: 'black', color: 'white' }}
				>
					Оставить отзыв
				</Button>
			)}
			{order?.description && order?.description.length > 1 ? (
				<p>Комментарий: {order?.description}</p>
			) : (
				<p>Без комментариев</p>
			)}
			{isSuccess && (
				<Button
					style={{ backgroundColor: 'black', color: 'white' }}
					onClick={() => {
						axios.get(`http://localhost:5000/order-ent/edit/${order?._id}`, {
							headers: {
								Authorization: `Bearer ${sessionStorage.getItem('token')}`,
							},
						});
						toggleEditModal();
					}}
				>
					Изменить заказ
				</Button>
			)}

			{order?.paymentStatus === true && <h2>Заказ был оплачен</h2>}
			<Model isOpen={openModal} onBackgroundClick={toggleRatingModal}>
				<RatingForm order={order?._id} />
			</Model>
			<Model isOpen={editModal} onBackgroundClick={toggleEditModal}>
				<EditOrder orderId={order?._id} />
			</Model>
			<Model isOpen={openPaymentModal} onBackgroundClick={togglePaymentModal}>
				<Form onSubmit={(e) => submitHandler(e)}>
					{!success ? (
						<>
							<h1>Введите данные вашей карты</h1>
							<InputMaske
								placeholder='Номер карты'
								mask={'9999-9999-9999-9999'}
								value={cardNumber}
								style={{ width: '70%' }}
								onChange={(e) => {
									setCardNumber(e.target.value);
									console.log(e.target.value.replace(/\D/g, ''));
								}}
							/>
							<InputMaske
								placeholder='CVV'
								mask={'999'}
								value={cvv}
								style={{ width: '70%' }}
								onChange={(e) => {
									setCvv(e.target.value);
								}}
							/>
							<InputMaske
								placeholder='Дата окончания'
								style={{ width: '70%' }}
								mask={'99/99'}
								value={date}
								onChange={(e) => {
									setDate(e.target.value);
								}}
							/>
							<Input
								placeholder='Имя владельца'
								style={{ width: '70%' }}
								value={cardName}
								onChange={(e) => {
									setCardName(e.target.value.replace(/\d/g, ''));
								}}
							/>
							<Button
								type='submit'
								style={{ backgroundColor: 'black', color: 'white', width: '50%' }}
							>
								Подтвердить
							</Button>
						</>
					) : (
						<>
							<h2>Ваш заказ был успешно оплачен ✅</h2>
						</>
					)}
				</Form>
			</Model>
			<p>Дата: {order?.workTime}</p>

			<h2>Состав заказа:</h2>
			<EntertainmentContainer>
				<EntertainmentList>
					<div>
						<h3>Меню:</h3>
						{order?.food?.map((item) => (
							<div key={item._id}>
								<p>{item?.count}</p>
								<p>{item?.name}</p>
							</div>
						))}
						<p>{order?.menu?.price} руб</p>
					</div>
					<div>
						<h3>Развлечение:</h3>
						<p>{order?.entertainment?.name}</p>
						<div>
							{order?.entertainment?.entertainments.map((item) => (
								<p>
									{item.name}, Количество часов: {item.time}
								</p>
							))}
						</div>
						<p>{order?.entertainment?.price} руб</p>
					</div>
					<div>
						<h3>Праздник:</h3>
						<p>{order?.banquettype?.name}</p>
						<p>{order?.banquettype?.price}</p>
					</div>
					<div>
						<h3>Программа:</h3>
						<p>{order?.program?.name}</p>
						<p>{order?.program?.price}</p>
					</div>
				</EntertainmentList>
			</EntertainmentContainer>
			<h1>Сумма: {order?.price} руб</h1>
			{isSuccess && order?.chat !== undefined && (
				<ChatComponent user={user} chat={order?.chat} manager={false} />
			)}
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

export default Menu;
