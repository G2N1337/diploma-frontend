import styled from 'styled-components';

const Footer = styled.div`
	height: 63px;
	width: 100%;
	background-color: #c4c4c4;
	display: flex;
	justify-content: space-between;
	font-weight: 800;
	box-shadow: 0px 4px 28px -1px rgba(37, 64, 84, 0.31);
`;

const FooterComponent = () => {
	return <Footer>Футер</Footer>;
};

export default FooterComponent;
