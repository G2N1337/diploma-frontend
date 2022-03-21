import { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../context';
import Link from 'next/link';
import { useRouter } from 'next/router';
const HeaderTop = styled.div`
	height: 47px;
	width: 100%;
	background-color: #c4c4c4;
	display: flex;
	justify-content: space-between;
	font-weight: 800;
	box-shadow: 0px 4px 28px -1px rgba(37, 64, 84, 0.31);
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
	height: 38px;
	border: none;
	background: #c4c4c4;
	margin-top: 15px;
	margin-left: 25px;
	margin-right: 25px;

	&:hover {
		cursor: pointer;
	}
`;
const Paragraph = styled.a`
	margin-right: 11px;
`;
const FunContainer = styled.div``;
const ContactContainer = styled.div``;

const HeaderComponent = () => {
	const { user, setUser } = useContext(UserContext);
	const { pathname, push } = useRouter();
	return (
		<div>
			<HeaderTop>
				<Paragraph>Лого</Paragraph>
				{!user?.login ? (
					<Link href='/login'>
						<Paragraph>Войти</Paragraph>
					</Link>
				) : !pathname.includes('/profile') ? (
					<Link href='/profile'>
						<Paragraph>Профиль</Paragraph>
					</Link>
				) : (
					<button
						onClick={() => {
							setUser({});
							push('/');
						}}
					>
						Выйти
					</button>
				)}
			</HeaderTop>
			<HeaderBottom>
				<Button>О нас</Button>
				<FunContainer>
					<Button>Развлечения</Button>
					<Button>Праздники</Button>
					<Button>Меню</Button>
				</FunContainer>
				<ContactContainer>
					<Button>Акции</Button>
					<Button>Контакты</Button>
				</ContactContainer>
			</HeaderBottom>
		</div>
	);
};

export default HeaderComponent;
