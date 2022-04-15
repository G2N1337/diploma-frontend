import Modal from 'styled-react-modal';
import styled from 'styled-components';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
export const ModalContent = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: center;
`;
export const Model = Modal.styled`
    width: 30%;	
    height: 70%;
    background-color: white;
    border-radius: 15px;
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

const BigInput = styled.textarea<{
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
const Image = styled.img`
	height: 15em;
	width: 15em;
	background-color: grey;
`;
const NewsModal = ({ item, status }) => {
	const router = useRouter();
	const [name, setName] = useState(item?.name);
	const [description, setDescription] = useState(item?.description);
	const [picture, setPicture] = useState(item?.picture);
	const id = item?._id;
	const mutationEdit = useMutation(
		async () => {
			return await axios.put(
				`http://localhost:5000/news/${id}`,
				{
					name: name,
					description: description,
					picture: picture,
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
				toast.success(`Успешно изменено`);
				router.reload();
			},
		}
	);
	const mutationAdd = useMutation(
		async () => {
			return await axios.post(
				`http://localhost:5000/news`,
				{
					name: name,
					description: description,
					picture: picture,
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
				toast.success(`Успешно добавлено`);
				router.reload();
			},
		}
	);
	const submitEdit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (name) {
			//@ts-ignore
			mutationEdit.mutate({
				name: name,
				description: description,
				picture: picture,
			});
		}
	};
	const submitAdd = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (name) {
			//@ts-ignore
			mutationAdd.mutate({
				name: name,
				description: description,
				picture: picture,
			});
		}
	};
	const toBase64 = (file: Blob) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader?.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	const handleImageUpload = async (event: Event) => {
		const input = event.target as HTMLInputElement;

		const imageFile = input.files[0];
		console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
		console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

		const options = {
			maxSizeMB: 0.5,
			maxWidthOrHeight: 240,
			useWebWorker: true,
		};
		try {
			const compressedFile = await imageCompression(imageFile, options);
			console.log(
				'compressedFile instanceof Blob',
				compressedFile instanceof Blob
			); // true
			console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

			setPicture(await toBase64(compressedFile)); // write your own logic
			console.log({ base64: await toBase64(compressedFile) });
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Form onSubmit={status === 'add' ? submitAdd : submitEdit}>
			{status === 'add' ? (
				<>
					<h1>Создание новой новости</h1>
					<Input
						placeholder='Имя'
						value={name}
						width={75}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>

					<input
						type='file'
						width={75}
						// value={picture}
						accept='image/*'
						onChange={async (e) => {
							handleImageUpload(e);
						}}
					/>
					<BigInput
						placeholder={'Описание'}
						height={30}
						width={75}
						value={description}
						onChange={(e) => {
							setDescription(e.target.value);
						}}
					/>
				</>
			) : (
				<>
					<h1>Редактирование {item?.name}</h1>
					<Image src={picture} />

					<Input
						placeholder='Название'
						width={75}
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
					<input
						type='file'
						width={75}
						// value={picture}
						accept='image/*'
						onChange={async (e) => {
							handleImageUpload(e);
						}}
					/>
					<BigInput
						placeholder={'Описание'}
						width={75}
						height={30}
						value={description}
						onChange={(e) => {
							setDescription(e.target.value);
						}}
					/>
				</>
			)}

			<Button type='submit'>Подтвердить</Button>
		</Form>
	);
};
export default NewsModal;
