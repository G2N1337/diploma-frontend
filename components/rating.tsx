import styled from 'styled-components';
const TextBlock = styled.div`
	width: 18em;
	margin-top: 1em;
`;
const RatingBlock = styled.div`
	background-color: #ececec;
	box-shadow: 3px 10px 19px 0px rgba(34, 60, 80, 0.11);
	max-width: 20em;
	padding: 10px;
	border-radius: 5px;
	h3 {
		margin: 0;
	}
`;
const Rating = ({
	value,
	text,
	color,
	name,
}: {
	value: number;
	text: string;
	color: string;
	name: string;
}) => {
	return (
		<RatingBlock>
			<h3>{name}</h3>
			<span>
				<i
					style={{ color }}
					className={
						value >= 1
							? 'fas fa-star'
							: value >= 0.5
							? 'fas fa-star-half-alt'
							: 'far fa-star'
					}
				></i>
			</span>
			<span>
				<i
					style={{ color }}
					className={
						value >= 2
							? 'fas fa-star'
							: value >= 1.5
							? 'fas fa-star-half-alt'
							: 'far fa-star'
					}
				></i>
			</span>
			<span>
				<i
					style={{ color }}
					className={
						value >= 3
							? 'fas fa-star'
							: value >= 2.5
							? 'fas fa-star-half-alt'
							: 'far fa-star'
					}
				></i>
			</span>
			<span>
				<i
					style={{ color }}
					className={
						value >= 4
							? 'fas fa-star'
							: value >= 3.5
							? 'fas fa-star-half-alt'
							: 'far fa-star'
					}
				></i>
			</span>
			<span>
				<i
					style={{ color }}
					className={
						value >= 5
							? 'fas fa-star'
							: value >= 4.5
							? 'fas fa-star-half-alt'
							: 'far fa-star'
					}
				></i>
			</span>
			<TextBlock>{text}</TextBlock>
		</RatingBlock>
	);
};

Rating.defaultProps = {
	color: '#d2e009',
};

export default Rating;
