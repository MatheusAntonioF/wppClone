import React, { useState, useEffect } from 'react';

import api from '../../services/api';

export default function Contact({
	contact,
	socket,
	setActiveConversation,
	activeConversation
}) {

	const [lastMessage, setLastMessage] = useState("");

	function handleActiveConversation() {
		setActiveConversation(contact);

	}

	useEffect(() => {

		socket.on('message', message => {

			const parsedMessage = JSON.parse(message);

			if (parsedMessage.receiver === contact._id) {
				setLastMessage(parsedMessage);
			}
			if (parsedMessage.sender === contact._id) {
				setLastMessage(parsedMessage);
			}

		});



	}, [socket, contact]);

	useEffect(() => {
		async function fetchedConversation() {
			const user = JSON.parse(localStorage.getItem("user"));

			const { data } = await api.get(
				`/users/${contact._id}/conversation`,
				{ headers: { logged_user: user._id } }
			);

			setLastMessage(data[1]);
		}

		fetchedConversation();

	}, [contact._id]);

	return (
		<div
			onClick={handleActiveConversation}
			className={`contact ${activeConversation === contact ? "active" : ""}`}
		>
			<div className="user-informations">
				<div className="avatar">{contact.name[0].toUpperCase()}</div>
				<div className="name-message">
					<span className="name">{contact.name}</span>
					<p className="last-message">
						{lastMessage ? lastMessage.message : "Nenhuma mensagem enviada"}
					</p>
				</div>
			</div>
			<span className="last-seen">8:00</span>
		</div>
	);
}
