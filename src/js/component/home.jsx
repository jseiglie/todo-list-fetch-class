import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [todos, setTodos] = useState(); // state that will store the todos
	const [task, setTask] = useState(""); // state that will hold the new task
	const [edit, setEdit] = useState(false); //state to active the edit functionality
	const [editing, setEditing] = useState(false); // state that will hold the id of the todo to edit
	const [username, setUsername] = useState(); // the username which we will be fetching data from
	/*
	METHODS
	C - create - POST
	R - read - GET
	U - update - PUT
	D - delete - DELETE
	*/


	/*
	
	fetch structure
	//options object is only needed, if the method is not GET
	fetch("url", { // --> url is the url that we are going to fetch the date from 
					// -->we need to specify the POST method
					method: "POST", // --> CAN BE --> GET POST PUT DELETE (there are more, but these 4 are enough to get everything done for now)
					headers: { // -->information on how to interact with the API
						"Content-Type": "application/json" // --> this will always be the same, we use application/json
					},
					// --> on the body, we sent a object that will have the info that we want to add/modify
					body: JSON.stringify({ // --> we need to transform from objecto to text, that's why we do the JSON.stringify and pass the object we want to send in text format
						label: task, // --> working with object, means we use "key: value" pairs
						is_done: false
					})
				.then(resp=>resp.json) // --> we work with the resp object to check if there was an error, if no error, we parse into json format the text response from the server
				.then(data=> console.log(data)) // --> we receive the resp parsed json as data and we can store it and work with it already 
				.catch(error=> console.log(error)) // --> if there was an error, we'll catch it here and prevent our app from crashing
	*/



	//json --> javascript notation object

	const handleUser = () => {
		//if user doesn't have an account, we will create it, if it has, we will return the user list
		createUser()
		loadData()
	}

	const createUser = () => {
		//we receive the username from the username state
		const opt = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		fetch("https://playground.4geeks.com/todo/users/" + username, opt)
			.then(resp => resp.json())
			.then(data => console.log(data))
			.catch(error => console.log(error))
	}



	const loadData = () => {
		//checking for the username before executing the fetch
		if (username) {
			fetch(`https://playground.4geeks.com/todo/users/${username}`)
				.then(resp => {
					//we check if our request is OK
					if (!resp.ok) {
						console.error("error on the resp")
					}
					//we return our response parsed JSON (we turn our text response into a javascript object)
					return resp.json()
				})
				.then(data => {
					//after success, we store our data on our state
					setTodos(data.todos)
				})
				.catch(error => {
					//we catch any error for our app not to break if there's an actual error
					console.log(error)
				})
		}
	}

	useEffect(() => {
		//we call the data one time when our app loads
		loadData()
	}, [])//empty dependency array means run once on component load


	//CREATE -->POST

	const handleSubmit = (e) => {
		e.preventDefault()
		//edit cannot be active and the task cannot be empty
		if (!editing && task.trim().length != 0) {
			fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
				//we need to specify the POST method
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				//on the body, we sent a object that will have the todo we want to add
				body: JSON.stringify({
					label: task,
					is_done: false
				})
			})
				.then(resp => {
					//we check if our request is OK
					if (!resp.ok) {
						console.error("error on the resp")
					}
					//clean the task state
					setTask("");
					//after success, we load the data again from the server
					return loadData();
				})
				.catch(error => {
					//we catch any error for our app not to break if there's an actual error
					console.log(error)
				})
		}
		else {
			!editing && alert("task cannot be empty")
		}
	}


	const handleDelete = id => {
		//we pass the id of the element we want to delete 
		fetch("https://playground.4geeks.com/todo/todos/" + id, {
			//to delete, we need to specify the DELETE method on the options object
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
		})
			.then(resp => {
				//we check if our request is OK
				if (!resp.ok) {
					console.error("error on the resp")
				}
				//after success, we load the data again from the server
				return loadData();
			})
			.catch(error => {
				//we catch any error for our app not to break if there's an actual error
				console.log(error)
			})
	}

	const handleEdit = el => {
		//we receive the element and not just the id because we want to have that info, in the case the new task is empty, 
		//we will send the label property of the element
		//------------------------------
		//checking if the edit state is true
		
			fetch("https://playground.4geeks.com/todo/todos/" + el.id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					//if the edited task is empty, we send the old task instead
					label: task.trim().length == 0 ? el.label : task,
					is_done: el.is_done
				})
			})
				.then(resp => {
					//we check if our request is OK
					if (!resp.ok) {
						console.error("error on the resp")
					}
					//we return our edit to a false state
					setEditing(false)
					//clean the task state
					setTask('');
					//clean the task state
					//after success, we load the data again from the server
					return loadData();
				})
				.catch(error => {
					//we catch any error for our app not to break if there's an actual error
					setEditing(false)
					console.log(error)
				})
		
	}
	//function to capitalize the username
	const capitalizeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

	const handleDone = (task, i) => {
		const aux = todos
		task.is_done = true
		// aux[i].is_done = true
		// setTodos(aux)
		setEditing(true)
		handleEdit(task)

	}

	const handleNotDone = (task, i) => {
		const aux = todos
		task.is_done = false
		// aux[i].is_done = false
		// setTodos(aux)
		setEditing(true)
		handleEdit(task)

	}


	return (
		<div className="text-center d-flex flex-column align-items-center">
			<h1 className="my-5">Todo List con Fetch!</h1>
			{!todos && <div className="d-flex flex-column  my-3 p-3 text-center justify-content-center w-50">
				<p className="form-text">Type your username, if you don't have an account we'll create one.</p>
				<div className="d-flex flex-column p-2">
					<input type="text" onChange={e => setUsername(e.target.value)} className="form-control" />
					<button className="btn btn-success mt-3" onClick={handleUser}>START!</button>
				</div>
			</div>}

			{todos && <form onSubmit={handleSubmit} className="form w-50 mx-auto">
				{/* we need the username, then we pass the username as props to the function to always receive a capitalize name */}
				<h1>{username && capitalizeFirstLetter(username)} To-Do's</h1>
				<input className="form-control" onChange={e => setTask(e.target.value)} placeholder="Add something" />
				<input className="form-control" type="submit" value={"submit"} hidden />
				<ul className="list-group">
					{/* todos && todos.map means that if there's information on todos, then do the map. remember we need to wait for the data to be fetched */}
					{todos && todos.map((el, i) => {
						return (
							<div key={el.id}>
								{/* we check if editing value is the same as the id from the element*/}
								{editing == el.id ?
									< div key={el.id} className="input-group d-flex justify-content-space-between"
									/* the input-group insert html elements inside the input */
									// if the id is the one in the editing state, we return an input to be able to modify the task
									>
										<input className="form-control list-group-item" id={el.id} placeholder={el.label} value={task} onChange={e => setTask(e.target.value)} />
										{/* you need the class input-group-text for the element to be inserted on the input */}
										<span className="input-group-text">
											{/* this icon onClick will call the handleEdit function and will receive the el */}
											<i className="fa-solid fa-check" onClick={() => handleEdit(el)}></i>
										</span>
									</div>
									:
									<div>

										{/* // if is not the id from the el === to the one on the state, we return a normal li */}
										<li className={`list-group-item  d-flex justify-content-between ${el.is_done ? 'text-decoration-line-through border-danger' : ''}`}>{el.label}
											<span className="mx-3">
												{el.is_done ?
													<i className="fa-solid fa-square-check" onClick={() => handleNotDone(el, i)}></i>
													:

													<i className="fa-regular fa-square" onClick={() => handleDone(el, i)}></i>
												}
												{/* we set the id on the editing state to be able to edit the element */}
												<i className="fa-solid fa-pen mx-3" onClick={() => setEditing(el.id)}></i>
												{/* we send the id to the handleDelete function to be able to tell the api which element we want to delete */}
												<i className="fa-solid fa-trash" onClick={() => handleDelete(el.id)}></i>
											</span>
										</li>
									</div>
								}
							</div>)
					})}
				</ul >
			</form >}



		</div >
	);
};

export default Home;
