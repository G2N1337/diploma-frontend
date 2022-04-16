import { useState } from 'react';
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
}

const OrderMod = ({ item }: IOrderMod) => {
	const [modalOpen, setModalOpen] = useState(false);
	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};
	return (
		<>
			<p>{item?.name}</p>

			<button onClick={toggleModal}>Подробнее</button>
			<Model isOpen={modalOpen} onBackgroundClick={toggleModal}>
				<OrderModModal id={item._id} />
			</Model>
		</>
	);
};

export default OrderMod;
