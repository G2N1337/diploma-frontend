import axios from 'axios';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { UserContext } from '../context';
interface IWHData {
	width?: number;
	height?: number;
}
const StarContainer = styled.div``;
const StarSpan = styled.span`
	width: 5em;
`;
const Slider = styled.input`
	position: relative;
	left: -0.325em;
	top: -1.525em;
	width: 7.3em;

	& {
		-webkit-appearance: none;
	}
	&:hover {
		cursor: pointer;
	}
	&::-webkit-slider-runnable-track {
		width: 300px;
		height: 16px;
		border: none;
		background-color: rgba(0, 0, 0, 0);
		border-radius: 3px;
	}

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		border: none;
		height: 16px;
		width: 16px;
		background: none;
	}
	&::-webkit-slider-thumb {
		cursor: pointer;
	}
	&:focus {
		outline: none;
	}

	&:focus::-webkit-slider-runnable-track {
		background-color: rgba(0, 0, 0, 0);
	}
`;
const Form = styled.form`
	width: 100%;
	height: 25em;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
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
const Button = styled.button<IWHData>`
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
const RatingForm = ({ order }: { order: string }) => {
	//@ts-ignore
	const { user } = useContext(UserContext);
	const [value, setValue] = useState(5);
	const [name, setName] = useState(user?.fullName);
	const [testimonial, setTestimonial] = useState('');

	const submitHandler = (e: React.SyntheticEvent) => {
		e.preventDefault();
		axios
			.post(
				'http://localhost:5000/rating',
				{
					order,
					text: testimonial,
					value,
					name,
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('token')}`,
					},
				}
			)
			.then(() => toast.success('Ваш отзыв был успешно отправлен!'))
			.catch((e) =>
				toast.error('Скорее всего вы уже оставляли отзыв на этот заказ')
			);
	};
	return (
		<Form onSubmit={(e) => submitHandler(e)}>
			<h1>Оставить отзыв</h1>
			<label>Ваше имя:</label>
			<Input width={75} value={name} onChange={(e) => setName(e.target.value)} />
			<label>Опишите ваши впечатления:</label>
			<BigInput
				width={75}
				height={30}
				value={testimonial}
				onChange={(e) => setTestimonial(e.target.value)}
			/>
			<StarContainer>
				<StarSpan>
					<i
						style={{ color: '#d2e009' }}
						className={
							value >= 1
								? 'fas fa-star'
								: value >= 0.5
								? 'fas fa-star-half-alt'
								: 'far fa-star'
						}
					></i>
				</StarSpan>
				<StarSpan>
					<i
						style={{ color: '#d2e009' }}
						className={
							value >= 2
								? 'fas fa-star'
								: value >= 1.5
								? 'fas fa-star-half-alt'
								: 'far fa-star'
						}
					></i>
				</StarSpan>
				<StarSpan>
					<i
						style={{ color: '#d2e009' }}
						className={
							value >= 3
								? 'fas fa-star'
								: value >= 2.5
								? 'fas fa-star-half-alt'
								: 'far fa-star'
						}
					></i>
				</StarSpan>
				<StarSpan>
					<i
						style={{ color: '#d2e009' }}
						className={
							value >= 4
								? 'fas fa-star'
								: value >= 3.5
								? 'fas fa-star-half-alt'
								: 'far fa-star'
						}
					></i>
				</StarSpan>
				<StarSpan>
					<i
						style={{ color: '#d2e009' }}
						className={
							value >= 5
								? 'fas fa-star'
								: value >= 4.5
								? 'fas fa-star-half-alt'
								: 'far fa-star'
						}
					></i>
				</StarSpan>
			</StarContainer>
			<Slider
				value={value}
				onChange={(e) => {
					setValue(parseFloat(e.target.value));
				}}
				style={{ background: 'inherit' }}
				type='range'
				step={0.5}
				max={5}
				min={0}
			/>
			<Button type='submit' style={{ backgroundColor: 'black', color: 'white' }}>
				Отправить
			</Button>
		</Form>
	);
};

export default RatingForm;
