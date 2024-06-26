import { PlayerTypes } from "../PlayerTypes";

export default class Card extends Phaser.GameObjects.Sprite {
	constructor(scene, cardData, initialPosition, initialAngle = 0, playerType, handSize, otherZones) {
		super(scene, initialPosition.x, initialPosition.y, 'defaultCardSprite');
		this.scene = scene;
		this.player_card_id = cardData.player_card_id;
		this.zone = cardData.zone;
		this.card_name = cardData.name;
		this.morphed = cardData.morphed;
		this.tapped = cardData.tapped;
		this.image_url = cardData.image_url;
		this.player_type = playerType;
		this.hand_size = handSize;
		this.other_zones = otherZones;
		this.owner_id = cardData.owner_id;
		this.current_holder_id = cardData.current_holder_id;

		// Set the initial angle
		this.angle = initialAngle;
		this.initial_angle = initialAngle;
		this.tapped_angle = initialAngle + 45;
		// Set interactive
		this.setInteractive();

		// Add to scene
		scene.add.existing(this);

		// Calculate and apply initial scale
		this.setScale(this.calculateScale(handSize, otherZones));

		// Load card image
		this.loadCardTexture();

		// Handle interactions
		this.on('pointerdown', this.handlePointerDown, this);
		this.on('pointerover', this.showCard, this)
	}

	updateNewHolder(holder_id, initialAngle, zone, handSize, otherZones) {
		this.current_holder_id = holder_id;
		this.angle = initialAngle;
		this.initial_angle = initialAngle;
		this.tapped_angle = initialAngle + 45;
		this.zone = zone;
		this.setScale(this.calculateScale(handSize, otherZones));
	}

	getPlayerCardId(){
		return this.owner_id
	}

	showCard() {
		if (this.scene.LoadGame.players.currentPlayer.player_id === this.getPlayerCardId()) {
			if (this.zone !== 'mana_pool') {
				this.scene.BoardCreation.updateCardViewer({
					title: this.card_name ,
					image_url: this.image_url,
					player_card_id: this.player_card_id
				});
			} else {
			}
		} else if (this.zone === 'play_zone' && this.morphed === false) {
			this.scene.BoardCreation.updateCardViewer({
				title: this.card_name ,
				image_url: this.image_url,
				player_card_id: this.player_card_id
			});
		} else {
		}
	}

	opponent() {
		return this.player_type === 'opponent'
	}

	card_behaviour() {
		if ( this.inHand() && this.opponent() ){
			this.setVisible(false);
		} else {
			this.setVisible(true);
		}
	}

	loadCardTexture() {
		this.scene.load.image(`card-${this.player_card_id}`, this.image_url);
		this.scene.load.once('complete', () => {
			if (this.inPlayzone() && this.morphed ) {
				this.setTexture('defaultCardSprite');
			} else if (this.inManaPool()) {
				this.setTexture('defaultCardSprite');
			} else if (!this.inManaPool()) {
				this.setTexture(`card-${this.player_card_id}`);
			} else {
				console.log('DONDE ESTARA??')
			}
			this.setScale(this.calculateScale(this.handSize, this.otherZones));
		});
		this.scene.load.start();

		if (this.inManaPool() || this.inPlayzone()) {
			this.angle = this.tappedLogic()
		}
		this.card_behaviour();
	}

	calculateScale(handSize, otherZones) {
		let desiredWidth, desiredHeight;
		if (this.zone === 'hand') {
			desiredWidth = this.hand_size.width;
			desiredHeight = this.hand_size.height;
		} else {
			desiredWidth = this.other_zones.width;
			desiredHeight = this.other_zones.height;
		}

		// Get the original size of the card
		let originalWidth = this.width;
		let originalHeight = this.height;

		// Calculate the scale factor to maintain the aspect ratio
		return Math.min(desiredWidth / originalWidth, desiredHeight / originalHeight);
	}

	cardRobbed(){
		return this.owner_id !== this.current_holder_id
	}

	inManaPool() {
		return this.zone === 'mana_pool'
	}

	inHand() {
		return this.zone === 'hand'
	}

	inPlayzone(){
		return this.zone === 'play_zone'
	}

	inGraveyard() {
		return this.zone === 'graveyard'
	}

	handlePointerDown(card) {
			if (this.cardInMyPossession() ) {
				if (card.rightButtonDown()) this.scene.LoadGame.players.currentPlayer.showContextMenu(card, this);
				if (card.leftButtonDown() && (this.inPlayzone() || this.inManaPool()) ) this.toggleTapped();
			} else {
				if (card.rightButtonDown()) {
					const player = this.scene.LoadGame.players.findOpponent(this.owner_id) || this.scene.LoadGame.players.currentPlayer
					player.showOpponentMenu(card, this);
				}
			}
	}

	isMyCard(){
		return this.scene.LoadGame.players.currentPlayer.player_id === this.owner_id
	}

	cardInMyPossession(){
		return this.scene.LoadGame.players.currentPlayer.player_id === this.current_holder_id
	}

	tappedLogic(){
		return this.tapped ? this.tapped_angle : this.initial_angle;
	}

	toggleTapped() {
		console.log("Tapping Card")
		this.scene.GameActions.send({
			action: "change_state",
			param: {
				player_card_id: this.player_card_id,
				tapped: !this.tapped,
				morphed: this.morphed,
				new_zone: this.zone,
				old_zone: this.zone
			}
		});
	}
}