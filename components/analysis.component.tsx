import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
const Container = styled.div`
	display: grid;
	padding: 55px;
	grid-template-columns: 1fr 1fr 1fr 1fr;
`;
const TypeContainer = styled.div``;
const AnalysisComponent = () => {
	const [banquetType, setBanquetType] = useState([]);
	const [program, setProgram] = useState([]);
	const [food, setFood] = useState([]);
	const [entertainment, setEntertainment] = useState([]);
	useQuery(
		'banquet',
		async () => {
			return await axios.get(`http://localhost:5000/banquet/type`);
		},
		{
			onSuccess: (e) => {
				setBanquetType(e.data);
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
				setProgram(e.data);
			},
		}
	);
	useQuery(
		'menus',
		async () => {
			return await axios.get(`http://localhost:5000/menu`);
		},
		{
			onSuccess: (e) => {
				setFood(e.data);
			},
		}
	);
	useQuery(
		'entertainment',
		async () => {
			return await axios.get(`http://localhost:5000/entertainment`);
		},
		{
			onSuccess: (e) => {
				setEntertainment(e.data);
			},
		}
	);
	console.log(entertainment);
	return (
		<Container>
			<TypeContainer>
				<h3>Банкеты</h3>
				{banquetType?.map((item) => (
					<p>
						{item.name}: {item.ordered}
					</p>
				))}
			</TypeContainer>
			<TypeContainer>
				<h3>Анимационные программы</h3>
				{program?.map((item) => (
					<p>
						{item.name}: {item.ordered}
					</p>
				))}
			</TypeContainer>
			<TypeContainer>
				<h3>Меню</h3>
				{food?.map((item) => (
					<p>
						{item.name}: {item.ordered}
					</p>
				))}
			</TypeContainer>
			<TypeContainer>
				<h3>Развлечения</h3>
				{entertainment?.map((item) => (
					<p>
						{item.name}: {item.ordered}
					</p>
				))}
			</TypeContainer>
		</Container>
	);
};

export default AnalysisComponent;
