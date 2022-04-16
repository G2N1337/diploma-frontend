import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';
import axios from 'axios';
import { useQuery } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatComponent from '../components/chat-component/chat.component';
import { useRouter } from 'next/router';
import OrderMod from '../components/order-mod.component';

const ManagerPage = () => {
	const router = useRouter();
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	const [orders, setOrders] = useState([]);
	useQuery(
		'get-orders',
		async () => {
			return await axios.get(`http://localhost:5000/order-ent/mod`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			});
		},
		{
			onSuccess: (e) => {
				setOrders(e.data);
			},
		}
	);
	useEffect(() => {
		if (user?.role === 'user') {
			router.push('/');
		}
	});
	return (
		<div>
			{orders.map((item) => (
				<OrderMod item={item} key={item._id} />
			))}
		</div>
	);
};

export default ManagerPage;
