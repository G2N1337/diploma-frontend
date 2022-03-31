import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';

import axios from 'axios';
import styled from 'styled-components';
import { UserContext } from '../../context';

interface IProps {}

interface IFormData {
  name: string;
  banquet: string;
  entertainment: string;
  banquetType: string;
  menu: string;
  date: string;
  commentary: string;
}

interface IDataDB {
  _id: string;
  name: string;
}

const FormStyles = styled.form`
  display: flex;
  margin: 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: none;
  height: 100%;
  h1 {
    display: flex;
    padding-bottom: 5px;
    justify-content: center;
    align-items: center;
    width: 70%;
    border-bottom: 1px dotted black;
  }
`;

const InputRow = styled.div`
  width: 75%;

  label {
    width: 100%;
  }

  input,
  select {
    box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
    border-radius: 4px;
    padding: 0.6rem 1.5rem;
    border: 0.3px dotted gray;
    background-color: white;
    margin-bottom: 15px;
    min-height: 15px;
    width: 100%;
  }

  textarea {
    box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.07);
    border-radius: 4px;
    padding: 0.6rem 1.5rem;
    border: 0.3px dotted gray;
    background-color: white;
    margin-bottom: 15px;
    min-height: 100px;
    width: 100%;
    resize: none;
  }
`;

export default function HolidayOrder({}: IProps) {
  //Для валидации даты
  let todayRaw = new Date();
  let today =
    todayRaw.getFullYear() +
    '-' +
    (todayRaw.getMonth() + 1 < 10
      ? '0' + (todayRaw.getMonth() + 1)
      : todayRaw.getMonth() + 1 < 10) +
    '-' +
    todayRaw.getDate();

  //@ts-ignore
  const { user } = useContext(UserContext);

  const [data, setData] = useState<IFormData>({
    name: '',
    banquet: '',
    entertainment: '',
    banquetType: '',
    menu: '',
    date: today,
    commentary: '',
  });

  React.useEffect(() => {
    setData({ ...data, name: user?.fullName });
  }, [user]);

  //GetHolidays
  const [holidays, setHolidays] = useState<IDataDB[]>([]);
  useQuery(
    'get-holidays',
    async () => {
      return await axios.get(`http://localhost:5000/banquet`);
    },
    {
      onSuccess: (e) => {
        setHolidays(e.data);
      },
    }
  );

  //Get Orders By User
  const [orders, setOrders] = useState<IDataDB[]>([]);
  useQuery(
    'get-orders-by-user',
    async () => {
      return await axios.get(`http://localhost:5000/menuorder`, {
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

  //GetHolidays
  const [banquetes, setBanquetes] = useState<IDataDB[]>([]);
  useQuery(
    'get-banquetes',
    async () => {
      return await axios.get(`http://localhost:5000/banquet/type`);
    },
    {
      onSuccess: (e) => {
        setBanquetes(e.data);
      },
    }
  );

  //GetEntertainments
  const [entertainments, setEntertainments] = useState<IDataDB[]>([]);
  useQuery(
    'get-entertainments',
    async () => {
      return await axios.get(`http://localhost:5000/entertainment`);
    },
    {
      onSuccess: (e) => {
        setEntertainments(e.data);
      },
    }
  );

  //GetMenus - либо наши заказы, либо этот список
  // const [menus, setMenus] = useState<IDataDB[]>([]);
  // useQuery(
  //   'get-menus',
  //   async () => {
  //     return await axios.get(`http://localhost:5000/menu/type`);
  //   },
  //   {
  //     onSuccess: (e) => {
  //       setMenus(e.data);
  //     },
  //   }
  // );

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log({ formDataSubmited: data });
    const {
      name,
      banquet,
      banquetType,
      commentary,
      date,
      entertainment,
      menu,
    } = data;
    await axios.post(
      `http://localhost:5000/order-ent`,
      {
        name,
        banquet,
        banquetType,
        commentary,
        workTime: date,
        entertainment,
        menu,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    );
  };

  useEffect(() => {
    setData({
      ...data,
      name: user?.fullName,
      banquet: banquetes[0]?._id,
      entertainment: entertainments[0]?._id,
      menu: orders[0]?._id,
      banquetType: holidays[0]?._id,
    });
  }, [holidays, entertainments, banquetes, orders]);

  return (
    <FormStyles onSubmit={submitHandler}>
      <h1>Заказать праздник</h1>

      {/* Имя */}
      <InputRow>
        <label>
          {/* Имя: */}
          <input
            type='user'
            value={data.name}
            placeholder='Ваше имя'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({ ...data, name: e.target.value })
            }
            name='user-name'
            autoComplete='on'
          />
        </label>
      </InputRow>

      {/* Выбор праздника */}
      <InputRow>
        <label>
          <select
            value={data.banquet}
            onChange={(e: any) => setData({ ...data, banquet: e.target.value })}
          >
            <option defaultChecked disabled>
              Выберите праздник
            </option>
            {banquetes &&
              banquetes.map((holiday: { name: string; _id: string }) => (
                <option key={holiday._id} value={holiday._id}>
                  {holiday.name}
                </option>
              ))}
          </select>
        </label>
      </InputRow>

      {/* Выбор развлечений */}
      <InputRow>
        <label>
          <select
            value={data.entertainment}
            onChange={(e: any) => {
              setData({ ...data, entertainment: e.target.value });
              console.log({ data });
            }}
          >
            <option defaultChecked disabled>
              Выберите развлечение
            </option>
            {entertainments &&
              entertainments.map(
                (entertainment: { name: string; _id: string }) => (
                  <option key={entertainment._id} value={entertainment._id}>
                    {entertainment.name}
                  </option>
                )
              )}
          </select>
        </label>
      </InputRow>

      {/* Выбор меню */}
      <InputRow>
        <label>
          <select
            value={data.menu}
            onChange={(e: any) => {
              setData({ ...data, menu: e.target.value });
              console.log({ data });
            }}
          >
            <option defaultChecked disabled>
              Выберите меню
            </option>
            {orders &&
              orders.map((menu: { name: string; _id: string }) => (
                <option key={menu._id} value={menu._id}>
                  {menu.name}
                </option>
              ))}
          </select>
        </label>
      </InputRow>

      {/* Выбор анимационной программы */}
      <InputRow>
        <label>
          <select
            value={data.menu}
            onChange={(e: any) =>
              setData({ ...data, banquetType: e.target.value })
            }
          >
            <option defaultChecked disabled>
              Выберите программу
            </option>
            {holidays &&
              holidays.map((holiday: { name: string; _id: string }) => (
                <option key={holiday._id} value={holiday._id}>
                  {holiday.name}
                </option>
              ))}
          </select>
        </label>
      </InputRow>

      {/* Дата праздника */}
      <InputRow>
        <label>
          {/* Дата праздника: */}
          <input
            type='date'
            name='holiday-start'
            value={data.date}
            onChange={(e: any) => setData({ ...data, date: e.target.value })}
            min={today}
            max={todayRaw.getFullYear() + '-12-31'}
          />
        </label>
      </InputRow>

      {/* Сообщение */}
      <InputRow>
        <label>
          Комментарий:
          <textarea
            placeholder='Сообщение'
            value={data.commentary}
            onChange={(e: any) => {
              setData({ ...data, commentary: e.target.value });
            }}
            name='commentary'
            autoComplete='off'
          />
        </label>
      </InputRow>

      {/* Кнопка подтверждения */}
      <button type='submit'>Отправить</button>
    </FormStyles>
  );
}
