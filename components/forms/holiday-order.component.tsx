import * as React from 'react';
import { useState, useContext } from 'react';
import { useQuery } from 'react-query';

import axios from 'axios';
import styled from 'styled-components';
import { UserContext } from '../../context';

interface IProps {}

const FormStyles = styled.form``;

const InputRow = styled.div``;

export default function HolidayOrder({}: IProps) {
  let today = new Date().toLocaleDateString();

  //@ts-ignore
  const { user } = useContext(UserContext);

  const [data, setData] = useState<{
    name: string;
    holiday: string;
    entertainment: string;
    menu: string;
    date: string;
    commentary: string;
  }>({
    name: '',
    holiday: '',
    entertainment: '',
    menu: '',
    date: today,
    commentary: '',
  });

  React.useEffect(() => {
    setData({ ...data, name: user?.fullName });
  }, [user]);

  //GetHolidays
  const [holidays, setHolidays] = useState([]);
  useQuery(
    'get-holidays',
    async () => {
      return await axios.get(`http://localhost:5000/banquet`);
    },
    {
      onSuccess: (e) => {
        setHolidays(e.data.reverse());
      },
    }
  );

  //GetEntertainments
  const [entertainments, setEntertainments] = useState([]);
  useQuery(
    'get-entertainments',
    async () => {
      return await axios.get(`http://localhost:5000/entertainment`);
    },
    {
      onSuccess: (e) => {
        setEntertainments(e.data.reverse());
      },
    }
  );

  //GetMenus
  const [menus, setMenus] = useState([]);
  useQuery(
    'get-menus',
    async () => {
      return await axios.get(`http://localhost:5000/menu/type`);
    },
    {
      onSuccess: (e) => {
        console.log({ e });
        setMenus(e.data.reverse());
      },
    }
  );

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log({ formDataSubmited: data });
  };

  return (
    <FormStyles onSubmit={submitHandler}>
      {/* Имя */}
      <InputRow>
        <label>
          Имя:
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
            value={data.holiday}
            onChange={(e: any) => setData({ ...data, holiday: e.target.value })}
          >
            <option defaultChecked disabled>
              Выберите праздник
            </option>
            {holidays &&
              holidays.map((holiday: { name: string; _id: string }) => (
                <option key={holiday._id} value={holiday.name}>
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
            onChange={(e: any) =>
              setData({ ...data, entertainment: e.target.value })
            }
          >
            <option defaultChecked disabled>
              Выберите развлечение
            </option>
            {entertainments &&
              entertainments.map(
                (entertainment: { name: string; _id: string }) => (
                  <option key={entertainment._id} value={entertainment.name}>
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
            onChange={(e: any) => setData({ ...data, menu: e.target.value })}
          >
            <option defaultChecked disabled>
              Выберите меню
            </option>
            {menus &&
              menus.map((menu: { name: string; _id: string }) => (
                <option key={menu._id} value={menu.name}>
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
            onChange={(e: any) => setData({ ...data, menu: e.target.value })}
          >
            <option defaultChecked disabled>
              Выберите меню
            </option>
            {menus &&
              menus.map((menu: { name: string; _id: string }) => (
                <option key={menu._id} value={menu.name}>
                  {menu.name}
                </option>
              ))}
          </select>
        </label>
      </InputRow>
      <InputRow>
        <label>
          Дата празника:
          <input
            type='date'
            name='holiday-start'
            value={data.date}
            onChange={(e: any) => setData({ ...data, date: e.target.value })}
            min='2022-01-01'
            max='2022-12-31'
          />
        </label>
      </InputRow>

      {/* Сообщение */}
      <InputRow>
        <label>
          Комментарий:
          <input
            type='text'
            placeholder='Сообщение'
            value={data.commentary}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({ ...data, commentary: e.target.value })
            }
            name='commentary'
            autoComplete='off'
          />
        </label>
      </InputRow>
      <button type='submit'>Отправить</button>
    </FormStyles>
  );
}
