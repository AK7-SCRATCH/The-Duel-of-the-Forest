const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 1

class Sprite {
	constructor({
	  position, 
	  imageSrc, 
	  scale = 1, 
	  framesMax = 1, 
	  offset = {x: 0, y: 0}})
	{  
		this.position = position
		this.width = 50
		this.height = 150
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.framesMax = framesMax
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.framesHold = 5
		this.offset = offset
	}
	
	draw() {
		c.drawImage(
		  this.image, 
		  this.framesCurrent * (this.image.width / this.framesMax),
		  0,
		  this.image.width / this.framesMax,
		  this.image.height,
		  this.position.x - this.offset.x, 
		  this.position.y - this.offset.y,
		  (this.image.width / this.framesMax) * this.scale,
		  this.image.height * this.scale
		)
	}
	
	animateFrames() {
		this.framesElapsed++
		
		if (this.framesElapsed % this.framesHold == 0){
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++
			} else {
				this.framesCurrent = 0
			}
		}
	}

	
	update() {
      this.draw()
	}
}

class Fighter extends Sprite {
	constructor({
	  position, 
	  velocity, 
	  color = 'red',  
	  imageSrc, 
	  scale = 1, 
	  framesMax = 1, 
	  offset = {x: 0, y: 0},
	  sprites,
	  attackBox = {offset: {}, width: undefined, height: undefined}
 }) {
		super({
			position,
			imageSrc,
			scale,
			framesMax,
			offset
		})
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.lastKey
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height
		}
		this.color = color
		this.isAttacking
		this.health = 100
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.framesHold = 10
		this.sprites = sprites
		this.dead = false
		
		for (const sprite in this.sprites) {
			sprites[sprite].image = new Image()
			sprites[sprite].image.src = sprites[sprite].imageSrc
		}
		
		console.log(this.sprites);
	}
	
	
	update() {
      this.draw()
	  if (!this.dead) this.animateFrames()
	  
	  this.attackBox.position.x = this.position.x + this.attackBox.offset.x
	  this.attackBox.position.y = this.position.y + this.attackBox.offset.y
	  
	  //draw attackBox
	  //c.fillRect(this.attackBox.position.x, 
	             //this.attackBox.position.y, 
				 //this.attackBox.width, 
				 //this.attackBox.height
				 //)
	  
      this.position.x += this.velocity.x	  
	  this.position.y += this.velocity.y
	  
	  if(this.position.y + this.height + this.velocity.y >= canvas.height - 70) {
		  this.velocity.y = 0
		  this.position.y = 356
	  } else this.velocity.y += gravity
	}
	
	attack() {
		this.switchSprite('attack1')
		this.isAttacking = true
	}
	
	takeHit(){
		this.health -= 20
		if (this.health <= 0) {
			this.switchSprite('death')
		} else this.switchSprite('takeHit')
	}
	
	switchSprite(sprite) {
		
		if (this.image == this.sprites.death.image) {
			if(this.framesCurrent == this.sprites.death.framesMax - 1) this.dead = true
			
			return}
		
		if (this.image == this.sprites.attack1.image && 
		this.framesCurrent < this.sprites.attack1.framesMax - 1) return
		
		if (this.image == this.sprites.takeHit.image && 
		this.framesCurrent < this.sprites.takeHit.framesMax - 1) return
		
		switch (sprite) {
			case 'idle':
			if(this.image !== this.sprites.idle.image) {
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
				this.framesCurrent = 0
            } 		
			break
			case 'run':
			if(this.image !== this.sprites.run.image) {
				this.image = this.sprites.run.image
			    this.framesMax = this.sprites.run.framesMax
				this.framesCurrent = 0
		    }
			break
			case 'runBack':
			if(this.image !== this.sprites.runBack.image) {
				this.image = this.sprites.runBack.image
			    this.framesMax = this.sprites.runBack.framesMax
				this.framesCurrent = 0
			}
			break
			case 'jump':
			if(this.image !== this.sprites.jump.image) {
				this.image = this.sprites.jump.image
			    this.framesMax = this.sprites.jump.framesMax
				this.framesCurrent = 0
            }		
			break
			case 'fall':
			if(this.image !== this.sprites.fall.image) {
				this.image = this.sprites.fall.image
			    this.framesMax = this.sprites.fall.framesMax
				this.framesCurrent = 0
            }		
			break
			case 'attack1':
			if(this.image !== this.sprites.attack1.image) {
				this.image = this.sprites.attack1.image
			    this.framesMax = this.sprites.attack1.framesMax
				this.framesCurrent = 0
            }
			break
			case 'takeHit':
			if(this.image !== this.sprites.takeHit.image) {
				this.image = this.sprites.takeHit.image
			    this.framesMax = this.sprites.takeHit.framesMax
				this.framesCurrent = 0
            }
			break
			case 'death':
			if(this.image !== this.sprites.death.image) {
				this.image = this.sprites.death.image
			    this.framesMax = this.sprites.death.framesMax
				this.framesCurrent = 0
            }
			break
		}
	}
}

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './img/Background.png'
})

