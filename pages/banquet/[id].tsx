import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

interface IBanquet {
  name: string;
  description: string;
  banquet: any;
}

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Headline = styled.div`
  height: 250px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #e6e1e1;
  background-image: url('https://www.sgu.ru/sites/default/files/depnews/image/2015/02/-.png');
  background-repeat: no-repeat;
  background-size: cover; /* Resize the background image to cover the entire container */
  background-position: center; /* Center the image */

  h1 {
    background: #c1c1c1;
    border-radius: 4px;
    padding: 10px;
    backdrop-filter: blur(10px);
  }
`;
const Container = styled.div`
  background-color: #c4c4c4;
  height: 100%;
  width: 100%;
`;
const InfoBox = styled.div`
  background-color: #e6e1e1;
  display: flex;
  width: 97%;
  padding: 2em;
  flex-direction: row;
  gap: 3em;
`;
const InfoContainer = styled.div`
  margin: 40px 0 0 48px;
  display: flex;
  flex-direction: row;
  gap: 10em;
`;
const MegaContainer = styled.div`
  margin: 40px 0 0 48px;
  display: flex;
  flex-direction: column;
  height: 200px;
`;
const Paragraph = styled.p`
  border-bottom: 1px dotted #c1c1c1;
`;

const Menu: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [banquet, setBanquet] = useState<IBanquet>();

  useQuery(
    'banquet',
    async () => {
      return await axios.get(`http://localhost:5000/banquet/type/${id}`);
    },
    {
      onSuccess: (e) => {
        console.log(e.data);
        setBanquet(e.data);
      },
    }
  );

  return (
    <Page>
      <Headline>{banquet?.name && <h1>{banquet?.name}</h1>}</Headline>
      <Container>
        <MegaContainer>
          <Paragraph>{banquet?.name}</Paragraph>
          <Paragraph>{banquet?.description}</Paragraph>
        </MegaContainer>
        <InfoContainer>
          <InfoBox>
            {!!banquet &&
              banquet?.banquet.map((item: any) => (
                <div key={item._id}>
                  <Paragraph>Анимационная программа: </Paragraph>
                  <Paragraph>{item?.name}</Paragraph>
                  <Paragraph>{item?.description}</Paragraph>
                </div>
              ))}
          </InfoBox>
        </InfoContainer>
      </Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      key: context.params?.id,
    },
  };
};

export default Menu;
