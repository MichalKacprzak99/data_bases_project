
import React, {useEffect, useState} from 'react';
import {ForumTopic} from './components'
import { Switch, Route, Link} from 'react-router-dom';
import {Table} from './ForumPage.css'
const ForumPage = ({ match }) => {

    const [forumTopics, setForumTopics] = useState([])

    const getForumTopics = async() =>{
      const url = 'https://data-base-api.herokuapp.com/forum/get_topics';
      const response = await fetch(url,{
        method: 'GET',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
      });

      if (response.status===200) {
        const res = await response.json()
        setForumTopics(res)
      }

    }

    useEffect(() => {
      if(forumTopics.lenght !== 0){
        getForumTopics();
      }
    }, [forumTopics.lenght])

    const RenderTopics = () => {
      return <Table>
      <thead>
          <tr>
              <th>Temat </th> 
              <th>Opis</th>
              <th>data dodania </th>
              <th>Komentarze </th>
          </tr>
      </thead>
      <tbody>  
      {forumTopics.map((topic) => {
        const date = new Date(topic.data_dodania);
        return <tr key={topic.id_temat}>
          <td>{topic.temat}</td>
          <td>{topic.opis}</td>
          <td>{(date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear())}</td>
          <td><Link to={`${match.url}/topic?id=${topic.id_temat}`}>Pokaż wpisy</Link></td>
        </tr>
        
      })}
      </tbody>
  </Table> 
    }

    return (
      <>
            <Switch>
            <Route exact path={match.url}>
            <RenderTopics />
            </Route>
            <Route exact path={match.url + "/topic"} component={ForumTopic}/>

            </Switch>

        </>

      );
}
export default ForumPage;