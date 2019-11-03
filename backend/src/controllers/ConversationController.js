const Conversation = require('../models/Conversation');

module.exports = {
	async index(req, res) {
		const conversations = await Conversation.find();

		return res.json(conversations);
	},

	async show(req, res) {
		const { logged_user } = req.headers;
		const { receiver: user } = req.params;

		const conversation = await Conversation.find({
			$or: [
				{
					$and: [{ sender: logged_user }, { receiver: user }]
				},
				{
					$and: [{ sender: user }, { receiver: logged_user }]
				}
			]
		});

	
		//console.log(req.connectedUsers);
		
		// Recupera a última mensagem enviada
		const lastMessage = conversation[conversation.length - 1];

		const data = [];

		data.push(conversation, lastMessage)

		return res.json(data);
	},
	async store(req, res) {
		// id of user logged
		const { logged_user } = req.headers;
		const { receiver } = req.params;
		const { message } = req.body;

		const conversation = await Conversation.create({
			sender: logged_user,
			receiver,
			message
		});

		const targetSocket = req.connectedUsers[receiver];

		if (targetSocket) {
			req.io
				.to(targetSocket)
				.to(req.connectedUsers[logged_user])
				.emit('message', JSON.stringify(conversation));

			// req.io
			// 	.to(req.connectedUsers[logged_user])
			// 	.emit('last_seen', JSON.stringify(last_seen));
		}

		return res.json(conversation);
	}
}
