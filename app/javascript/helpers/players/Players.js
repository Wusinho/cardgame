export default class Players {
	constructor(scene) {
		this.scene = scene;
		this.players = []
		this.currentPlayer = null
		// this.addPlayer = this.addPlayer.bind(this);
		// this.onlyOpponentPlayer = this.onlyOpponentPlayer.bind(this);
		this.scene.events.on("drawCardReceived", this.handleDrawCardReceived, this);
		this.scene.events.on("gameActionsReceived", this.handleGameActionsReceived, this);
	}

	addPlayer(player) {
		this.players.push(player)
	}

	addCurrenPlayer(player){
		this.currentPlayer = player
	}

	onlyOpponentPlayer(players){
		return players.filter(opponent => opponent.id != this.currentPlayer.playerId);
	}

	handleGameActionsReceived = data => {
		console.log('ACTION')
		if (data.player_id !== this.playerId) return

		if (data.action) {
			// console.log(data)
		} else {
			this.players.forEach(player => {

				player.moveOpponentCardToZone(data.card_id, data.new_zone)
			})
		}
	}

	handleDrawCardReceived = data => {
		const playerId = data.id;
		if (playerId == this.currentPlayer.playerId) {
			this.currentPlayer.createCard(data.card)
		} else {
			const player = this.players.find(player => player.playerId === playerId);
			if (player) {
				player.createOpponentCard(data.card);
			} else {
				console.error(`Player with ID ${playerId} not found`);
			}
		}
	};
}