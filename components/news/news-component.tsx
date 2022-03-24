import { useContext, useState } from 'react';
import styled from 'styled-components';
interface INews {
	name: string;
	description: string;
	picture: string;
}
const MainContainter = styled.div`
    min-height: 300px
    min-width: 300px
`;
const Image = styled.img`
	min-height: 94px;
	min-width: 135px;
	background-color: grey;
`;
const NewsComponent = ({ name, description, picture }: INews) => {
	return (
		<MainContainter>
			<Image src={picture} />
			<p>{name}</p>
			<p>{description}</p>
		</MainContainter>
	);
};

export default NewsComponent;
