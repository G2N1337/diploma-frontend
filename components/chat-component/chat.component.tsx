import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import moment from 'moment';
const MessageItem = styled.div`
	max-width: 80%;
	height: fit-content;
	margin: 5px;
	display: flex;
	flex-direction: column;
	position: relative;

	overflow-wrap: break-word;
	padding: 0;
	background-color: #e5e5ea;
	border-radius: 15px 15px 15px 0;
	p {
		margin: 10px;
	}
	&.mine {
		background-color: #0b93f6;
		transform: translateX(23%);
		border-radius: 15px 15px 0 15px;
		color: white;
	}
`;
const DateTime = styled.p`
	margin: 0;
	position: absolute;
	top: 0;
	right: 0;
`;
const ChatRoom = styled.div`
	width: 30em;
	height: 50em;
	border: 1px black solid;
	overflow-y: scroll;
	bottom: 0;
	overflow-x: hidden;
	background-color: white;
`;
const InputRoom = styled.div`
	position: relative;
`;
const InputDiv = styled.div`
	width: 30em;
`;
const Input = styled.input`
	bottom: 0;
	width: 80%;
	height: 3em;
	border-radius: 0 0 0 15px;
	border: 1px grey solid;
`;
const Button = styled.button`
	bottom: 0;
	right: 0;
	height: 3em;
	width: 20%;
	color: white;
	background-color: black;
	border-radius: 0 0 15px 0;
	cursor: pointer;
	border: none;
`;
interface IUser {
	fullName: string;
}
const ChatComponent = ({
	chat,
	user,
	manager,
}: {
	chat: string;
	user: IUser;
	manager: string;
}) => {
	const [messages, setMessages] = useState([]);
	const [content, setContent] = useState('');

	const messagesEndRef = useRef(null);

	const mutation = useMutation(
		async () => {
			return await axios.post(
				manager ? `http://localhost:5000/chat/mod` : `http://localhost:5000/chat`,
				{
					id: chat,
					content,
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
				console.log(e);
				setContent('');
			},
		}
	);
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
		});
	}, [messages]);
	const { status, data, error, isFetching, isLoading } = useQuery(
		'get-messages',
		async () => {
			return await axios.get(
				manager
					? `http://localhost:5000/chat/mod/${chat}`
					: `http://localhost:5000/chat/${chat}`,
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('token')}`,
					},
				}
			);
		},
		{
			refetchInterval: 2500,
			refetchOnWindowFocus: 'always',
			onSuccess: (e) => {
				setMessages(e.data.messages);
			},
		}
	);

	return (
		<InputRoom>
			<ChatRoom>
				{isLoading ? (
					<Oval
						ariaLabel='loading-indicator'
						height={100}
						width={100}
						strokeWidth={5}
						strokeWidthSecondary={1}
						color='blue'
						secondaryColor='white'
					/>
				) : (
					messages.map((item) => (
						<MessageItem
							key={item._id}
							className={item?.userName === user?.fullName ? 'mine' : 'his'}
						>
							{' '}
							<p>{item?.userName}</p>
							<p>{item?.content}</p>
							<DateTime>
								{moment(item?.createdAt).format('DD.MM.yyyy hh:mm:ss')}
							</DateTime>
						</MessageItem>
					))
				)}
				<div ref={messagesEndRef} />
			</ChatRoom>
			<InputDiv>
				<Input
					value={content}
					onChange={(e) => {
						setContent(e.target.value);
					}}
				/>
				<Button
					onClick={(e) => {
						e.preventDefault();
						//@ts-ignore
						mutation.mutate({
							id: chat,
							content: content,
						});
					}}
				>
					Отправить
				</Button>
			</InputDiv>
		</InputRoom>
	);
};

export default ChatComponent;
