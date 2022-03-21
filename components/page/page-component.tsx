import styled from 'styled-components';
import HeaderComponent from '../header/header-component';
import FooterComponent from '../footer/footer-component';
const PageStyles = styled.div``;
const Pager = styled.div`
	display: grid;
	grid-template-rows: 121px 1fr 63px;
	grid-template-columns: 1fr;
	min-height: 100vh;
	/* min-height: calc(100vh - 110px);
	height: 100%;
	width: 100%; */
`;
const Page: React.FC = ({ children }) => {
	return (
		<Pager>
			<HeaderComponent />
			<PageStyles>{children}</PageStyles>
			<FooterComponent />
		</Pager>
	);
};
export default Page;
