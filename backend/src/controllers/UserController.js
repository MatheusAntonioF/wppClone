const User = require('../models/User');

module.exports = {
	async index(req, res) {
		const users = await User.find();

		return res.json(users);
	},

	async store(req, res) {
		const { name } = req.body;

		const userExists = await User.findOne({ name });

		if (userExists) {
			return res.json(userExists);
		}

		const user = await User.create({ name });

		res.json(user);
	},

	async show(req, res) {
		const { id } = req.params;

		const user = await User.findById(id);
		user.last_seen = Date.now();

		return res.json(user);
	},

	async update(req, res) {
		const { id } = req.params;

		const user = await User.findByIdAndUpdate(id, req.body,
			{
				new: true
			});
	},

	async delete(req, res) {
		const { id } = req.params;

		await User.findByIdAndDelete(id);

		return res.json({ msg: 'Usuário deletado' });
	}
}
