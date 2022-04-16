import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Modal from 'styled-react-modal';
import { UserContext } from '../../context';
import MenuItem from '../forms/menu-item.component';
const Paragraph = styled.p`
	border-bottom: 1px dotted #c1c1c1;
`;
const InfoBox = styled.div`
	background-color: #e6e1e1;
	min-width: 30em;
	min-height: 24em;
	padding: 2.5em;
`;
const Button = styled.button<{ width?: number }>`
	width: ${(props) => (props.width ? props.width : 7.5)}em;
	border-radius: 0.25em;
	height: 3em;
	border: none;
	background: #fff;
	font-weight: 600;
	margin-top: 1em;
	font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
		Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
	margin-left: 2.3em;
	margin-right: 2.3em;

	&:hover {
		cursor: pointer;
	}
`;
export const Model = Modal.styled`
    width: 40%;	
    height: 100%;
    background-color: white;
    border-radius: 15px;
`;
const Image = styled.img`
	height: 15em;
	width: 15em;
	background-color: grey;
`;
interface IItem {
	_id: string;
	image: string;
	count: number;
	description: string;
	price: number;
	name: string;
}
const MenuContainer = ({ item }: { item: IItem }) => {
	//@ts-ignore;
	const { user, setUser } = useContext(UserContext);
	const [addMenuModal, setAddMenuModal] = useState(false);
	const [editMenuModal, setEditMenuModal] = useState(false);
	const [menuList, setMenuList] = useState();
	const router = useRouter();
	interface IEntertainment {
		_id: string;
		name: string;
	}
	useQuery(
		'menus',
		async () => {
			return await axios.get(`http://localhost:5000/menu/type`);
		},
		{
			onSuccess: (e) => {
				setMenuList(
					e.data?.map((item: IEntertainment) => ({
						value: item?._id,
						label: item?.name,
					}))
				);
			},
		}
	);
	const toggleMenuAddModal = () => {
		setAddMenuModal(!addMenuModal);
	};
	const toggleMenuEditModal = () => {
		setEditMenuModal(!editMenuModal);
	};
	return (
		<InfoBox key={item._id}>
			<Image src={item?.image} />
			<Paragraph>{item.name}</Paragraph>
			<Paragraph>{item.price} рублей</Paragraph>
			<Paragraph>Цена за {item.count}</Paragraph>
			<Paragraph>{item.description}</Paragraph>
			{user?.role === 'admin' && (
				<>
					<Button onClick={toggleMenuAddModal}>Добавить</Button>
					<Button onClick={toggleMenuEditModal}>Изменить</Button>
					<Button
						style={{ backgroundColor: 'red', color: 'white' }}
						onClick={() => {
							axios.delete(`http://localhost:5000/menu/${item._id}`, {
								headers: {
									Authorization: `Bearer ${sessionStorage.getItem('token')}`,
								},
							});
							router.reload();
						}}
					>
						Удалить
					</Button>
				</>
			)}
			<Model isOpen={editMenuModal} onBackgroundClick={toggleMenuEditModal}>
				<MenuItem status='edit' item={item} menuList={menuList} />
			</Model>
			<Model isOpen={addMenuModal} onBackgroundClick={toggleMenuAddModal}>
				<MenuItem status='add' item={item} menuList={menuList} />
			</Model>
		</InfoBox>
	);
};

export default MenuContainer;
