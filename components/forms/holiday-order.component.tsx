import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';

import axios from 'axios';
import styled from 'styled-components';
import { UserContext } from '../../context';
import { toast } from 'react-toastify';
import Select from 'react-select';

interface IProps {}

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
interface IUserList {
	_id: string;
	fullName: string;
	phone: string;
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

export default function HolidayOrder({}: IProps) {
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

	const [data, setData] = useState<IFormData>({
		name: '',
		banquet: '',
		entertainment: '',
		program: '',
		menu: '',
		date: today,
		commentary: '',
	});
	React.useEffect(() => {
		setData({ ...data, name: user?.fullName });
	}, [user]);

	//ORDERS
	const [isMod, setIsMod] = useState(false);
	const [userList, setUserList] = useState<IUserList[]>([]);
	const [userForOrder, setUserForOrder] = useState();
	const [isUserRegistered, setIsUserRegistered] = useState(false);
	const [userPhone, setUserPhone] = useState('');
	const [startHour, setStartHour] = useState(8);
	//GetHolidays
	const [holidays, setHolidays] = useState<IDataDB[]>([]);
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
	if (user?.role !== 'user') {
		useQuery(
			'get-users',
			async () => {
				return await axios.get(`http://localhost:5000/users`, {
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('token')}`,
					},
				});
			},
			{
				onSuccess: (e) => {
					setUserList(
						e.data?.map((item: { _id: string; fullName: string; phone: string }) => ({
							value: item._id,
							label: `${item.fullName} (${item.phone}) `,
						}))
					);
					console.log(e.data);
				},
			}
		);
	}

	const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const { banquet, program, commentary, date, entertainment, menu } = data;
		if (!isUserRegistered && !isMod) {
			await axios
				.post(
					`http://localhost:5000/order-ent`,
					{
						name: 'Заказ ' + Math.round(Math.random() * 10000).toString(),
						banquetType: banquet,
						program,
						commentary,
						workTime: date,
						entertainment,
						order: menu,
						startHour,
					},
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem('token')}`,
						},
					}
				)
				.then((data) => {
					toast.success(
						'Заказ был успешно отправлен! Его название: ' + data.data.name
					);
				})
				.catch((data) => {
					console.log(data);
					toast.error('Возникла ошибка, скорее всего на это время уже занято.');
				});
		}
		if (user?.role !== 'user' && isUserRegistered) {
			axios
				.post(
					`http://localhost:5000/order-ent/mod/reg`,
					{
						name: 'Заказ ' + Math.round(Math.random() * 10000).toString(),
						banquetType: banquet,
						program,
						commentary,
						workTime: date,
						entertainment,
						order: menu,
						user: userForOrder,
						startHour,
					},
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem('token')}`,
						},
					}
				)
				.then((e) => {
					toast.success(
						`Заявка на проведение развлечения успешно отправлена! Название: ${e.data.name}.`
					);
				});
		}
		if (user?.role !== 'user' && !isUserRegistered && isMod) {
			axios
				.post(
					`http://localhost:5000/order-ent/mod/unreg`,
					{
						name: 'Заказ ' + Math.round(Math.random() * 10000).toString(),
						banquetType: banquet,
						program,
						commentary,
						workTime: date,
						entertainment,
						order: menu,
						phone: userPhone,
						startHour,
					},
					{
						headers: {
							Authorization: `Bearer ${sessionStorage.getItem('token')}`,
						},
					}
				)
				.then((e) => {
					toast.success(
						`Заявка на проведение развлечения успешно отправлена! Название: ${e.data.name}.`
					);
				});
		}
	};

	useEffect(() => {
		setData({
			...data,
			name: user?.fullName,
			banquet: banquetes[0]?._id,
			entertainment: entertainments[0]?._id,
			menu: orders[0]?._id,
			program: holidays[0]?._id,
		});
	}, [holidays, entertainments, banquetes, orders]);

	return (
		<FormStyles onSubmit={submitHandler}>
			<h1>Заказать праздник</h1>

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

			<InputRow>
				<label>К какому часу?</label>
				<Input
					onChange={(e) => {
						setStartHour(e.target.value);
					}}
					max={23}
					min={8}
					type='number'
					value={startHour}
					placeholder='К какому часу?'
				/>
			</InputRow>

			{user?.role !== 'user' && (
				<div>
					<label>Заказать для другого пользователя</label>
					<input
						type='checkbox'
						checked={isMod}
						onChange={async (e) => {
							setIsMod(!isMod);
						}}
					/>
					{isMod && userList.length > 0 && (
						<div>
							<label>Пользователь зарегистрирован</label>
							<input
								type='checkbox'
								checked={isUserRegistered}
								onChange={async (e) => {
									setIsUserRegistered(!isUserRegistered);
								}}
							/>

							{isUserRegistered ? (
								<Selector
									options={userList}
									isSearchable={false}
									placeholder={'Выберите пользователя'}
									onChange={(e: any) => {
										setUserForOrder(e.value);
										console.log(e.value);
									}}
								/>
							) : (
								<span>
									<Input
										value={userPhone}
										onChange={(e) => {
											setUserPhone(e.target.value);
										}}
										placeholder='Введите номер телефона'
									/>
								</span>
							)}
						</div>
					)}
				</div>
			)}
			{/* Кнопка подтверждения */}
			<Button style={{ backgroundColor: 'black', color: 'white' }} type='submit'>
				Отправить
			</Button>
		</FormStyles>
	);
}
