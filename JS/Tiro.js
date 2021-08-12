function Tiro(x, y){
	this.widthTela = 40
	this.heightTela = 40
	this.width = 2
	this.height = 4
	this.x = x
	this.y = y
	this.vel = 8
	this.color = "#fcba03"
	this.audio = new Audio()
	this.audio.src = "./AUDIOS/tiro.wav"
	this.audio.volume = window.document.getElementById('volJogo').value / 10
}

Tiro.prototype.halfWidth = function(){
	return this.widthTela / 2
}

Tiro.prototype.halfHeight = function(){
	return this.heightTela / 2
}

Tiro.prototype.centerX = function(){
	return this.x + this.halfWidth()
}

Tiro.prototype.centerY = function(){
	return this.y + this.halfHeight()
}