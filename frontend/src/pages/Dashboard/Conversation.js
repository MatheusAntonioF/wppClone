import React, { useState, useEffect } from 'react';

import api from '../../services/api';

import moment from 'moment';

export default function Conversation({ activeConversation, socket }) {

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [lastSeen, setLastSeen] = useState("");

	useEffect(() => {

		socket.on('online', online => {
			setLastSeen(online.replace(/"/g, ""));
		});

		socket.on('message', message => {

			if (!activeConversation) return
			const parsedMessage = JSON.parse(message);

			if (parsedMessage.sender === activeConversation._id) {
				setMessages(messages => [...messages, parsedMessage]);
			}
		});



	}, [activeConversation, socket]);


	async function handleSubmit(e) {
		e.preventDefault();

		const user = JSON.parse(localStorage.getItem("user"));

		if (!newMessage) return;

		const { data } = await api.post(
			`/users/${activeConversation._id}/conversations`,
			{ message: newMessage },
			{
				headers: { logged_user: user._id }
			}
		)

		setMessages(messages => [...messages, data]);

		// Zera o value do input de mensagem
		setNewMessage("");
	}

	// Retorna a conversa do contato solicitado
	useEffect(() => {
		async function fetchedConversation() {

			const user = JSON.parse(localStorage.getItem("user"));

			const { data } = await api.get(
				`/users/${activeConversation._id}/conversation`,
				{ headers: { logged_user: user._id } }
			);
			setMessages(data[0]);
		}

		if (activeConversation) {
			fetchedConversation();
		}


	}, [activeConversation]);


	return activeConversation ?
		(<>
			<header className="conversation">
				<div className="avatar">{activeConversation.name[0].toUpperCase()}</div>
				<div className="user-informations">
					<span className="name">{activeConversation.name}</span>
					<span className="status">
						{
								lastSeen
							?
								lastSeen
							:
								"Visto por último às "+
								moment(activeConversation.last_seen).format("DD/MM/YYYY")+ " "+
								moment(activeConversation.last_seen).format("HH")+":"+
								moment(activeConversation.last_seen).format("mm")
						}
					</span>
				</div>
			</header>
			<div className="content">
				{messages.map(message => (
					<div
						key={message._id}
						className={
							`card-message ${message.sender === activeConversation._id ? "receiver" : "sender"}`
						}
					>
						<span className="message">{message.message}</span>
						<span className="time">8:00</span>
					</div>
				))}
			</div>
			<div className="footer">
				<form onSubmit={handleSubmit}>
					<input
						type="input"
						placeholder="Digite uma mensagem"
						value={newMessage}
						onChange={e => setNewMessage(e.target.value)}
					/>
					<button type="submit" className="dn" />
				</form>
			</div>
		</>) : (
			<div className="no-conversation"></div>
		)
}
