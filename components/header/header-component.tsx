import { useContext, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import Select from 'react-select';

const HeaderTop = styled.div`
	height: 47px;
	width: 100%;
	background-color: #c4c4c4;
	display: flex;
	justify-content: space-between;
	font-weight: 800;
	box-shadow: 0px 4px 28px -1px rgba(37, 64, 84, 0.31);
`;
const Selector = styled(Select)`
	margin: 0 5px 0 5px;
	font-weight: 600;
	text-align: center;
	.css-1s2u09g-control {
		background-color: #c4c4c4;
		min-width: 225px;
	}
	.css-1pahdxg-control {
		background-color: #c4c4c4;
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
const HeaderBottom = styled.div`
	height: 74px;
	width: 100%;
	background-color: #f1eeee;
	display: flex;
	justify-content: space-between;
	font-weight: 800;
	box-shadow: 0px 4px 28px -1px rgba(37, 64, 84, 0.31);
`;
const Button = styled.button`
	width: 110px;
	border-radius: 4px;
	height: 38px;
	border: none;
	background: #c4c4c4;
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

const LogoutButton = styled.button`
	background: #888585;
	border: none;
	width: 96px;
	height: 24px;
	margin-top: 1vh;
	margin-right: 1vh;
	&:hover {
		cursor: pointer;
	}
`;
const Paragraph = styled.a`
	margin-right: 11px;
	&:hover {
		cursor: pointer;
	}
`;
const FunContainer = styled.div`
	display: flex;
	padding: 15px;
`;
const ContactContainer = styled.div``;
interface IEntertainment {
	_id: string;
	name: string;
}
const HeaderComponent = () => {
	const [entertainmentsList, setEntertainmentsList] = useState([]);
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	const { pathname, push, reload } = useRouter();
	useQuery(
		'users',
		async () => {
			return await axios.get(`http://localhost:5000/entertainment`);
		},
		{
			onSuccess: (e) => {
				setEntertainmentsList(
					e.data?.map((item: IEntertainment) => ({
						value: item?._id,
						label: item?.name,
					}))
				);
			},
		}
	);
	return (
		<div>
			<HeaderTop>
				<Link href='/'>
					<Paragraph>Лого</Paragraph>
				</Link>
				{!user?.login ? (
					<Link href='/login'>
						<Paragraph>Войти</Paragraph>
					</Link>
				) : !pathname.includes('/profile') ? (
					<Link href='/profile'>
						<Paragraph>Профиль</Paragraph>
					</Link>
				) : (
					<LogoutButton
						onClick={() => {
							setUser({});
							push('/');
						}}
					>
						Выйти
					</LogoutButton>
				)}
			</HeaderTop>
			<HeaderBottom>
				<Button>О нас</Button>
				<FunContainer>
					<Selector
						options={entertainmentsList}
						isSearchable={false}
						placeholder={'Развлечения'}
						onChange={(e: any) => {
							push(`/entertainment/${e.value}`);
						}}
					/>
					<Selector
						isSearchable={false}
						options={entertainmentsList}
						placeholder={'Праздники'}
					/>
					<Selector
						isSearchable={false}
						options={entertainmentsList}
						placeholder={'Меню'}
					/>
				</FunContainer>
				<ContactContainer>
					<Button>Акции</Button>
					<Button
						onClick={() => {
							push('/contacts');
						}}
					>
						Контакты
					</Button>
				</ContactContainer>
			</HeaderBottom>
		</div>
	);
};

export default HeaderComponent;
