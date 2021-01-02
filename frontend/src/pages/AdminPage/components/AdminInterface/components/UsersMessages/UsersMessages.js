import React, { useState, useEffect} from 'react';
import { Table} from './UsersMessages.css';

const UsersController = () => {
  const [usersMessages, setUsersMessages] = useState(null)

  const getUsersMessages = async() => {
    const url = 'http://localhost:5432/admin/get_messages';
    const response = await fetch(url,{
        method: 'POST',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"token": localStorage.getItem('admin-token')})
    });
    if(response.status !== 200) {
      setUsersMessages(false)
    } else {
      setUsersMessages(await response.json())
    }
  }



  useEffect(() => {
    if(!usersMessages){
      getUsersMessages()
    } 
  },[]);

  const renderTableHeader = () => {
    if(usersMessages!= null){
      let header = Object.keys(usersMessages[0])
      // header.push("Blokowanie")
      return header.map((key, index) => {
         return <th key={index}>{key.toUpperCase()} </th>
      })
    }
  }

  const renderTableData = () => {
    if(usersMessages!=null){
      return usersMessages.map((message) => {
        const {id_wiadomosc, id_uzytkownika, data_dodania, tresc } = message
        return (
          <tr key={id_wiadomosc}>
              <td>{id_wiadomosc}</td>
              <td>{id_uzytkownika}</td>
              <td>{data_dodania}</td>
              <td>{tresc}</td>
              {/* <td><button id={id_uzytkownika} onClick={(e) => handleBlocking(e,!zablokowany)}>{zablokowany ? "Odblokuj"  : "Zablokuj"}</button></td> */}
          </tr>
        )
      })
    } 
  }

    return (
      <>
        <h1 id='title'>React Dynamic Table</h1>
            <Table>
               <tbody>
                  <tr>{renderTableHeader()}</tr>
                  {renderTableData()}
               </tbody>
            </Table>
      </>

        )
}
export default UsersController;