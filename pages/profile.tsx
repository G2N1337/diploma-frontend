import axios from 'axios';
import { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { UserContext } from '../context';

const BlackBox = styled.div`
  background: #bab9b9;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: fit-content;
  margin-left: 54px;
  margin-top: 34px;
  p {
    margin: 0;
  }
`;
const TextContainer = styled.div`
  margin: 35px;
`;
const Profile: React.FC = () => {
  //order-ent
  //GetHolidays
  const [orders, setOrders] = useState([]);
  useQuery(
    'get-orders',
    async () => {
      return await axios.get(`http://localhost:5000/order-ent`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
    },
    {
      onSuccess: (e) => {
        setOrders(e.data);
      },
    }
  );

  console.log({ orders });

  //@ts-ignore
  const { user, setUser } = useContext(UserContext);

  return (
    <BlackBox>
      <TextContainer>
        <p>{user.fullName}</p>
        <p>{user.phone}</p>
        <p>{user.email}</p>
      </TextContainer>
    </BlackBox>
  );
};

export default Profile;
