import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal from 'styled-react-modal';
import { UserContext } from '../../context';
import NewsModal from '../forms/news.modal.component';
interface INews {
	name: string;
	description: string;
	picture: string;
	id: string;
	item: object;
}
const MainContainter = styled.div`
	min-height: 300px;
	min-width: 300px;
`;
const Image = styled.img`
	min-height: 94px;
	min-width: 135px;
	background-color: grey;
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
export const Model = Modal.styled`
    width: 30%;	
    height: 70%;
    background-color: white;
    border-radius: 15px;
`;
const NewsComponent = ({ name, description, picture, id, item }: INews) => {
	const router = useRouter();
	const { user, setUser } = useContext(UserContext);
	const [addNewsModal, setAddNewsModal] = useState(false);
	const [editNewsModal, setEditNewsModal] = useState(false);
	const toggleNewsAddModal = () => {
		setAddNewsModal(!addNewsModal);
	};
	const toggleNewsEditModal = () => {
		setEditNewsModal(!editNewsModal);
	};
	return (
		<MainContainter>
			<Image src={`https://via.placeholder.com/300x300?text=${picture}`} />
			<p>{name}</p>
			<p>{description}</p>
			{user?.role === 'admin' && (
				<>
					<Button onClick={toggleNewsAddModal}>Добавить</Button>
					<Button onClick={toggleNewsEditModal}>Изменить</Button>
					<Button
						style={{ backgroundColor: 'red', color: 'white' }}
						onClick={() => {
							axios.delete(`http://localhost:5000/news/${id}`, {
								headers: {
									Authorization: `Bearer ${sessionStorage.getItem('token')}`,
								},
							});
							toast.success('Успешно удалено!');
							router.reload();
						}}
					>
						Удалить
					</Button>
				</>
			)}
			<Model isOpen={editNewsModal} onBackgroundClick={toggleNewsEditModal}>
				<NewsModal status='edit' item={item} />
			</Model>
			<Model isOpen={addNewsModal} onBackgroundClick={toggleNewsAddModal}>
				<NewsModal status='add' item={item} />
			</Model>
		</MainContainter>
	);
};

export default NewsComponent;
