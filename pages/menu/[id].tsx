import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { UserContext } from '../../context';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'styled-react-modal';
import Select from 'react-select';
import FoodContainer from '../../components/food-container/food-container.component';
import 'react-toastify/dist/ReactToastify.css';
import MenuContainer from '../../components/food-container/menu-container.component';

interface IWHData {
	width?: number;
	height?: number;
}

interface IMenu {
	name: string;
	price: number;
	count: number;
	menuType: string;
	description: string;
}

interface IOrderItem {
	menu: string;
	count: number;
}
interface IUserList {
	_id: string;
	fullName: string;
	phone: string;
}
const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;
const ButtonSubmit = styled.button<IWHData>`
	width: ${(props) => (props.width ? props.width : 110)}px;
	border-radius: 4px;
	height: 5em;
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
	display: flex;
	justify-content: center;
`;
const InfoBox = styled.div`
	background-color: #e6e1e1;
	width: 30em;
	height: 15em;
	padding: 50px;
`;
const InfoContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	width: 70%;
	grid-gap: 0.3em;
	margin: 0 auto;
	margin-top: 1em;
	justify-items: center;
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
height: 100%;
background-color: white;
border-radius: 15px;
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
const BigInput = styled.textarea<{ height: number; width: number }>`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 0.3px dotted gray;
	background-color: white;
	margin-bottom: 15px;
	//@ts-ignore
	height: ${(props) => (props.height ? props.height : 5)}%;
	//@ts-ignore

	width: ${(props) => props.width}%;
	resize: none;
`;
const Form = styled.form`
	display: flex;
	margin: 15px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 95%;
	h1 {
		display: flex;
		padding-bottom: 5px;
		justify-content: center;
		align-items: center;
		width: 70%;
		border-bottom: 1px dotted black;
	}
`;
const FoodList = styled.div`
	overflow-y: scroll;
	max-height: 25em;
	margin-bottom: 2em;
	margin-top: 2em;
`;
const Menu: React.FC = () => {
	let todayRaw = new Date();
	let today =
		todayRaw.getFullYear() +
		'-' +
		(todayRaw.getMonth() + 1 < 10
			? '0' + (todayRaw.getMonth() + 1)
			: todayRaw.getMonth() + 1 < 10) +
		'-' +
		todayRaw.getDate();
	const router = useRouter();
	const { id } = router.query;
	const [openModal, setOpenModal] = useState(false);

	//@ts-ignore
	const { user, setUser } = useContext(UserContext);

	const [menuField, setMenuField] = useState('');

	const [date, setDate] = useState(today);
	const [unique, setUnique] = useState(false);
	const [menuTypes, setMenuTypes] = useState<IMenu>();
	const [menuFields, setMenuFields] = useState();
	const [startHour, setStartHour] = useState(8);

	const [menu, setMenu] = useState<any[]>([]);

	//Заказ
	const [order, setOrder] = useState<IOrderItem[]>([]);
	//orders for users
	const [isMod, setIsMod] = useState(false);
	const [userList, setUserList] = useState<IUserList[]>([]);
	const [userForOrder, setUserForOrder] = useState();
	const [isUserRegistered, setIsUserRegistered] = useState(false);
	const [userPhone, setUserPhone] = useState('');
	const toggleModal = (e: React.SyntheticEvent) => {
		setOpenModal(!openModal);
	};
	const mutation = useMutation(
		async () => {
			return await axios.post(
				`http://localhost:5000/menuorder`,
				{
					name: `Заказ ${Math.round(Math.random() * 10000)}`,
					user: user._id,
					orders: JSON.stringify(order),
					unique: unique ? true : false,
					date: date,
					startHour,
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
				console.log(e.data);
				toast.success(`Заказ успешно создан! Название: ${e.data.name}`);
			},
			onError: (e) => {
				toast.error('Возникла ошибка, скорее всего на это время уже занято.');
			},
		}
	);
	const mutationReg = useMutation(
		async () => {
			return await axios.post(
				`http://localhost:5000/menuorder/mod/reg`,
				{
					name: `Заказ ${Math.round(Math.random() * 10000)}`,
					user: userForOrder,
					orders: JSON.stringify(order),
					unique: unique ? true : false,
					date: date,
					startHour,
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
				console.log(e.data);
				toast.success(`Заказ успешно создан! Название: ${e.data.name}`);
			},
		}
	);
	const mutationUnreg = useMutation(
		async () => {
			return await axios.post(
				`http://localhost:5000/menuorder/mod/unreg`,
				{
					name: `Заказ ${Math.round(Math.random() * 10000)}`,
					user: user._id,
					orders: JSON.stringify(order),
					unique: unique ? true : false,
					date: date,
					phone: userPhone,
					startHour,
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
				console.log(e.data);
				toast.success(`Заказ успешно создан! Название: ${e.data.name}`);
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
				},
			}
		);
	}
	useQuery(
		'menu-idk',
		async () => {
			return await axios.get(`http://localhost:5000/menu/type`);
		},
		{
			onSuccess: (e) => {
				setMenuFields(
					e.data?.map((item: any) => ({
						value: item?._id,
						label: item?.name,
					}))
				);
			},
		}
	);
	useQuery(
		'menu-types',
		async () => {
			return await axios.get(`http://localhost:5000/menu/type/${id}`);
		},
		{
			onSuccess: (e) => {
				console.log(e.data);
				setMenuTypes(e.data);
			},
		}
	);
	useQuery(
		'menu',
		async () => {
			return await axios.get(`http://localhost:5000/menu/type/alt/${id}`);
		},
		{
			onSuccess: (e) => {
				console.log(e.data);
				setMenu(e.data);
			},
		}
	);

	const submit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (order.length > 0 && date) {
			if (!isUserRegistered && !isMod) {
				mutation.mutate();
			}
			if (user?.role !== 'user' && isUserRegistered) {
				mutationReg.mutate();
			}
			if (user?.role !== 'user' && !isUserRegistered && isMod) {
				mutationUnreg.mutate();
			}
		}
		if (!date) {
			toast.error('Выберите дату');
		}
		if (order.length === 0) {
			toast.error('Добавьте пункты в меню');
		}
	};

	return (
		<Page>
			<ModalContent>
				<Model isOpen={openModal} onBackgroundClick={toggleModal}>
					<Form onSubmit={(e) => submit(e)}>
						<h1>Заказать еду</h1>

						<Input
							type='date'
							value={date}
							placeholder={'День'}
							width={75}
							min={today}
							max={todayRaw.getFullYear() + '-12-31'}
							onChange={(e) => {
								setDate(e.target.value);
							}}
						/>
						<Selector
							options={menuFields}
							isSearchable={false}
							width={75}
							placeholder={'Выбрать меню'}
							onChange={(e: any) => {
								// console.log(e);
								setMenuField(e.label);
								axios
									.get(`http://localhost:5000/menu/type/alt/${e.value}`)
									.then((data) => {
										console.log(data.data.menu);
										setMenu(data.data);
									});
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
						<FoodList>
							{menu?.length > 0 ? (
								menu?.map(
									(item: {
										_id: string;
										name: string;
										description: string;
										price: number;
									}) => (
										<FoodContainer
											key={item._id}
											item={item}
											orderList={order}
											setOrderList={(items: IOrderItem[]) => {
												setOrder(items);
											}}
										></FoodContainer>
									)
								)
							) : (
								<Paragraph>Выберите меню</Paragraph>
							)}
						</FoodList>
						{unique && (
							<>
								<label>К какому часу?</label>
								<Input
									onChange={(e) => {
										setStartHour(parseInt(e.target.value));
									}}
									max={23}
									min={8}
									type='number'
									value={startHour}
									placeholder='К какому часу?'
								/>
							</>
						)}
						{user?.role !== 'user' && unique && (
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
			<Headline>{menuTypes?.name && <h1>{menuTypes?.name}</h1>}</Headline>
			<Container>
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

				<InfoContainer>
					{!!menu &&
						menu?.map((item) => <MenuContainer item={item} key={item._id} />)}
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

export default Menu;
