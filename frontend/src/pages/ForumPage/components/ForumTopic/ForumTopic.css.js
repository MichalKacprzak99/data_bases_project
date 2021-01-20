import styled from 'styled-components';


export const Table = styled.table`

text-align: center;
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  border: 3px solid #ddd;
  width: 100%;
  td, th {
  border: 1px solid #ddd;
  padding: 8px;
}
tr:nth-child(even){background-color: #f2f2f2;}

tr:hover {background-color: #ddd;}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #4CAF50;
  color: white;
}
textarea {
  width: 100%;
  height :100%
}

`;




export const Button = styled.button`
    text-decoration: none;
    border-radius:100px;
    width: 152px;
    height: 40px;
    text-align: center;
    display: block;
    margin: 10px auto;
    background: #740103;
    color: #fff;
    text-transform: uppercase;
    font-size: 16px;
    border: #740103;
    &:disabled{
        pointer-events: none;
        background-color: #fff;
    }
    &:hover{
        transform: scale(1.1) perspective(1px)
    }

`;

