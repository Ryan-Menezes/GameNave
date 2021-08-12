//Explosão no ar

function ExplosaoCeu(x, y, img){
	this.widthTela = 60
	this.heightTela = 60
	this.width = 64
	this.height = 64
	this.x = x - this.halfWidth()
	this.y = y
	this.srcX = 0
	this.srcY = 0
	this.img = img
	this.audio = new Audio()
	this.audio.src = "./AUDIOS/explosao.mp3"
	this.audio.volume = window.document.getElementById('volJogo').value / 10
	this.countX = 0
	this.countY = 0
}

ExplosaoCeu.prototype.halfWidth = function(){
	return this.widthTela / 2
}

ExplosaoCeu.prototype.halfHeight = function(){
	return this.heightTela / 2
}

ExplosaoCeu.prototype.anima = function(){
	this.countY++
	this.countX++

	if(this.countX >= 320) this.countX = 0
	if(this.countY >= 320) this.countY = 0

	this.srcY = this.countY * this.height
	this.srcX = this.countX * this.width
}

//Explosão no solo

function ExplosaoSolo(x, y, img){
	this.widthTela = 60
	this.heightTela = 50
	this.width = 65.6
	this.height = 81
	this.x = x - this.halfWidth()
	this.y = y
	this.srcX = 0
	this.srcY = 0
	this.img = img
	this.audio = new Audio()
	this.audio.src = "./AUDIOS/explosao.mp3"
	this.audio.volume = window.document.getElementById('volJogo').value / 10
	this.countX = 0
	this.countY = 0
}

ExplosaoSolo.prototype.halfWidth = function(){
	return this.widthTela / 2
}

ExplosaoSolo.prototype.halfHeight = function(){
	return this.heightTela / 2
}

ExplosaoSolo.prototype.anima = function(){
	this.countY++
	this.countX++

	if(this.countX >= 328) this.countX = 0
	if(this.countY >= 405) this.countY = 0

	this.srcY = this.countY * this.height
	this.srcX = this.countX * this.width
}