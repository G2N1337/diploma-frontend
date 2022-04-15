import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useContext, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import BanquetModal from '../../components/modal/banquet-modal.component';
import { ToastContainer } from 'react-toastify';
import { UserContext } from '../../context';
import ModalBanquet from '../../components/forms/modal-banquet.component';
import { ModalContent, Model } from '../entertainment/[id]';
import ProgramComponent from '../../components/program/program.component';
interface IBanquet {
	name: string;
	description: string;
	banquet: any;
	price: number;
	image: string;
}
interface IProgram {
	name: string;
	description: string;
	price: number;
	image: string;
}

const Page = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;
const Image = styled.img`
	height: 15em;
	width: 15em;
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

const Headline = styled.div`
	height: 250px;
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	background-color: #e6e1e1;
	background-image: url('https://www.sgu.ru/sites/default/files/depnews/image/2015/02/-.png');
	background-repeat: no-repeat;
	background-size: cover; /* Resize the background image to cover the entire container */
	background-position: center; /* Center the image */

	h1 {
		background: #c1c1c1;
		border-radius: 4px;
		padding: 10px;
		backdrop-filter: blur(10px);
	}
`;
const Container = styled.div`
	background-color: #c4c4c4;
	height: 100%;
	width: 100%;
`;
const InfoBox = styled.div`
	display: flex;

	max-width: 20em;
	padding: 2em;
	flex-direction: row;
	gap: 3em;
`;
const InfoContainer = styled.div`
	margin: 40px 0 0 48px;
	display: flex;
	background-color: lightgrey;
	flex-direction: row;
	max-width: 80%;
	gap: 10em;
	overflow-x: scroll;
`;
const MegaContainer = styled.div`
	margin: 40px 0 0 48px;
	display: flex;
	flex-direction: column;
	height: 200px;
`;
const Paragraph = styled.p`
	border-bottom: 1px dotted #c1c1c1;
`;

const OrderButton = styled.button`
	padding: 0.6em 1.1em;
	background-color: #696969;
	color: #fff;
	margin-left: 48px;
	margin-top: 50px;
	border: none;
	cursor: pointer;
`;

const Menu: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { user, setUser } = useContext(UserContext);

	const [banquetModal, setModal] = useState<boolean>(false);
	const [banquet, setBanquet] = useState<IBanquet>();
	const [program, setProgram] = useState<IProgram>();
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [addProgramModal, setAddProgramModal] = useState(false);
	const [editProgramModal, setEditProgramModal] = useState(false);
	const toggleModal = () => {
		setModal(!banquetModal);
	};
	const toggleAddModal = () => {
		setAddModal(!addModal);
	};
	const toggleEditModal = () => {
		setEditModal(!editModal);
	};
	const toggleProgramAddModal = () => {
		setAddProgramModal(!addProgramModal);
	};
	const toggleProgramEditModal = () => {
		setEditProgramModal(!editProgramModal);
	};
	useQuery(
		'banquet',
		async () => {
			return await axios.get(`http://localhost:5000/banquet/type/${id}`);
		},
		{
			onSuccess: (e) => {
				console.log(e.data);
				setBanquet(e.data);
			},
		}
	);
	useQuery(
		'program',
		async () => {
			return await axios.get(`http://localhost:5000/program`);
		},
		{
			onSuccess: (e) => {
				console.log(e.data);
				setProgram(e.data);
			},
		}
	);

	return (
		<Page>
			<ModalContent>
				<Model isOpen={addModal} onBackgroundClick={toggleAddModal}>
					<ModalBanquet status='add' item={banquet} />
				</Model>
				<Model isOpen={editModal} onBackgroundClick={toggleEditModal}>
					<ModalBanquet status='edit' item={banquet} />
				</Model>
				{/* <Model isOpen={addProgramModal} onBackgroundClick={toggleProgramAddModal}>
					<ModalBanquet status='admin' item={program} />
				</Model> */}
			</ModalContent>
			<Headline>{banquet?.name && <h1>{banquet?.name}</h1>}</Headline>
			<Container>
				{user?.role === 'admin' && (
					<>
						<Button onClick={toggleEditModal}>Изменить</Button>
						<Button onClick={toggleAddModal}>Добавить</Button>
						<Button
							style={{ backgroundColor: 'red', color: 'white' }}
							onClick={() =>
								axios
									.delete(`http://localhost:5000/banquet/type/${id}`, {
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
				<MegaContainer>
					<Paragraph>{banquet?.name}</Paragraph>
					<Paragraph>{banquet?.description}</Paragraph>
					<Paragraph>Цена: {banquet?.price}</Paragraph>
				</MegaContainer>
				<Image src={banquet?.image} />
				<InfoContainer>
					<InfoBox>
						{!!program &&
							program?.map((item: any) => <ProgramComponent item={item} />)}
					</InfoBox>
				</InfoContainer>
				<OrderButton
					type='button'
					onClick={() => {
						setModal(true);
					}}
				>
					Оставить заявку
				</OrderButton>
				<ToastContainer position='bottom-left' theme='dark' />
				<BanquetModal openModal={banquetModal} toggleModal={toggleModal} />
			</Container>
		</Page>
	);
};

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	return {
		props: {
			key: context.params?.id,
		},
	};
};

export default Menu;
