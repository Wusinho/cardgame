import Player from './Player';
import Card from "../cards/Card";
import {PlayerTypes} from "../PlayerTypes";

export default class TopPlayer extends Player {
	constructor(scene, player){
		super(scene, player);
		this.player_type = PlayerTypes.OPPONENT
		this.createUserName()
		this.hand_size = {
			width: 150,
			height: 200,
		}
		this.other_zones = {
			width: 100,
			height: 60,
		}
		this.hand_area = this.scene.topPlayerHandArea;
		this.mana_pool_area = this.scene.topPlayerManaPoolArea;
		this.play_zone_area = this.scene.topPlayerPlayZoneArea;
		this.graveyard_area = this.scene.topPlayerGraveyardArea;
		this.addCardsToGame(player.cards);
	}

	createUserName(){
		let centerX = this.scene.topPlayerUserInfo.x
		let centerY = this.scene.topPlayerUserInfo.y
		this.scene.currentUserName = this.create_text(centerX,centerY, this.player_name)
			.setFontSize(14)
			.setFontFamily("Arial")
			.setInteractive();
	}

	updateHandSize() {
		const handSize = this.cards.hand.length;
		if (this.scene.topPlayerHandSize) {
			// If the text object already exists, update its text
			this.scene.topPlayerHandSize.setText(`${handSize}`);
		} else {
			// If the text object does not exist, create it
			let centerX = this.scene.topPlayerHandArea.x;
			let centerY = this.scene.topPlayerHandArea.y;

			this.scene.topPlayerHandSize = this.create_text(centerX, centerY, `${handSize}`)
		}
	}

	getAreaPosition(zone) {
		let area;
		switch (zone) {
			case 'hand':
				area = this.hand_area;
				break;
			case 'mana_pool':
				area = this.mana_pool_area;
				break;
			case 'play_zone':
				area = this.play_zone_area;
				break;
			case 'exile':
				area = this.graveyard_area;
				break;
			case 'graveyard':
				area = this.graveyard_area
				break;
			default:
				console.error(`Unknown zone: ${zone}`);
				return { x: 0, y: 0 };
		}

		return { x: area.x, y: area.y, width: area.width, height: area.height };
	}

	updateCardPositions(zone) {
		let spacing = 110; // Spacing between cards
		let area = this.getAreaPosition(zone)

		this.cards[zone].forEach((card, index) => {
			if (zone !== 'hand') {
				card.x = area.x - (area.width / 2) + (index * spacing) + (spacing / 2);
				card.y = area.y;
			} else {
				card.x = area.x
				card.y = area.y
			}
		});
	}

	getInitialAngle(zone) {
		switch (zone) {
			case 'hand':
			case 'mana_pool':
			case 'play_zone':
			case 'exile':
			case 'graveyard':
				return -90; // Current player's cards are at angle 0
			default:
				return 0; // Default angle
		}
	}

}