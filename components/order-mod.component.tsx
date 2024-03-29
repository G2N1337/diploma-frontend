import { useState } from 'react';
import styled from 'styled-components';
import Modal from 'styled-react-modal';
import OrderModModal from './order-mod-modal.component';
export const Model = Modal.styled`
    width: 90%;	
    height: 100%;
    background-color: white;
    border-radius: 15px;
    overflow-y: scroll;
`;
interface IOrderMod {
	item: IItem;
}
interface IItem {
	name: string;
	_id: string;
	workTime: string;
	createdAt: string;
}
const OrderBlock = styled.div`
	display: flex;
	flex-direction: column;
	background-color: lightgrey;
	color: black;
	border-radius: 10px;
	width: fit-content;
	height: fit-content;
`;
const OrderMod = ({ item }: IOrderMod) => {
	const [modalOpen, setModalOpen] = useState(false);
	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};
	return (
		<OrderBlock>
			<p>{item?.name}</p>
			{item?.workTime.includes('|') ? (
				<p>
					Дата проведения: {item?.workTime.split('|')[1]}, Дата заказа:
					{item?.createdAt.split('T')[0]}
				</p>
			) : (
				<p>
					Дата проведения: {item?.workTime}, Дата заказа:{' '}
					{item?.createdAt.split('T')[0]}
				</p>
			)}
			<button onClick={toggleModal}>Подробнее</button>
			<Model isOpen={modalOpen} onBackgroundClick={toggleModal}>
				<OrderModModal id={item._id} />
			</Model>
		</OrderBlock>
	);
};

export default OrderMod;
