import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Popup from 'reactjs-popup';

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
          getComments();
      }

  }

    const AddCommentPopUp = () => {
    return <Popup trigger={<button> Add Comment</button>} >
        <form onSubmit={handleSubmit(addComment)}>
        <textarea rows="4" cols="50" ref={register} name="description" placeholder="Please describe why"/><br/>
        <button type="submit">I like it</button> 
        </form>

    </Popup>
    }

    const renderComments = () =>{
    return comments.map((comment) => {
        const {id_wpis, pseudonim, tresc} = comment;
        return <div key={id_wpis}>{tresc}, {pseudonim}</div>
    })
    }

    useEffect(() => {
      if(comments.lenght !== 0){
        getComments();
      }
    }, [])

    return (
        <>
            
            {renderComments()}
            {localStorage.getItem('isLogged')==='true'? AddCommentPopUp() : null}
        </>



      );
}
export default ForumTopic;