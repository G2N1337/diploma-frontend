import styled from 'styled-components';
import { useContext, useState } from 'react';
import Modal from 'styled-react-modal';
import ModalProgram from '../forms/program.component';
import axios from 'axios';
import { useRouter } from 'next/router';
import { UserContext } from '../../context';
const Paragraph = styled.p`
	border-bottom: 1px dotted #c1c1c1;
`;
export const Model = Modal.styled`
	width: 30%;	
	height: 70%;
	background-color: white;
	border-radius: 15px;
`;
const ProgramContainer = styled.div`
	min-width: 25em;
`;
const Button = styled.button<{ width?: number }>`
	width: ${(props) => (props.width ? props.width : 110)}px;
	border-radius: 4px;
	height: 2.3em;
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
interface IItem {
	_id: string;
	name: string;
	description: string;
	price: number;
}
//@ts-ignore
const ProgramComponent = ({ item }) => {
	const [addProgramModal, setAddProgramModal] = useState(false);
	const [editProgramModal, setEditProgramModal] = useState(false);

	const router = useRouter();
	//@ts-ignore
	const { user, setUser } = useContext(UserContext);
	const toggleProgramAddModal = () => {
		setAddProgramModal(!addProgramModal);
	};
	const toggleProgramEditModal = () => {
		setEditProgramModal(!editProgramModal);
	};
	return (
		<ProgramContainer key={item._id}>
			<Paragraph>Анимационная программа: </Paragraph>
			<Paragraph>{item?.name}</Paragraph>
			<Paragraph>{item?.description}</Paragraph>
			<Paragraph>{item?.price}</Paragraph>
			{user?.role === 'admin' && (
				<>
					<Button onClick={toggleProgramAddModal}>Добавить</Button>
					<Button onClick={toggleProgramEditModal}>Изменить</Button>
					<Button
						style={{ backgroundColor: 'red', color: 'white' }}
						onClick={() =>
							axios
								.delete(`http://localhost:5000/program/${item?._id}`, {
									headers: {
										Authorization: `Bearer ${sessionStorage.getItem('token')}`,
									},
								})
								.then(() => {
									router.reload();
								})
						}
					>
						Удалить
					</Button>
				</>
			)}
			<Model isOpen={editProgramModal} onBackgroundClick={toggleProgramEditModal}>
				<ModalProgram status='edit' item={item} />
			</Model>
			<Model isOpen={addProgramModal} onBackgroundClick={toggleProgramAddModal}>
				<ModalProgram status='add' item={item} />
			</Model>
		</ProgramContainer>
	);
};

export default ProgramComponent;
