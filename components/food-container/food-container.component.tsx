import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
interface IOrderItem {
	menu: string;
	count: number;
}

const FoodLol = styled.div`
	display: flex;
	gap: 10px;
	min-height: 2em;
	min-width: 100%;
	justify-content: space-between;
	align-items: stretch;
	margin-bottom: 10px;
	input {
		max-width: 7%;
	}
`;
const Button = styled.button`
	min-width: 25%;
	border: none;
	background-color: black;
	color: white;
	border-radius: 5px;
	cursor: pointer;
`;
const Paragraph = styled.p`
	margin: 0;
	width: 100%;
`;
const FoodContainer = ({
	item,
	orderList,
	setOrderList,
}: {
	item: {
		_id: string;
		name: string;
		description: string;
		price: number;
	};
	orderList: IOrderItem[];
	setOrderList: (items: IOrderItem[]) => void;
}) => {
	const [inputValue, setInputValue] = useState(0);
	const [varietyPrice, setVarietyPrice] = useState('Укажите количество');
	const [textButton, setText] = useState<string>(
		orderList.filter((orderItem) => orderItem.menu === item._id).length > 0
			? 'Обновить'
			: 'Добавить'
	);

	useEffect(() => {
		if (inputValue > 0) {
			setVarietyPrice((item.price * inputValue).toString() + ' Руб.');
		} else {
			setVarietyPrice('Укажите количество');
		}

		setText(
			orderList.filter((orderItem) => orderItem.menu === item._id).length > 0
				? 'Обновить'
				: 'Добавить'
		);
	}, [inputValue, textButton]);

	return (
		<FoodLol>
			<Paragraph>{item.name}</Paragraph>
			<Paragraph>{varietyPrice}</Paragraph>
			<input
				type='number'
				value={inputValue}
				onChange={(e) => setInputValue(parseInt(e.target.value))}
			></input>
			<Button
				type='button'
				onClick={() => {
					let isOrder: IOrderItem[];
					isOrder = orderList.filter((orderItem) => orderItem.menu === item._id);

					//Добавить
					if (isOrder.length === 0) {
						orderList.push({ menu: item._id, count: inputValue });
					}

					//Изменить
					if (isOrder.length > 0) {
						orderList.map((orderItem) => {
							if (orderItem.menu === item._id) {
								orderItem.count = inputValue;
							}
						});
					}
					setOrderList(orderList);
				}}
			>
				{textButton}
			</Button>
		</FoodLol>
	);
};

export default FoodContainer;

// onClick={() => {
//   if (varietyPrice !== 'Укажите количество') {
//     axios
//       .post(
//         'http://localhost:5000/menuorder',
//         {
//           name: item?.name,
//           price: item?.price * inputValue,
//           count: inputValue,
//           description: item?.description,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem('token')}`,
//           },
//         }
//       )
//       .then((data) => {
//         console.log(data);
//       });
//   } else {
//     toast.error('Укажите количество!');
//   }
// }}
