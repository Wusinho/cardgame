import Player from './Player';
export default class LeftPlayer extends Player {
	constructor(scene, player) {
		super(scene, player);
		this.createUserName()
		this.hand_size = {
			width: 150,
			height: 200,
		}
		this.other_zones = {
			width: 100,
			height: 60,
		}
		this.addHandCardsToGame(player.cards.hand)
		this.addManaPoolCardsToGame(player.cards.mana_pool)
		this.addExileCardsToGame(player.cards.exile)
		this.addGraveyardCardsToGame(player.cards.graveyard)
		this.addPlayZoneCardsToGame(player.cards.play_zone)
	}

	createUserName(){
		let centerX = this.scene.leftPlayerUserInfo.x
		let centerY = this.scene.leftPlayerUserInfo.y

		this.scene.currentUserName = this.create_text(centerX,centerY, this.playerUsername)
			.setFontSize(14)
			.setFontFamily("Arial")
			.setInteractive();
		this.scene.angle = 90;
	}

	addHandCardsToGame(data){
		const handSize = data.length
		this.handInformation(handSize);
	}

	handInformation(handSize){
		let centerX = this.scene.leftPlayerHandArea.x
		let centerY = this.scene.leftPlayerHandArea.y

		this.scene.rightUserHandSize = this.create_text(centerX,centerY, `${handSize}`)
			.setFontSize(14)
			.setFontFamily("Arial")
			.setInteractive();
		this.scene.angle = 90;
	}

	addManaPoolCardsToGame(data){
		for (let i in data) {
			this.createOpponentCard(data[i])
		}
	}

	addExileCardsToGame(data){
		for (let i in data) {
			this.createOpponentCard(data[i])
		}
	}

	addGraveyardCardsToGame(data){
		for (let i in data) {
			this.createOpponentCard(data[i])
		}
	}

	addPlayZoneCardsToGame(data){
		for (let i in data) {
			this.createOpponentCard(data[i])
		}
	}

	getAreaPosition(zone) {
		let area;
		switch (zone) {
			case 'hand':
				area = this.scene.leftPlayerHandArea;
				break;
			case 'mana_pool':
				area = this.scene.leftPlayerManaPoolArea;
				break;
			case 'play_zone':
				area = this.scene.leftPlayerPlayZoneArea;
				break;
			case 'exile':
				area = this.scene.leftPlayerGraveyardArea;
				break;
			case 'graveyard':
				area = this.scene.leftPlayerGraveyardArea;
				break;
			default:
				console.error(`Unknown zone: ${zone}`);
				return { x: 0, y: 0 };
		}

		return { x: area.x, y: area.y, width: area.width, height: area.height };
	}

	createOpponentCard(cardData) {
		let initialPosition = this.getAreaPosition(cardData.zone);

		let cardCreated = this.scene.add.sprite(initialPosition.x, initialPosition.y, 'defaultCardSprite').setInteractive();
		cardCreated.card_id = cardData.player_card_id;
		cardCreated.zone = cardData.zone;
		cardCreated.action = cardData.action;

		this.cards[cardData.zone].push(cardCreated);
		this.updateCardPositions(cardData.zone);

		this.scene.load.image(`card-${cardData.player_card_id}`, cardData.image_url);
		this.scene.load.once('complete', () => {
			// cardCreated.setTexture(`card-${cardData.player_card_id}`);

			if (cardData.zone !== 'mana_pool') {
				cardCreated.setTexture(`card-${cardData.player_card_id}`);
			}

			// Get the original size of the card
			let scale = this.calculateScale(cardCreated, cardData.zone);
			// Apply the scale to the card
			cardCreated.setScale(scale);

			// Update card positions after setting the texture
			this.updateCardPositions(cardData.zone);
		});
		this.scene.load.start();

		if (cardData.action === 'tapped') {
			cardCreated.angle = 90;
		}

		return cardCreated;
	}

	moveOpponentCardToZone(card_id, newZone) {

		for (let zone in this.cards) {
			let cardIndex = this.cards[zone].findIndex(card => card.card_id === card_id);
			if (cardIndex !== -1) {
				let [card] = this.cards[zone].splice(cardIndex, 1);
				card.zone = newZone;

				if (newZone === 'mana_pool') {
					card.setTexture('defaultCardSprite');
				} else {
					this.scene.load.image(`card-${card.card_id}`, card.action.image_url);
					this.scene.load.once('complete', () => {
						card.setTexture(`card-${card.card_id}`);
					});
					this.scene.load.start();
				}
				this.cards[newZone].push(card);

				if ( newZone === 'hand'){
					let handSize = this.cards.hand.length
					this.scene.rightUserHandSize.setText(handSize);
					this.updateCardPositions(zone);

				} else {
					let scale = this.calculateScale(card, newZone);
					card.setScale(scale);

					this.updateCardPositions(newZone);
				}
				break;
			}
		}
	}

	updateCardPositions(zone) {
		let spacing = 110; // Spacing between cards
		let area = this.getAreaPosition(zone)

		this.cards[zone].forEach((card, index) => {
			card.y = (area.height - area.y) -  ((area.height - area.y) / 2)+ (index * spacing) + (spacing / 2);
			card.x = area.x;
		});
	}

	calculateScale(card, zone) {
		let desiredWidth, desiredHeight;
		if (zone === 'hand') {
			desiredWidth = this.hand_size.width;
			desiredHeight = this.hand_size.height;
		} else {
			desiredWidth = this.other_zones.width;
			desiredHeight = this.other_zones.height;
		}

		// Get the original size of the card
		let originalWidth = card.width;
		let originalHeight = card.height;

		// Calculate the scale factor to maintain the aspect ratio
		return Math.min(desiredWidth / originalWidth, desiredHeight / originalHeight);
	}
}