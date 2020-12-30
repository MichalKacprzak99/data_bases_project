import styled from 'styled-components';


export const Navbar = styled.div`
grid-area: UserOptions;
display: flex;
overflow: hidden;
background-color: #333;

button {
  background-color: #333;
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
  font-family: cursive;
  &:hover {
      background-color: rgb(88, 85, 85);
    }
}
`