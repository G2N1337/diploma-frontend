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
const OrderModModal = ({ id }) => {
	const [order, setOrder] = useState();
	const [status, setStatus] = useState('');
	const { user, setUser } = useContext(UserContext);
	useQuery(
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
	return (
		<Form>
			<p>{order?.name}</p>
			<p>{status}</p>
			<div>
				<h3>Изменить статус заказа</h3>
				<button
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
				</button>
				<button
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
				</button>
			</div>
			<EntertainmentContainer>
				<EntertainmentList>
					<div>
						<h3>Меню:</h3>
						<p>{order?.food?.name}</p>
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
						<p>{order?.entertainment?.entName}</p>
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
			<ChatComponent manager={true} chat={order?.chat} user={user} />
		</Form>
	);
};

export default OrderModModal;
