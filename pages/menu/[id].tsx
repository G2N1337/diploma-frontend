import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { UserContext } from '../../context';
import { toast } from 'react-toastify';
import Modal from 'styled-react-modal';
import Select from 'react-select';
import FoodContainer from '../../components/food-container/food-container.component';

interface IMenu {
	name: string;
	price: string;
	count: string;
	menu: any;
	description: string;
}

const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;
const ButtonSubmit = styled.button`
width: ${(props) => (props.width ? props.width : 110)}px;
border-radius: 4px;
height: 38px;
border: none;
background: #c1c1c4;
color: white
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
const Button = styled.button`
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
const Selector = styled(Select)`
	margin: 0 5px 0 5px;
	font-weight: 600;
	width: ${(props) => props.width}%;
	margin-bottom: 15px;
	text-align: center;
	.css-1s2u09g-control {
		background-color: #white;
		border: 1px dotted black;
		min-width: 225px;
	}
	.css-1pahdxg-control {
		background-color: #white;
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
const Input = styled.input`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 0.3px dotted gray;
	background-color: white;
	margin-bottom: 15px;
	height: ${(props) => (props.height ? props.height : 5)}%;
	width: ${(props) => props.width}%;
`;
const BigInput = styled.textarea`
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
	const { user, setUser } = useContext(UserContext);
	const [name, setName] = useState(user?.fullName);
	const [menuField, setMenuField] = useState('');
	const [description, setDescription] = useState('');
	const [priceData, setPriceData] = useState<Number>();
	const [time, setTime] = useState('');
	const [date, setDate] = useState('');
	const [menuTypes, setMenuTypes] = useState<IMenu>();
	const [menuFields, setMenuFields] = useState();
	const [orderItem, setOrderItem] = useState();
	const toggleModal = (e: React.SyntheticEvent) => {
		setOpenModal(!openModal);
	};
	useQuery(
		'menu-idk',
		async () => {
			return await axios.get(`http://localhost:5000/menu/type`);
		},
		{
			onSuccess: (e) => {
				setMenuFields(
					e.data?.map((item) => ({
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
				setMenuTypes(e.data);
			},
		}
	);
	const submit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		// if (name && menuField && date && time) {
		// 	//@ts-ignore
		// 	mutation.mutate({
		// 		id: user._id,
		// 		name: name,
		// 		menuField: menuField,
		// 		// @ts-ignore
		// 		price: priceData * parseInt(time),
		// 		workTime: time + '|' + date,
		// 		description: description,
		// 	});
		// }
		// if (!name) {
		// 	toast.error('Имя пустое!');
		// }
		// if (!menuField) {
		// 	toast.error('Выберите вид развлечения!');
		// }
		// if (time && parseInt(time) < 1) {
		// 	toast.error('Укажите правильное время!');
		// }
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
								axios.get(`http://localhost:5000/menu/type/${e.value}`).then((data) => {
									console.log(data.data.menu);
									setOrderItem(data.data.menu);
								});
							}}
						/>
						{orderItem?.length > 0 ? (
							orderItem?.map((item) => (
								<FoodContainer key={item._id} item={item}></FoodContainer>
							))
						) : (
							<Paragraph>нету нихуя</Paragraph>
						)}
						{/* <PriceLabel>Цена составляет {priceData} руб. за 1 час</PriceLabel>
						{parseInt(time) > 0 ? (
							<PriceLabel>
								Сумма будет составлять {priceData * parseInt(time)} Руб
							</PriceLabel>
						) : (
							<PriceLabel>Нужно выбрать правильное время</PriceLabel>
						)} */}
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
						menuTypes?.menu.map((item: any) => (
							<InfoBox key={item._id}>
								<Paragraph>{item.name}</Paragraph>
								<Paragraph>{item.price} рублей</Paragraph>
								<Paragraph>Цена за {item.count}</Paragraph>
							</InfoBox>
						))}
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
