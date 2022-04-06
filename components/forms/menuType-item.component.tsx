import Modal from 'styled-react-modal';
import styled from 'styled-components';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';
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
const Selector = styled(Select)`
	margin-bottom: 15px;
	font-weight: 600;
	width: 75%;
	text-align: center;
	.css-1s2u09g-control {
		background-color: #fff;
		min-width: 225px;
	}
	.css-1pahdxg-control {
		background-color: #fff;
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
const MenuItem = ({ item, status, menuList }) => {
	const router = useRouter();
	const [name, setName] = useState(item?.name);
	const [price, setPrice] = useState(item?.price);
	const [description, setDescription] = useState(item?.description);
	const [image, setImage] = useState(item?.image);
	const [menu, setMenu] = useState(item?.menuType);
	const id = item?._id;
	interface IEntertainment {
		_id: string;
		name: string;
	}

	const mutationEdit = useMutation(
		async () => {
			return await axios.put(
				`http://localhost:5000/menu/type/${id}`,
				{
					name: name,
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
				console.log(e);
				router.push('/');
			},
		}
	);
	const mutationAdd = useMutation(
		async () => {
			return await axios.post(
				`http://localhost:5000/menu/type/${id}`,
				{
					name: name,
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
				router.push('/');
			},
		}
	);
	const submitEdit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (name) {
			//@ts-ignore
			mutationEdit.mutate({
				name: name,
			});
		}
	};
	const submitAdd = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (name) {
			//@ts-ignore
			mutationAdd.mutate({
				name: name,
			});
		}
	};

	return (
		<Form onSubmit={status === 'add' ? submitAdd : submitEdit}>
			{status === 'add' ? (
				<>
					<h1>Создание новой позиции в меню</h1>
					<Input
						placeholder='Имя'
						value={name}
						width={75}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
				</>
			) : (
				<>
					<h1>Редактирование {item?.name}</h1>
					<Input
						placeholder='Имя'
						width={75}
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
				</>
			)}

			<Button type='submit'>Подтвердить</Button>
		</Form>
	);
};
export default MenuItem;
