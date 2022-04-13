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
	price: string;
	count: string;
	menu: any;
	description: string;
}

interface IOrderItem {
	menu: string;
	count: number;
}

const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
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

const Menu: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const [openModal, setOpenModal] = useState(false);

	//@ts-ignore
	const { user, setUser } = useContext(UserContext);

	const [name, setName] = useState(user?.fullName);
	const [menuField, setMenuField] = useState('');
	const [description, setDescription] = useState('');
	const [priceData, setPriceData] = useState<number>(0);
	const [price, setPrice] = useState<number>(0);

	const [time, setTime] = useState('');
	const [date, setDate] = useState('');
	const [unique, setUnique] = useState(false);
	const [menuTypes, setMenuTypes] = useState<IMenu>();
	const [menuFields, setMenuFields] = useState();

	const [menu, setMenu] = useState<any[]>([]);

	//Заказ
	const [order, setOrder] = useState<IOrderItem[]>([]);

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
			return await axios.get(`http://localhost:5000/menu/type/alt/${id}`);
		},
		{
			onSuccess: (e) => {
				setMenuTypes(e.data);
			},
		}
	);

	const submit = async (e: React.SyntheticEvent) => {
		console.log({ order });
		e.preventDefault();

		if (order.length > 0) {
			mutation.mutate();
		}
	};
	return (
		<Page>
			<ModalContent>
				<Model isOpen={openModal} onBackgroundClick={toggleModal}>
					<Form onSubmit={(e) => submit(e)}>
						<h1>Заказать еду</h1>
						<Input
							value={name}
							placeholder={'Имя'}
							width={75}
							onChange={(e) => {
								setName(e.target.value);
							}}
						/>

						<Input
							type='date'
							value={date}
							placeholder={'День'}
							width={75}
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
				<InfoContainer>
					{!!menuTypes &&
						menuTypes?.map((item: any) => <MenuContainer item={item} />)}
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

export default Menu;
