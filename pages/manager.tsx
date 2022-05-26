import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';
import axios from 'axios';
import { useQuery } from 'react-query';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import OrderMod from '../components/order-mod.component';
import AnalysisComponent from '../components/analysis.component';
const OrderContainer = styled.div`
	display: grid;
	grid-gap: 15px;
	grid-template-columns: 1fr 1fr 1fr;
	flex-direction: column;
`;
const ManagerPage = () => {
	const router = useRouter();
	//@ts-ignore
	const { user } = useContext(UserContext);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		if (user?.role === 'user') {
			router.push('/');
		}
	});
	return (
		<>
			<OrderContainer>
				{orders.map((item) => (
					<OrderMod item={item} key={item._id} />
				))}
			</OrderContainer>
			<h1>Анализ</h1>
			<AnalysisComponent />
		</>
	);
};

export default ManagerPage;
