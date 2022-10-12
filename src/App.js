import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Data from './data.json'
import { v1 as uuidv1} from 'uuid';
import axios from 'axios';


function App() {

  // Reference
  const titleRef = useRef();
  const contentRef = useRef();

  // State
  const [data, setData] = useState(Data);

  // Temp State
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const [updateID, setUpdateID] = useState();
  const [updateTitle, setUpdateTitle] = useState();
  const [updateContent, setUpdateContent] = useState();

  // Effect
  useEffect(() => {
  }, [data]);

  // Add Task
  const addTask = () => {
    if(title && content) {
      // create new task object
      let newTask = {
        id: uuidv1(), 
        "title": title, 
        "content": content
      }
      // merge new tasks with copy of old state
      let tasks = [...data, newTask];
      // push new object to state
      setData(tasks);
      // clear title and content from state
      setTitle();
      setContent();

      saveJSON(tasks);
    }
  }

  // Delete Task
  const deleteTask = (key) => {
    // filter out task containing that id(key)
    let filteredTasks = [...data].filter(task=> task.id !== key);
    // save the rest in state
    setData(filteredTasks);

    // write to json file
    saveJSON(filteredTasks);
  }

  // Update Task
  const updateTask = () => {
    // populate task info from temp state and prepare new obj for updated task
    let editedTask = {
      "id": updateID,
      'title': updateTitle,
      'content': updateContent
    }
    // remove old task with same ID and get remaining data
    let filteredTasks = [...data].filter(task=> task.id !== updateID);
    let tasks = [...filteredTasks, editedTask];
    // push into state
    setData(tasks);

    // clear fields
    setUpdateID();
    setUpdateTitle();
    setUpdateContent();

    // write to json file
    saveJSON(tasks);
  }

  // Populate Task
  const populateTask = (key, title, content) => {
    setUpdateID(key);
    setUpdateTitle(title);
    setUpdateContent(content);

  }

  // Write to JSON file

  // this function will receive all updated state/tasks after you add/delete/edit tasks
  const saveJSON = (tasks) => {
    // api URL//end point from express server
    const url = 'http://localhost:4999/write';
    
    axios.post(url, tasks)
    .then(response => {
      //console.log(response);
    })
  }

  return (
    <div className="App">

      <div className='tasks'>
        <h1>To Do List</h1>

      <div>
        <h4>Add New Task</h4>
        <input placeholder='Task Title' 
          onChange={ e => setTitle( e.target.value )}
          value= { title || ''}
          ref={ titleRef }
          />
        <br />
        <textarea placeholder='Task Content'
          onChange={ e => setContent( e.target.value )}
          value= { content || ''}
          ref={ contentRef }
        ></textarea>
        <br />
        <button onClick={ addTask }>Add</button>
      </div>

      {/* If temp state has values of title or content for update form, show this:  */}

      {updateTitle || updateContent ? (
        <div>
           <h4>Update Task</h4>
           <input placeholder='Task Title'
             onChange={ e => setUpdateTitle( e.target.value )}
             value= { updateTitle || ''}
           />
           <br />
           <textarea placeholder='Task Content'
             onChange={ e => setUpdateContent( e.target.value )}
             value= { updateContent || ''}
           ></textarea>
           <br />
           <button onClick={ updateTask }>Update</button>
        </div>
      ) : null }
  


        { data? data.map(task => {
          return(
            <div key={ task.id }>
              <h4>{ task.title }</h4>
              <p>{ task.content }</p>
              <button onClick={() => populateTask(task.id, task.title, task.content)}>Edit Task</button>
              <button onClick={() => deleteTask(task.id)}>Delete Task</button>
            </div>
          ) 
        }) : null}
      </div>
    </div>
  );
}

export default App;
