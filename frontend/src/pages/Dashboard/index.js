import React, { useState, useEffect } from "react";

import { Redirect } from 'react-router-dom';

import io from 'socket.io-client';

import api from '../../services/api';

import Contact from "./Contact";
import Conversation from "./Conversation";

export default function Dashboard() {
	const [users, setUers] = useState([]);
	const [activeConversation, setActiveConversation] = useState(null);


	const loggedUser = JSON.parse(localStorage.getItem("user"));

	const socket = io('http://localhost:8008', {
		query: { user: loggedUser._id }
	});

	useEffect(() => {
		/* 
			Essa função retorna todos os usuários cadastrados
			para alimentar a aba de contatos do dashboard
		*/
		async function fetchedUsers() {
			const { data: fetchedUsers } = await api.get('/users');

			setUers(fetchedUsers);
		}

		fetchedUsers();

	}, []);

	return localStorage.getItem('user') ?
		<>
			<div className="dashboard">
				<div className="dashboard-card">
					<header className="contacts-list">
						<div className="avatar">{loggedUser.name[0].toUpperCase()}</div>
					</header>
					<div className="contacts-list">

						{/* 
							É necessário o método filter para retirar o usuário 
							da sua própria aba de contatos
						*/}
						{users.filter(user => user._id !== loggedUser._id)
							.map(user => (
								<Contact
									key={user._id}
									contact={user}
									socket={socket}
									activeConversation={activeConversation}
									setActiveConversation={setActiveConversation}
								/>
							))}
					</div>
					<div className="conversation">
						<Conversation
							socket={socket}
							activeConversation={activeConversation}
						/>
					</div>
				</div>
			</div>

		</> : (<Redirect to="/" />)
}
