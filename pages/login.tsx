import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';
import { useRouter } from 'next/router';

import axios from 'axios';
import { useMutation } from 'react-query';
import Link from 'next/link';
const Form = styled.div`
	min-height: 150px;
	width: 200px;
	display: flex;
	flex-direction: column;
`;
const Page = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const LoginPage: NextPage = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const { user, setUser } = useContext(UserContext);
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
				router.push('/');
			},
		}
	);
	function submit(e: any) {
		e.preventDefault();
		mutation.mutate({ login: login, password: password });
	}
	return (
		<Page>
			<Form onSubmit={(e) => submit(e)}>
				<label>Логин</label>
				<input
					type='text'
					value={login}
					onChange={(e) => {
						setLogin(e.target.value);
					}}
				/>
				<label>Пароль</label>
				<input
					value={password}
					type='password'
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<br />
				<button type='submit' onClick={(e) => submit(e)}>
					Войти
				</button>
				<Link href={'/register'}>
					<a>Создать новый аккаунт</a>
				</Link>
			</Form>
		</Page>
	);
};

export default LoginPage;
