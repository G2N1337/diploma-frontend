import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';

import axios from 'axios';
import { useMutation } from 'react-query';
const Form = styled.div`
	min-height: 150px;
	width: 200px;
	display: flex;
	flex-direction: column;
`;
const Page = styled.div`
	height: 100%;
	display: flex;
`;
const PhotoBackground = styled.div`
	width: 100%;
	height: 220px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #e6e1e1;
`;
const Button = styled.button`
	border-radius: 4px;
	width: 245px;
	font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
		Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
	font-weight: 600;
	height: 63px;
	background: #c4c4c4;
	border: none;
	&:hover {
		cursor: pointer;
	}
`;
const Home: NextPage = () => {
	//@ts-ignore

	return (
		<Page>
			<PhotoBackground>
				<Button>Консультация</Button>
			</PhotoBackground>
		</Page>
	);
};

export default Home;
