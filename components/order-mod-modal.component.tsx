import styled from 'styled-components';
import { useQuery } from 'react-query';
import Modal from 'styled-react-modal';
import axios from 'axios';
import { useContext, useState } from 'react';
import ChatComponent from './chat-component/chat.component';
import { UserContext } from '../context';
const Form = styled.form`
	display: flex;
	margin: 15px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: none;
	h1 {
		display: flex;
		padding-bottom: 5px;
		justify-content: center;
		align-items: center;
		width: 70%;
		border-bottom: 1px dotted black;
	}
	h2 {
		justify-content: center;
		align-items: center;
		text-align: center;
	}
`;
interface IWHData {
	width?: number;
	height?: number;
}
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
const EntertainmentList = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
`;
const EntertainmentContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom: 1px dotted black;
	width: 100%;
`;
const OrderModModal = ({ id }: { id: string }) => {
	const [order, setOrder] = useState<IOrder>();
	const [status, setStatus] = useState('');
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	const { isSuccess } = useQuery(
		'menu-idk',
		async () => {
			return await axios.get(`http://localhost:5000/order-ent/mod/${id}`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			});
		},

		{
			onSuccess: (e) => {
				setOrder(e.data);
				console.log(e.data);
				if (e.data.status === 'inprocess') {
					setStatus('В процессе');
				}
				if (e.data.status === 'accepted') {
					setStatus('Принято');
				}
				if (e.data.status === 'cancelled') {
					setStatus('Отменено');
				}
			},
		}
	);
	interface IOrder {
		name: string;
		status: string;
		paymentStatus: boolean;
		workTime: string;
		description: string;
		price: number;
		chat: string;
		menu: IMenuItem;
		entertainment: IEntertainmentOrder;
		food: IMenu[];
		program: IProgram;
		banquettype: IBanquetType;
		phone: string;
		createdByManager: boolean;
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
		<Form>
			<p>{order?.name}</p>
			<p>{status}</p>
			<p>Номер заказчика: {order?.phone}</p>
			{order?.createdByManager && <p>Заказ был создан менеджером</p>}
			{order?.paymentStatus === true && <h2>Заказ был оплачен</h2>}
			{console.log(order)}
			{order?.description && order?.description.length > 1 ? (
				<p>Комментарий: {order?.description}</p>
			) : (
				<p>Без комментариев</p>
			)}{' '}
			<div>
				<h2>Изменить статус заказа</h2>

				<Button
					style={{ backgroundColor: 'lime', color: 'white' }}
					onClick={(e) => {
						axios.put(
							`http://localhost:5000/order-ent/mod/${id}`,
							{
								status: 'accepted',
							},
							{
								headers: {
									Authorization: `Bearer ${sessionStorage.getItem('token')}`,
								},
							}
						);
					}}
				>
					Принять
				</Button>
				<Button
					style={{ backgroundColor: 'red', color: 'white' }}
					onClick={(e) => {
						axios.put(
							`http://localhost:5000/order-ent/mod/${id}`,
							{
								status: 'cancelled',
							},
							{
								headers: {
									Authorization: `Bearer ${sessionStorage.getItem('token')}`,
								},
							}
						);
					}}
				>
					Отменить
				</Button>
			</div>
			<p>Дата: {order?.workTime}</p>
			<EntertainmentContainer>
				<EntertainmentList>
					<div>
						<h3>Меню:</h3>
						{order?.food?.map((item) => (
							<div>
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
				<ChatComponent manager={true} chat={order?.chat} user={user} />
			)}
		</Form>
	);
};

export default OrderModModal;
