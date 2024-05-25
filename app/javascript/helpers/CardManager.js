
export default class CardManager {
	constructor(scene) {
		this.scene = scene;
		this.setupContextMenuListeners(); // Setup context menu event listeners
		this.createCurrentUserCard = this.createCurrentUserCard.bind(this);
		this.createVerticalOpponentCard = this.createVerticalOpponentCard.bind(this);
		this.createHorizontalOpponentCard = this.createHorizontalOpponentCard.bind(this);
	}

	createVerticalOpponentCard = (x, y, i, spriteKey = 'defaultOpponentSprite', cardName = '' ) => {
		let value = 125 + (x * i) + (50)

		const card = this.scene.add.sprite(value, y, spriteKey).setInteractive();

		card.displayWidth = 100;
		card.displayHeight = 240;
	}

	createHorizontalOpponentCard = (x, y, i, spriteKey = 'defaultOpponentSprite' ) => {
		let value = 125 + (x * i) + (50)

		const card = this.scene.add.sprite(value, y, spriteKey).setInteractive();

		card.displayWidth = 100;
		card.displayHeight = 240;
		card.angle = 90;
	}

	createCurrentUserCard(x, y, i, spriteKey = 'defaultCardSprite', card = '') {
		let value = 125 + (x * i) + 50;
		let img_url = card.image_url;

		this.scene.load.image(`card-${card.id}`, img_url);
		this.scene.load.once('complete', () => {
			cardCreated.setTexture(`card-${card.id}`);
			cardCreated.displayWidth = 100; // Adjust the width as needed
			cardCreated.displayHeight = 240; // Adjust the height as needed
		});
		// Create the card sprite
		const cardCreated = this.scene.add.sprite(value, y, spriteKey).setInteractive();
		cardCreated.setTexture(img_url);

		cardCreated.displayWidth = 100;
		cardCreated.displayHeight = 240;
		this.scene.load.start();

		// Event listener for left button down
		cardCreated.on('pointerdown', (pointer) => {
			if (pointer.rightButtonDown()) {

				// Show context menu
				const contextMenu = document.getElementById('context-menu');
				contextMenu.style.display = 'block';
				contextMenu.style.left = `${pointer.event.clientX}px`;
				contextMenu.style.top = `${pointer.event.clientY}px`;

				// Store card reference for menu actions
				contextMenu.card = cardCreated;

				// Auto-hide context menu after 2 seconds
				setTimeout(() => {
					contextMenu.style.display = 'none';
				}, 4000);
			} else if (pointer.leftButtonDown()) {
				// Rotate the card 90 degrees on left click
				cardCreated.angle += 90;
			}
		});

		return cardCreated;
	}

	setupContextMenuListeners() {
		document.getElementById('play-in-mana-pool').addEventListener('click', () => {
			const contextMenu = document.getElementById('context-menu');
			this.scene.Zones.moveToZone(contextMenu.card, 'mana_pool');
			contextMenu.style.display = 'none';
		});

		document.getElementById('play-in-playzone').addEventListener('click', () => {
			const contextMenu = document.getElementById('context-menu');
			this.scene.Zones.moveToZone(contextMenu.card, 'playzone');
			contextMenu.style.display = 'none';
		});

		document.getElementById('play-in-playzone-morph').addEventListener('click', () => {
			const contextMenu = document.getElementById('context-menu');
			this.scene.Zones.moveToZone(contextMenu.card, 'playzone');
			contextMenu.style.display = 'none';
		});

		document.getElementById('play-in-graveyard').addEventListener('click', () => {
			const contextMenu = document.getElementById('context-menu');
			this.scene.Zones.moveToZone(contextMenu.card, 'graveyard');
			contextMenu.style.display = 'none';
		});

		document.getElementById('play-in-hand').addEventListener('click', () => {
			const contextMenu = document.getElementById('context-menu');
			this.scene.Zones.moveToZone(contextMenu.card, 'hand');
			contextMenu.style.display = 'none';
		});

	}
}