const player = new Fighter({
	position: {
		x: 100,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './img/Warrior/Idle.png',
	framesMax: 10,
	scale: 2.5,
	offset: {
		x: 150,
		y: 100
	},
	sprites: {
		idle: {
			imageSrc: './img/Warrior/Idle.png',
			framesMax: 10
		},
		run: {
			imageSrc: './img/Warrior/Run.png',
			framesMax: 8
		},
		runBack: {
			imageSrc: './img/Warrior/RunBack.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/Warrior/Jump.png',
			framesMax: 3
		},
		fall: {
			imageSrc: './img/Warrior/Fall.png',
			framesMax: 3
		},
		attack1: {
			imageSrc: './img/Warrior/Attack.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/Warrior/TakeHit.png',
			framesMax: 3
		},
		death: {
			imageSrc: './img/Warrior/Death.png',
			framesMax: 7
		}
		
	},
	attackBox: {
		offset: {
			x: 100,
			y: 50
		},
		width: 88,
		height: 50
	}
})

const enemy = new Fighter({
	position: {
		x: 800,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: 'blue',
	offset: {
		x: 100,
		y: 0
	},
	imageSrc: './img/Warrior2/Idle.png',
	framesMax: 10,
	scale: 2.8,
	offset: {
		x: 130,
		y: 89
	},
	sprites: {
		idle: {
			imageSrc: './img/Warrior2/Idle.png',
			framesMax: 10
		},
		run: {
			imageSrc: './img/Warrior2/Run.png',
			framesMax: 6
		},
		runBack: {
			imageSrc: './img/Warrior2/RunBack.png',
			framesMax: 6
		},
		jump: {
			imageSrc: './img/Warrior2/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/Warrior2/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/Warrior2/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/Warrior2/TakeHit.png',
			framesMax: 3
		},
		death: {
			imageSrc: './img/Warrior2/Death1.png',
			framesMax: 9
		}
	},
	attackBox: {
		offset: {
			x: -90,
			y: 50
		},
		width: 100,
		height: 50
	}
})

console.log(player)

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}
}

function rectangularCollision({ rectangle1, rectangle2 }){
	return(
	  rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
	  rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
	  rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
	  rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}

function determineWinner({player, enemy, timerId}) {
	clearTimeout(timerId)
	document.querySelector('#displayText').style.display = 'flex'
	if (player.health == enemy.health){
		document.querySelector('#displayText').innerHTML = 'Tie'
	    } else if(player.health > enemy.health) {
			document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
			enemy.switchSprite('death')
		} else if(player.health < enemy.health) {
			document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
			player.switchSprite('death')
		}
}

let timer = 60
let timerId
function decreaseTimer(){
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000)
		timer--
		document.querySelector('#timer').innerHTML = timer
	}
	
	if (timer == 0) {
		determineWinner({player, enemy, timerId})
	}
}

decreaseTimer()

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	player.update()
	enemy.update()
	c.fillStyle = 'rgba(255, 255, 255, 0.1)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	
	player.velocity.x = 0
	enemy.velocity.x = 0
	
	//player movement
	if(keys.a.pressed && player.lastKey === 'a'
	   && player.position.x > -20) {
		player.velocity.x = -7
		player.switchSprite('runBack')
	} else if(keys.d.pressed && player.lastKey === 'd'
	   && player.position.x < 925) {
		player.velocity.x = 7
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}
	
	//jump
	if (player.velocity.y < 0){
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}
		
	//enemy movement
	if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' 
	   && enemy.position.x > -20) {
		enemy.velocity.x = -7
		enemy.switchSprite('run')
	} else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' 
	   && enemy.position.x < 925) {
		enemy.velocity.x = 7
		enemy.switchSprite('runBack')
	} else {
		enemy.switchSprite('idle')
	}
	
	//jump
	if (enemy.velocity.y < 0){
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}
	
	//detect collision
	if(
	  rectangularCollision({rectangle1: player, rectangle2: enemy}) &&
	  player.isAttacking && player.framesCurrent == 2
	  ) {
		  enemy.takeHit()
          player.isAttacking = false
		  gsap.to('#enemyHealth', {
			  width: enemy.health + '%'
		  })
	}
	
	if (player.isAttacking && player.framesCurrent == 2) {
		player.isAttacking = false
	}
	
	if(
	  rectangularCollision({rectangle1: enemy, rectangle2: player}) &&
	  enemy.isAttacking && enemy.framesCurrent == 2) {
		  player.takeHit()
          enemy.isAttacking = false
          gsap.to('#playerHealth', {
			  width: player.health + '%'
		  })
	}
	
	if (enemy.isAttacking && enemy.framesCurrent == 2) {
		enemy.isAttacking = false
	}
	
	
	//end game if someone dies
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId})
	}
}

animate()

window.addEventListener('keydown', (event) => {
	if (!player.dead) {
	switch (event.key) {
		//player keys
		case 'd':
		  keys.d.pressed = true
		  player.lastKey = 'd'
		  break
		case 'a':
		  keys.a.pressed = true
		  player.lastKey = 'a'
		  break
		case 'w':
		if (player.position.y > -50) {
		  player.velocity.y = -20
		}
		  break
		case ' ':
		  player.attack()
		  break
	}
    }
	
    if(!enemy.dead) {
	switch (event.key) {
		//enemy keys
		case 'ArrowRight':
		  keys.ArrowRight.pressed = true
		  enemy.lastKey = 'ArrowRight'
		  break
		case 'ArrowLeft':
		  keys.ArrowLeft.pressed = true
		  enemy.lastKey = 'ArrowLeft'
		  break
		case 'ArrowUp':
		if (enemy.position.y > -50) {
			enemy.velocity.y = -20
		}
		  break
		case 'ArrowDown':
		  enemy.attack()
		  break
	}
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
		  keys.d.pressed = false
		  break
		case 'a':
		  keys.a.pressed = false
		  break
	}
	
	switch (event.key) {
		case 'ArrowRight':
		  keys.ArrowRight.pressed = false
		  break
		case 'ArrowLeft':
		  keys.ArrowLeft.pressed = false
		  break
	}
})