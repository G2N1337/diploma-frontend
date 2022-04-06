import axios from 'axios';
import { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { UserContext } from '../context';
import { useRouter } from 'next/router';
const BlackBox = styled.div`
	background: #bab9b9;
	display: flex;
	flex-direction: column;
	height: fit-content;
	width: fit-content;
	margin-left: 54px;
	margin-top: 34px;
	p {
		margin: 0;
	}
`;
const TextContainer = styled.div`
	margin: 35px;
`;
const OrderContainer = styled.div`
	width: 75%;
	height: fit-content;
	padding: 15px;
	margin: 35px 0 35px 35px;
	background-color: lightgrey;
	display: flex;
	flex-direction: column;
`;
const Profile: React.FC = () => {
	//order-ent
	//GetHolidays
	const [ordersIP, setOrdersIP] = useState([]);
	const [ordersAC, setOrdersAC] = useState([]);
	const [ordersC, setOrdersC] = useState([]);
	const router = useRouter();
	useQuery(
		'get-orders-in-process',
		async () => {
			return await axios.get(`http://localhost:5000/order-ent/ip`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			});
		},
		{
			onSuccess: (e) => {
				setOrdersIP(e.data);
			},
		}
	);
	useQuery(
		'get-orders-accepted',
		async () => {
			return await axios.get(`http://localhost:5000/order-ent/accepted`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			});
		},
		{
			onSuccess: (e) => {
				setOrdersAC(e.data);
			},
		}
	);
	useQuery(
		'get-orders-cancelled',
		async () => {
			return await axios.get(`http://localhost:5000/order-ent/cancelled`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			});
		},
		{
			onSuccess: (e) => {
				setOrdersC(e.data);
			},
		}
	);
	console.log({ ordersIP });

	//@ts-ignore
	const { user, setUser } = useContext(UserContext);

	return (
		<>
			<BlackBox>
				<TextContainer>
					<p>{user?.fullName}</p>
					<p>{user?.phone}</p>
					<p>{user?.email}</p>
				</TextContainer>
			</BlackBox>
			<OrderContainer>
				Ваши запросы в ожидании
				{ordersIP.map((item) => (
					<>
						<p>{item.name}</p>
						<button
							onClick={() => {
								router.push(`/order/${item._id}`);
							}}
						>
							Посмотреть детали
						</button>
					</>
				))}
			</OrderContainer>
			<OrderContainer>
				Ваши подтвержденные запросы{' '}
				{ordersAC.map((item) => (
					<>
						<p>{item.name}</p>
						<button
							onClick={() => {
								router.push(`/order/${item._id}`);
							}}
						>
							Посмотреть детали
						</button>
					</>
				))}
			</OrderContainer>
			<OrderContainer>
				Ваши отмененные запросы{' '}
				{ordersC.map((item) => (
					<>
						<p>{item.name}</p>
						<button
							onClick={() => {
								router.push(`/order/${item._id}`);
							}}
						>
							Удалить
						</button>
					</>
				))}
			</OrderContainer>
		</>
	);
};

export default Profile;
