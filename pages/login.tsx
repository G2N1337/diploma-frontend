import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';
import { useRouter } from 'next/router';

import axios from 'axios';
import { useMutation } from 'react-query';
import Link from 'next/link';
const Form = styled.div`
	min-height: 150px;
	width: 250px;
	display: flex;
	flex-direction: column;
	text-align: center;
`;
const Page = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const Input = styled.input`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 0.3px dotted gray;
	background-color: white;
	height: 30px;
`;
const Button = styled.button`
	box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
	border-radius: 4px;
	padding: 0.6rem 1.5rem;
	border: 1px dotted gray;
	background-color: #c4c4c4;
	cursor: pointer;
	height: 40px;
`;
const Anchor = styled.a`
	font-weight: 600;
	cursor: pointer;
	margin-top: 15px;
`;
const LoginPage: NextPage = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	useEffect(() => {
		if (user?.login) {
			router.push('/');
		}
	});
	const mutation = useMutation(
		async () => {
			return await axios.post(`http://localhost:5000/users/login`, {
				login,
				password,
			});
		},
		{
			onSuccess: (e) => {
				setUser(e.data);
				sessionStorage.setItem('token', e.data.token);
				router.push('/');
			},
		}
	);
	function submit(e: any) {
		e.preventDefault();
		//@ts-ignore

		mutation.mutate({ login: login, password: password });
	}
	return (
		<Page>
			<Form onSubmit={(e) => submit(e)}>
				<label>Логин</label>
				<Input
					type='text'
					value={login}
					onChange={(e) => {
						setLogin(e.target.value);
					}}
				/>
				<label>Пароль</label>
				<Input
					value={password}
					type='password'
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<br />
				<Button type='submit' onClick={(e) => submit(e)}>
					Войти
				</Button>
				<Link href={'/register'}>
					<Anchor>Создать новый аккаунт</Anchor>
				</Link>
			</Form>
		</Page>
	);
};

export default LoginPage;
