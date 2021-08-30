import React, {useState, useEffect} from 'react'
import axios from 'axios'

const DrfApiFetch = () => {
    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState([])
    const [editedTask, setEditedTask] = useState({id:"", title:""})
    const [id, setId] = useState(1)

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/tasks/',{
            headers: {
                Authorization: 'Token 51d95937b538a7662c992692481cd57806cc8a0c'
            }
        })
        .then(res => {setTasks(res.data)})
    }, [])

    const getTask = () => {
        axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`,{
            headers: {
                Authorization: 'Token 51d95937b538a7662c992692481cd57806cc8a0c'
            }
        })
        .then(res => {setSelectedTask(res.data)})
    }

    const newTask = (task) => {
        const data = {
            title: task.title
        }
        axios.post(`http://127.0.0.1:8000/api/tasks/`,data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 51d95937b538a7662c992692481cd57806cc8a0c'
            }
        })
        .then(res => {
            setTasks([...tasks, res.data]);
            setEditedTask({id: "", title: ""});
        })
    }

    const deleteTask = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`,{
            headers: {
                Authorization: 'Token 51d95937b538a7662c992692481cd57806cc8a0c'
            }
        })
        .then(res => {
            setTasks(tasks.filter(task=>task.id !== id))
            setSelectedTask([])
            setEditedTask({id: "", title: ""});
        })
    }

    const editTask = (task) => {
        axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`,task, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 51d95937b538a7662c992692481cd57806cc8a0c'
            }
        })
        .then(
            res => {
                setTasks(tasks.map((task) => (task.id === editedTask.id ? res.data : task)));
                setEditedTask({id: "", title: ""});
            })
    }

    const handleInputChange = () => evt =>{
        const value = evt.target.value
        const name = evt.target.name
        setEditedTask({...editedTask, [name]:value})
    }

    return (
        <div>
            <ul>
                {
                    tasks.map(task => 
                        <li key={task.id}>{task.id} {task.title}
                            <button type="button" onClick={()=>deleteTask(task.id)}>
                                <i className="fas fa-trash"></i>
                            </button>
                            <button type="button" onClick={() => setEditedTask(task)}>
                                <i className="fas fa-pen"></i>
                            </button>
                        </li>
                    )
                }
            </ul>

            Set id <br/>
            <input type="text" value={id} onChange={evt=>(setId(evt.target.value))} />
            <br/>
            <button type="button" onClick={()=>getTask()}>Get Task</button>
            <h3>{selectedTask.id} {selectedTask.title}</h3>

            <input type="text" name="title" 
            value={editedTask.title}
            onChange={handleInputChange()}
            required
            placeholder="new Task?"/>
            {editedTask.id ? 
            <button onClick={()=>editTask(editedTask)}>Update</button>:
            <button onClick={()=>newTask(editedTask)}>Create</button>}
        </div>
    )
}

export default DrfApiFetch
