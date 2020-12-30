import styled from 'styled-components';

export const Layout = styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1.5fr;
    grid-template-rows: 0.5fr 1.5fr;
    gap: 0px 0px;
    grid-template-areas:
      "UserNickname CreepyHello"
      "UserOptions OptionArea";
`

export const UserNickname = styled.div`
grid-area: UserNickname;
`
export const  CreepyHello = styled.div`
grid-area: CreepyHello;

`
export const OptionArea = styled.div`
grid-area: OptionArea;

`
export const Navbar = styled.div`
grid-area: UserOptions;
display: flex;
overflow: hidden;
background-color: #333;
flex-direction: column;
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
  &:hover {
      background-color: rgb(88, 85, 85);
    }
}
`