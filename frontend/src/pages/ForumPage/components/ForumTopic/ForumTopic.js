import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Popup from 'reactjs-popup';
import {Table, Button} from './ForumTopic.css'
const ForumTopic = () => {

  const [comments, setComments] = useState([])


  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id')

  const { register, handleSubmit} = useForm();

    const getComments = async() => {
    const url = `http://localhost:5432/forum/get_comments?id_topic=${id}`;
    const response = await fetch(url,{
        method: 'GET',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
    });

    if (response.status===200) {
        setComments(await response.json())
    }

    }

    const addComment = async(data) => {

      data["token"] = localStorage.getItem('token')
      const url = `http://localhost:5432/forum/add_comment?id_topic=${id}`;
      const response = await fetch(url,{
          method: 'POST',
          credentials: 'omit',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      });

      if (response.status === 200){
          await getComments();
      }

  }

    const AddCommentPopUp = () => {
    return <Popup trigger={<Button> Dodaj komentarz</Button>} >
        <form onSubmit={handleSubmit(addComment)}>
        <textarea rows="4" cols="50" ref={register} name="description" placeholder="Treść"/><br/>
        <Button type="submit">Komentuj</Button> 
        </form>

    </Popup>
    }

    const renderComments = () =>{
      return <Table>
      <thead>
          <tr>
              <th>Tresc </th> 
              <th>Data dodania </th>
              <th>Użytkownik </th>
          </tr>
      </thead>
      <tbody>  
      {comments.map((comment) => {
        const {id_wpis, pseudonim, tresc, data_dodania} = comment;
        const date = new Date(data_dodania);
        return <tr key={id_wpis}>
          <td><textarea readOnly rows = "5" cols = "60" name = "description" value={tresc}></textarea></td>
          <td>{(date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear())}</td>
          <td>{pseudonim}</td>
        </tr>
        
      })}
      </tbody>
  </Table> 
    }

    useEffect(() => {

      getComments();

    }, [])

    return (
        <>
            
            {renderComments()}
            {localStorage.getItem('isLogged')==='true'? AddCommentPopUp() : null}
        </>



      );
}
export default ForumTopic;