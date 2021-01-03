
import React, {useEffect, useState} from 'react';
import {ForumTopic} from './components'
import { Switch, Route, Link, BrowserRouter as Router} from 'react-router-dom';
const ForumPage = ({ match }) => {

    const [forumTopics, setForumTopics] = useState([])

    const getForumTopics = async() =>{
      const url = 'http://localhost:5432/forum/get_topics';
      const response = await fetch(url,{
        method: 'GET',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
      });

      if (response.status===200) {
        const res = await response.json()
        console.log(res)
        setForumTopics(res)
      }

    }

    useEffect(() => {
      if(forumTopics.lenght !== 0){
        getForumTopics();
      }
    }, [forumTopics.lenght])

    const RenderTopics = () => {
      console.log("forum")
       return <><div>Forum</div>{forumTopics.map((topic) => {
        return <div key={topic.id_temat}>{topic.temat}, {topic.data_dodania} <Link to={`${match.url}/topic?id=${topic.id_temat}`}>Show comments</Link></div>
      })}</>
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