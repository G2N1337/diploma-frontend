import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';
import { useRouter } from 'next/router';
import isEmail from 'validator/lib/isEmail';

import axios from 'axios';
import { useMutation } from 'react-query';
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
const RegisterPage: NextPage = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [error, setError] = useState<string>('');
	const router = useRouter();
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
		if (password === confirmPassword && isEmail(email)) {
			//@ts-ignore
			mutation.mutate({
				login: login,
				password: password,
				fullName: fullName,
				email: email,
				phone: phone,
			});
		} else {
			//@ts-ignore
			setError('Пароли не совпадают!');
		}
		if (!isEmail(email)) {
			//@ts-ignore
			setError('E-Mail введен не правильно!');
		}
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
				<label>Подтвердите пароль</label>
				<input
					value={confirmPassword}
					type='password'
					onChange={(e) => {
						setConfirmPassword(e.target.value);
					}}
				/>
				<label>ФИО</label>
				<input
					value={fullName}
					type='text'
					onChange={(e) => {
						setFullName(e.target.value);
					}}
				/>
				<label>Электронная почта</label>
				<input
					value={email}
					type='text'
					onChange={(e) => {
						console.log(isEmail(e.target.value));
						setEmail(e.target.value);
					}}
				/>
				<label>Телефон</label>
				<input
					value={phone}
					type='text'
					onChange={(e) => {
						setPhone(e.target.value.replace(/\D/g, ''));
					}}
				/>
				<br />
				<button type='submit' onClick={(e) => submit(e)}>
					Создать аккаунт
				</button>

				<p>{error?.length > 0 && error}</p>
			</Form>
		</Page>
	);
};

export default RegisterPage;
