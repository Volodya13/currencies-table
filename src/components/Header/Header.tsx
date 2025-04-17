import styled from 'styled-components';

function Header() {
  return (
    <HeaderContainer>
      <Title>Currencies</Title>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

export default Header;
