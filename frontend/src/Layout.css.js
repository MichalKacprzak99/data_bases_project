import styled from 'styled-components';


export const Navbar = styled.nav`
display: flex;
overflow: hidden;
background-color: #333;
a {
  letter-spacing: 2px;
  flex: 1;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: block;
  color: #f2f2f2;
  padding: 14px 16px;
  text-decoration: none;
  &:hover {
      background-color: rgb(88, 85, 85);
    }
}

`;



export const Header = styled.div`
  letter-spacing: 3px;
  background-color: #e04237d3;
  text-align:center;
  font-size: 50px;
  padding: 10px;
  color: rgb(0, 0, 0);
`;


export const Footer = styled.footer`

  text-align: center;
  width: 100%;
  background-color: #333;
  color: white;
  text-align: center;

`;

export const Center = styled.div`

  display: flex;
  flex-direction: column;



`;