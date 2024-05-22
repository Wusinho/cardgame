import BoardHandler from "./BoardHandler";
import SocketHandler from "./SocketHandler";

export default class GameHandler {
	constructor(scene) {
		this.boardHandler = new BoardHandler(scene);
		this.scene = scene;
		this.topSite =  null;
		this.leftSite =  null;
		this.rightSite = null;
		this.currentUser = null

		this.scene.events.on("boardReceived", this.handleBoardReceived, this);
		this.gameState = 'Initializing';

		this.isMyTurn = false;
		this.players = [];

		this.changeTurn = () =>{
			this.isMyTurn = !this.isMyTurn;
			console.log('isMyTurn: ' + this.isMyTurn);
		}
		this.changeGameState = (gameState) =>{
			this.gameState = gameState;
			console.log('Game State: ' + this.gameState);
		}
	}

	handleBoardReceived(data) {

		if ( this.currentUser === null) {
			this.currentUser = data[0];
			this.scene.currentUserName = this.create_text(120,1050, this.currentUser)
				.setFontSize(14)
				.setFontFamily("Arial")
				.setInteractive();

			let cards = this.currentUser.cards.hand
			this.addCardsToCurrentUserHand(cards, this.scene.currentUserHandArea.x, this.scene.currentUserHandArea.y, false)
		}

		const filtered_data = data[1].filter(opponent => opponent.id != this.currentUser.id);
		filtered_data.forEach(opponent => this.order_player_position(opponent))
	}

	order_player_position(opponent){
		if(this.currentUser.order === 3){
			if (opponent.order === 1) {
				let cards = opponent.cards.hand
				this.addCardsToCurrentUserHand(cards,this.scene.topOpponentHandArea.x, this.scene.topOpponentHandArea.y, true)
				this.scene.topSiteName = this.create_text(900,70, opponent)
			} else if (opponent.order === 2) {
				this.leftSite = opponent
				let cards = opponent.cards.hand
				this.addCardsToCurrentUserHandY(cards,this.scene.leftOpponentHandArea.x, this.scene.leftOpponentHandArea.y, true)
				this.scene.leftSiteName = this.create_text(30,135, opponent)
			} else {
				this.rightSite = opponent
				let cards = opponent.cards.hand
				this.addCardsToCurrentUserHandY(cards,this.scene.rightOpponentHandArea.x, this.scene.rightOpponentHandArea.y, true)
				this.scene.rightSiteName = this.create_text(1050,135, opponent)
			}
		} else {
			if ( this.currentUser.order - opponent.order === -1 ) {
				this.rightSite = opponent
				let cards = opponent.cards.hand
				this.addCardsToCurrentUserHandY(cards,this.scene.rightOpponentHandArea.x, this.scene.rightOpponentHandArea.y, true)
				this.scene.rightSiteName = this.create_text(1050,135, opponent)
			} else if (Math.abs(this.currentUser.order - opponent.order) === 2 ) {
				this.topSite = opponent
				let cards = opponent.cards.hand
				this.addCardsToCurrentUserHand(cards,this.scene.topOpponentHandArea.x, this.scene.topOpponentHandArea.y, true)
				this.scene.topSiteName = this.create_text(900,70, opponent)
			} else {
				this.leftSite = opponent
				let cards = opponent.cards.hand
				this.addCardsToCurrentUserHandY(cards,this.scene.leftOpponentHandArea.x, this.scene.leftOpponentHandArea.y, true)
				this.scene.leftSiteName = this.create_text(30,135, opponent)
			}
		}
	}

	createCardSpriteY = (x, y, spriteKey, cardName, i) => {
		const card = this.scene.add.sprite(0, 0, spriteKey).setInteractive();

		card.displayWidth = 240; // Set card width
		card.displayHeight = 100; // Set card height
		card.setOrigin(0.5);

		// Rotate the card by 90 degrees to make it horizontal
		// card.angle = 90;

		// Add a white border around the card
		const border = this.scene.add.rectangle(0, 0, this.cardHeight, this.cardWidth);
		border.setStrokeStyle(2, 0xffffff);
		border.setOrigin(0.5);
		border.angle = 90; // Rotate the border to match the card

		// Add card name text
		const cardText = this.scene.add.text(0, 0, cardName, {
			fontSize: '14px',
			fill: '#fff',
			fontFamily: 'Arial'
		}).setOrigin(0.5, 1.5);

		// Adjust the card position
		let value = (y + 70 + (115 * i));
		this.scene.add.container(x, value, [border, card, cardText]);
	};

	addCardsIfAny(cards, opponent = true){
		if (cards){
			this.addCardsToCurrentUserHand(cards.hand, opponent);
		} else {
			this.addCardsToCurrentUserHand([], opponent);
		}
	}

	create_text(x,y,opponent) {
		this.players.push(opponent)
		return this.scene.add.text(x,y, opponent.username)
	}

	addCardsToCurrentUserHand = (cards = [], x, y, opponent = true) => {
		const handAreaX = x - (x/2);

		for (let i in cards) {
			const spriteKey = opponent ? "defaultOpponentSprite" : "defaultCardSprite";
			const cardName = opponent ? "" : cards[i].name;
			this.createCardSprite(handAreaX, y, spriteKey, cardName, i);
		}
	};

	addCardsToCurrentUserHandY = (cards = [], x, y, opponent = true) => {
		const handAreaY = y*0.17;

		for (let i in cards) {
			const spriteKey = opponent ? "defaultOpponentSprite" : "defaultCardSprite";
			const cardName = opponent ? "" : cards[i].name;
			this.createCardSpriteY(x, handAreaY, spriteKey, cardName, i);
		}
	};

	createCardSprite = (x, y, spriteKey, cardName, i) => {
		const card = this.scene.add.sprite(0, 0, spriteKey).setInteractive();

		card.displayWidth = x + 100;
		card.displayHeight = 240;
		card.setOrigin(0.5);

		// Add a white border around the card
		const border = this.scene.add.rectangle(0, 0, this.cardWidth, this.cardHeight);
		border.setStrokeStyle(2, 0xffffff);
		border.setOrigin(0.5);

		// Add card name text
		const cardText = this.scene.add.text(0, 0, cardName, {
			fontSize: '14px',
			fill: '#fff',
			fontFamily: 'Arial'
		}).setOrigin(0.5, 1.5);

		let value = (x + 30+(100 * i))
		this.scene.add.container(value, y, [border, card, cardText]);
	};

}