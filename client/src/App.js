import React from 'react';
import axios from 'axios';
import './App.css';
import dotenv from 'dotenv';
import Graph from './Graph';

dotenv.config();
console.log(process.env);

const { useState } = React;

const Form = props => {
   const [username, setUsername] = useState('')
   const [repo, setRepo] = useState('')
   const [folder, setFolder] = useState('')

   var handleSubmit = async event => {
      event.preventDefault()
      var userInfo = {
         username: username,
         repo: repo,
         folder: folder
      };

      console.log("SUBMIT");

      let mainId = username + "/" + repo;
      let nodes = [
         {id: mainId, color: "blue", radius: 10, length: 1, clicked: true}
      ]
      let links = []

      let resp = await axios.post('http://localhost:3001/lookup', userInfo)
      if (resp) {
         console.log("Response Data:", resp.data);
         resp.data.dependencies.forEach((value, index, array) => {
            nodes.push({
               id: value.name, 
               color: "orange", 
               radius: 8, 
               version: value.version,
               length: 2,
               source: "api.github.com/repos/" + username + "/" + repo
            });
            links.push({
               source: mainId, 
               target: value.name, 
               value: value.name.length
            });
         });
         console.log("Nodes Generated", nodes, links);
         props.setNodesLinks(nodes, links);
         setUsername('');
         setRepo('');
      }
      else {
         console.error("Failed lookup");
      }

   }

   return (
      <div style={{display: "block", margin: "2em"}}>
      <form onSubmit={handleSubmit} style={{display: "inline-block" }}>
         <input
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
            placeholder="GitHub username"
            required
         />
         <input
            type="text"
            value={repo}
            onChange={event => setRepo(event.target.value)}
            placeholder="GitHub repo"
            required
         />
         <button type="submit">Display</button>
         <input
            type="text"
            value={folder}
            onChange={event => setFolder(event.target.value)}
            placeholder="optional specified folder"
         />
      </form>
      </div>
   )
}

const App = () => {
   const [cards, setCards] = useState([])
   // defaults set to be examples of the format
   const [nodes, setNodes] = useState([
      {id: "lion", group: 1, radius: 5},
      {id: "roar", group: 1, radius: 9},
      {id: "absurdlylongname", group: 2, radius: 5},
      {id: "4", group: 2, radius: 9},
      {id: "5", group: 3, radius: 5},
      {id: "test20", group: 3, radius: 9},
   ]);
   const [links, setLinks] = useState([
      {source: "lion", target: "roar", value: 1},
      {source: "roar", target: "absurdlylongname", value: 1},
      {source: "absurdlylongname", target: "4", value: 1},
      {source: "4", target: "5", value: 1},
      {source: "lion", target: "test20", value: 1},
   ]);
   const [nodesChanged, setNodesChanged] = useState(false);

   let setNodesLinks = (newNodes, newLinks) => {
      setNodes(newNodes);
      setLinks(newLinks);
      setNodesChanged(true);
      console.log("Nodes set", nodes, links);
   }

   var addNewCard = cardInfo => {
      setCards(cards.concat(cardInfo))
   }

   var search = async querry => {
      console.log("App Click ", querry);

      let resp = await axios.post('http://localhost:3001/search', {querry: querry})
      if (resp) {
         console.log("Response Search:", resp.data);
         return resp.data;
      }
      else {
         console.error("Failed search");
         return resp;
      }
   }

   return (
      <div>
         <Form onSubmit={addNewCard} 
            setNodesLinks={setNodesLinks}
         />
         <Graph 
            nodes={nodes} 
            links={links}
            nodesChanged={nodesChanged}
            setNodesChanged={setNodesChanged}
            search={search}
         />
      </div>
   )
}

export default App;
