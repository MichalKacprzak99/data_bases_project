import styled from 'styled-components';

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

export const ButtonGroup =styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    /* height: 40px; */
`;
