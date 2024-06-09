import Player from './Player';
import Card from '../cards/Card'
import { PlayerTypes } from "../PlayerTypes";
import {get} from "@rails/request.js";

export default class CurrentPlayer extends Player {
	constructor(scene, player) {
		super(scene, player);
		this.player_type = PlayerTypes.CURRENT
		this.createUserName()
		this.hand_size = {
			width: 150,
			height: 200,
		}
		this.other_zones = {
			width: 100,
			height: 100,
		}
		this.hand_area = this.scene.currentPlayerHandArea;
		this.mana_pool_area = this.scene.currentPlayerManaPoolArea;
		this.play_zone_area = this.scene.currentPlayerPlayZoneArea;
		this.graveyard_area = this.scene.currentPlayerGraveyardArea;
		this.addCardsToGame(player.cards);
	}

	createUserName(){
		let centerX = this.scene.currentPlayerInformation.x
		let centerY = this.scene.currentPlayerInformation.y

		this.scene.currentUserName = this.create_text(centerX,centerY, this.player_name)
			.setFontSize(40)
			.setFontFamily("Arial")
			.setInteractive();
	}

	updateCardPositions(zone) {
		let spacing = 110; // Spacing between cards
		let area = this.getAreaPosition(zone)

		this.cards[zone].forEach((card, index) => {
			card.x = area.x - (area.width / 2) + (index * spacing) + (spacing / 2);
			card.y = area.y;
		});
	}

	getInitialAngle(zone) {
		switch (zone) {
			case 'hand':
			case 'mana_pool':
			case 'play_zone':
			case 'exile':
			case 'graveyard':
				return 0; // Current player's cards are at angle 0
			default:
				return 0; // Default angle
		}
	}

	showContextMenu(pointer, card) {
		const contextMenu = document.getElementById('context-menu');
		contextMenu.style.display = 'block';
		contextMenu.style.left = `${pointer.event.clientX}px`;
		contextMenu.style.top = `${pointer.event.clientY}px`;

		contextMenu.card = card;

		document.getElementById('play-in-mana-pool').onclick = () => {
			// this.moveCardToZone(card.card_id, 'mana_pool');
			this.scene.GameActions.send({ action: "change_zone", param: { card_id: card.card_id,
					new_zone: 'mana_pool'} });
			contextMenu.style.display = 'none';
		};

		document.getElementById('play-in-play_zone').onclick = () => {
			// this.moveCardToZone(card.card_id, 'play_zone');
			this.scene.GameActions.send({ action: "change_zone", param: { card_id: card.card_id,
					new_zone: 'play_zone'} });
			contextMenu.style.display = 'none';
		};

		document.getElementById('play-in-play_zone-morph').onclick = () => {
			// this.moveCardToZone(card.card_id, 'play_zone');
			this.scene.GameActions.send({ action: "morphed_from_hand", param: { player_card_id: card.card_id,
					new_zone: 'play_zone', new_action: 'morphed'} });
			contextMenu.style.display = 'none';
		};

		document.getElementById('play-in-graveyard').onclick = () => {
			this.moveCardToZone(card.card_id, 'graveyard');
			this.scene.GameActions.send({ action: "change_zone", param: {card_id: card.card_id,
					new_zone: 'graveyard'} });
			if (card.action === 'tapped') card.angle = 0
			contextMenu.style.display = 'none';
		};

		document.getElementById('play-in-hand').onclick = () => {
			this.moveCardToZone(card.card_id, 'hand');
			this.scene.GameActions.send({ action: "change_zone", param: {card_id: card.card_id,
					new_zone: 'hand'} });
			if (card.action === 'tapped') card.angle = 0
			contextMenu.style.display = 'none';
		};

		document.getElementById('play-in-exile').onclick = () => {
			this.moveCardToZone(card.card_id, 'exile');
			this.scene.GameActions.send({ action: "change_zone", param: {card_id: card.card_id,
					new_zone: 'exile'} });
			if (card.action === 'tapped') card.angle = 0
			contextMenu.style.display = 'none';
		};

		document.getElementById('read-card').onclick = () => {
			const card_id = card.card_id
			const url = `/player_cards/${card_id}`

			get(url, {
				responseKind: "turbo-stream"
			})
		};

		document.addEventListener('click', (event) => {
			if (contextMenu.style.display === 'block' && !contextMenu.contains(event.target)) {
				contextMenu.style.display = 'none';
			}
		});

		contextMenu.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	}

}
