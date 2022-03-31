import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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
  addFunc,
}: {
  item: {
    _id: string;
    name: string;
    description: string;
    price: number;
  };
  addFunc: () => void;
}) => {
  const [inputValue, setInputValue] = useState(0);
  const [varietyPrice, setVarietyPrice] = useState(
    'Выберите правильное количество'
  );
  useEffect(() => {
    if (inputValue > 0) {
      setVarietyPrice((item?.price * inputValue).toString() + ' Руб.');
    } else {
      setVarietyPrice('Выберите правильное количество');
    }
  }, [inputValue]);
  return (
    <FoodLol>
      <Paragraph>{item?.name}</Paragraph>
      <Paragraph>{item?.description + ' ' + varietyPrice}</Paragraph>
      <input
        type='number'
        value={inputValue}
        onChange={(e) => setInputValue(parseInt(e.target.value))}
      ></input>
      <button
        onClick={() => {
          if (varietyPrice !== 'Выберите правильное количество') {
            axios
              .post(
                'http://localhost:5000/menuorder',
                {
                  name: item?.name,
                  price: item?.price * inputValue,
                  count: inputValue,
                  description: item?.description,
                  id: '6239a9f68f2a9d94af26c46a',
                },
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                  },
                }
              )
              .then((data) => {
                console.log(data);
              });
          } else {
            toast.error('Укажите количество!');
          }
        }}
      >
        Добавить
      </button>
    </FoodLol>
  );
};

export default FoodContainer;
