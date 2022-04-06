import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IOrderItem } from '../../pages/menu/[id]';

const FoodLol = styled.div`
	display: flex;
	gap: 5px;
	input {
		margin-top: 15px;
		height: 40%;
	}
`;

const Paragraph = styled.p`
	border-bottom: 1px dotted #c1c1c1;
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
	const [varietyPrice, setVarietyPrice] = useState(
		'Выберите правильное количество'
	);
	const [textButton, setText] = useState<string>(
		orderList.filter((orderItem) => orderItem.menu === item._id).length > 0
			? 'Обновить'
			: 'Добавить'
	);

	useEffect(() => {
		if (inputValue > 0) {
			setVarietyPrice((item.price * inputValue).toString() + ' Руб.');
		} else {
			setVarietyPrice('Выберите правильное количество');
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
			<Paragraph>{item.description + ' ' + varietyPrice}</Paragraph>
			<input
				type='number'
				value={inputValue}
				onChange={(e) => setInputValue(parseInt(e.target.value))}
			></input>
			<button
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
			</button>
		</FoodLol>
	);
};

export default FoodContainer;

// onClick={() => {
//   if (varietyPrice !== 'Выберите правильное количество') {
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
