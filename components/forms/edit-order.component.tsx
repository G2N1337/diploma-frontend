import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';

import axios from 'axios';
import styled from 'styled-components';
import { UserContext } from '../../context';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useRouter } from 'next/router';
import moment from 'moment';
interface IProps {
	orderId: string;
}

interface IFormData {
	name: string;
	banquet: string;
	entertainment: string;
	program: string;
	menu: string;
	date: string;
	commentary: string;
}

interface IDataDB {
	_id: string;
	name: string;
}

const FormStyles = styled.form`
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

const InputRow = styled.div`
	width: 75%;

	label {
		width: 100%;
	}

	input,
	select {
		box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
		border-radius: 4px;
		padding: 0.6rem 1.5rem;
		border: 0.3px dotted gray;
		background-color: white;
		margin-bottom: 15px;
		min-height: 15px;
		width: 100%;
	}

	textarea {
		box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
		border-radius: 4px;
		padding: 0.6rem 1.5rem;
		border: 0.3px dotted gray;
		background-color: white;
		margin-bottom: 15px;
		min-height: 100px;
		width: 100%;
		resize: none;
	}
`;

export default function EditOrder({ orderId }: IProps) {
	//Для валидации даты
	let todayRaw = new Date();
	let today =
		todayRaw.getFullYear() +
		'-' +
		(todayRaw.getMonth() + 1 < 10
			? '0' + (todayRaw.getMonth() + 1)
			: todayRaw.getMonth() + 1 < 10) +
		'-' +
		todayRaw.getDate();

	//@ts-ignore
	const { user } = useContext(UserContext);
	const [order, setOrder] = useState();
	const [data, setData] = useState<IFormData>({
		name: undefined,
		banquet: undefined,
		entertainment: undefined,
		program: undefined,
		menu: undefined,
		date: today,
		commentary: undefined,
	});
	const router = useRouter();
	//GetHolidays
	const [holidays, setHolidays] = useState<IDataDB[]>([]);
	useQuery(
		'get-order',
		async () => {
			return await axios.get(`http://localhost:5000/order-ent/${orderId}`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			});
		},
		{
			onSuccess: (e) => {
				setOrder(e.data);
				setData({
					name: user?.fullName,
					banquet: e.data.banquettype,
					commentary: e.data.description,
					menu: e.data.order,
					program: e.data.program,
					entertainment: e.data.entertainment,
					date: moment(e.data.workTime).format('yyyy-MM-DD'),
				});
			},
		}
	);
	useQuery(
		'get-holidays',
		async () => {
			return await axios.get(`http://localhost:5000/program`);
		},
		{
			onSuccess: (e) => {
				setHolidays(e.data);
			},
		}
	);

	//Get Orders By User
	const [orders, setOrders] = useState<IDataDB[]>([]);
	useQuery(
		'get-orders-by-user',
		async () => {
			return await axios.get(`http://localhost:5000/menuorder/unique`, {
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

	//GetHolidays
	const [banquetes, setBanquetes] = useState<IDataDB[]>([]);
	useQuery(
		'get-banquetes',
		async () => {
			return await axios.get(`http://localhost:5000/banquet/type`);
		},
		{
			onSuccess: (e) => {
				setBanquetes(e.data);
			},
		}
	);

	//GetEntertainments
	const [entertainments, setEntertainments] = useState<IDataDB[]>([]);
	useQuery(
		'get-entertainments',
		async () => {
			return await axios.get(`http://localhost:5000/entorder/unique`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			});
		},
		{
			onSuccess: (e) => {
				setEntertainments(e.data);
			},
		}
	);

	const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const { banquet, program, commentary, date, entertainment, menu } = data;
		console.log(data);
		await axios
			.put(
				`http://localhost:5000/order-ent/edit/${orderId}`,
				{
					//@ts-ignore
					name: order?.name,
					banquetType: banquet,
					program,
					description: commentary,
					workTime: date,
					entertainment,
					order: menu,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('token')}`,
					},
				}
			)
			.then((data) => {
				console.log(data);
				toast.success('Заказ был успешно изменен! Его название: ' + data.data.name);
				router.reload();
			});
	};

	// useEffect(() => {
	// 	setData({
	// 		...data,
	// 		name: user?.fullName,
	// 		banquet: banquetes[0]?._id,
	// 		entertainment: entertainments[0]?._id,
	// 		menu: orders[0]?._id,
	// 		program: holidays[0]?._id,
	// 	});
	// }, [holidays, entertainments, banquetes, orders]);

	return (
		<FormStyles onSubmit={submitHandler}>
			<h1>Изменить заказ</h1>

			{/* Имя */}
			<InputRow>
				<label>
					{/* Имя: */}
					<input
						type='user'
						value={data.name}
						placeholder='Ваше имя'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setData({ ...data, name: e.target.value })
						}
						name='user-name'
						autoComplete='on'
					/>
				</label>
			</InputRow>

			{/* Выбор праздника */}
			<InputRow>
				<label>
					<select
						value={data.banquet}
						onChange={(e: any) => setData({ ...data, banquet: e.target.value })}
					>
						<option defaultChecked disabled>
							Выберите праздник
						</option>
						{banquetes &&
							banquetes.map((holiday: { name: string; _id: string }) => (
								<option key={holiday._id} value={holiday._id}>
									{holiday.name}
								</option>
							))}
						<option value={''}>Нет</option>
					</select>
				</label>
			</InputRow>

			{/* Выбор развлечений */}
			<InputRow>
				<label>
					<select
						value={data.entertainment}
						onChange={(e: any) => {
							setData({ ...data, entertainment: e.target.value });
						}}
					>
						<option defaultChecked disabled>
							Выберите развлечение
						</option>

						{entertainments &&
							entertainments.map((entertainment: { name: string; _id: string }) => (
								<option key={entertainment._id} value={entertainment._id}>
									{entertainment.name}
								</option>
							))}
						<option value={''}>Нет</option>
					</select>
				</label>
			</InputRow>

			{/* Выбор меню */}
			<InputRow>
				<label>
					<select
						value={data.menu}
						onChange={(e: any) => {
							setData({ ...data, menu: e.target.value });
						}}
					>
						<option defaultChecked disabled>
							Выберите меню
						</option>
						{orders &&
							orders.map((menu: { name: string; _id: string }) => (
								<option key={menu._id} value={menu._id}>
									{menu.name}
								</option>
							))}
						<option value={''}>Нет</option>
					</select>
				</label>
			</InputRow>

			{/* Выбор анимационной программы */}
			<InputRow>
				<label>
					<select
						value={data.program}
						onChange={(e: any) => setData({ ...data, program: e.target.value })}
					>
						<option defaultChecked disabled>
							Выберите программу
						</option>
						{holidays &&
							holidays.map((holiday: { name: string; _id: string }) => (
								<option key={holiday._id} value={holiday._id}>
									{holiday.name}
								</option>
							))}
						<option value={''}>Нет</option>
					</select>
				</label>
			</InputRow>

			{/* Дата праздника */}
			<InputRow>
				<label>
					{/* Дата праздника: */}
					<input
						type='date'
						name='holiday-start'
						value={data.date}
						onChange={(e: any) => setData({ ...data, date: e.target.value })}
						min={today}
						max={todayRaw.getFullYear() + '-12-31'}
					/>
				</label>
			</InputRow>

			{/* Сообщение */}
			<InputRow>
				<label>
					Комментарий:
					<textarea
						placeholder='Сообщение'
						value={data.commentary}
						onChange={(e: any) => {
							setData({ ...data, commentary: e.target.value });
						}}
						name='commentary'
						autoComplete='off'
					/>
				</label>
			</InputRow>
			<Button style={{ backgroundColor: 'black', color: 'white' }} type='submit'>
				Отправить
			</Button>
		</FormStyles>
	);
}
