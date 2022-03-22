import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';
import { useRouter } from 'next/router';
import isEmail from 'validator/lib/isEmail';

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
	height: 40px;
	cursor: pointer;
`;
const Error = styled.p`
	color: #f47174;
	font-weight: 600;
	font-size: 24px;
`;
const Anchor = styled.a`
	cursor: pointer;
	font-weight: 600;
	margin-top: 15px;
`;
const RegisterPage: NextPage = () => {
	interface IUser {
		email: string;
		fullName: string;
		login: string;
		phone: string;
		role: string;
		token: string;
		_id: string;
	}
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [error, setError] = useState<string>('');
	//@ts-ignore
	const { user } = useContext(UserContext);

	const router = useRouter();
	useEffect(() => {
		if (user) {
			router.push('/');
		}
	});
	const mutation = useMutation(
		async () => {
			return await axios.post(`http://localhost:5000/users`, {
				login,
				password,
				fullName,
				email,
				phone,
			});
		},
		{
			onSuccess: (e) => {
				router.push('/');
				console.log(e);
			},
		}
	);
	function submit(e: any) {
		e.preventDefault();
		if (
			password === confirmPassword &&
			isEmail(email) &&
			password.length >= 6
		) {
			//@ts-ignore
			mutation.mutate({
				login: login,
				password: password,
				fullName: fullName,
				email: email,
				phone: phone,
			});
		} else {
			setError('Пароли не совпадают!');
		}
		if (!isEmail(email)) {
			setError('E-Mail введен не правильно!');
		}
		if (password.length < 6) {
			setError('Пароль должен быть минимум 6 символов');
		}
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
				<label>Подтвердите пароль</label>
				<Input
					value={confirmPassword}
					type='password'
					onChange={(e) => {
						setConfirmPassword(e.target.value);
					}}
				/>
				<label>ФИО</label>
				<Input
					value={fullName}
					type='text'
					onChange={(e) => {
						setFullName(e.target.value);
					}}
				/>
				<label>Электронная почта</label>
				<Input
					value={email}
					type='text'
					onChange={(e) => {
						console.log(isEmail(e.target.value));
						setEmail(e.target.value);
					}}
				/>
				<label>Телефон</label>
				<Input
					value={phone}
					type='text'
					onChange={(e) => {
						setPhone(e.target.value.replace(/\D/g, ''));
					}}
				/>
				<br />
				<Button type='submit' onClick={(e) => submit(e)}>
					Создать аккаунт
				</Button>
				<Link href='/login'>
					<Anchor>У меня есть аккаунт</Anchor>
				</Link>

				<Error>{error?.length > 0 && error}</Error>
			</Form>
		</Page>
	);
};

export default RegisterPage;
