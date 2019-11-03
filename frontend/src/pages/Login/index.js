import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import api from '../../services/api';

export default function Login({ history }) {
	const [name, setName] = useState("");

	async function handleSubmit(e) {
		try {
			e.preventDefault();

			if (!name) {
				alert("Insira um nome");
				return;
			}

			const { data } = await api.post("/users", { name });

			localStorage.setItem("user", JSON.stringify(data));

			// O parámetro history só pode ser usado se o componente for renderizado por uma rota
			history.push('/dashboard');

		} catch (err) {
			alert("Unexpeted error from login user! Error: "+err);
		}
	}

	return localStorage.getItem('user') ?
		(<Redirect to="/dashboard" />)
		: <>
			<div className="login">
				<div className="login-card">
					<form onSubmit={handleSubmit}>
						<label htmlFor="name">Nome</label>
						<input
							id="name"
							type="text"
							placeholder="Digite seu nome..."
							onChange={e => setName(e.target.value)}
						/>

						<button type="submit">Enviar</button>
					</form>
				</div>
			</div>
		</>
}
