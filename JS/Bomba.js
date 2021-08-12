function Bomba(W){
	this.widthTela = 20
	this.heightTela = 40
	this.width = 423
	this.height = 1000
	this.x =  Math.floor(Math.random() * W)
	this.y = -(this.heightTela)
	this.vel = 2
}

Bomba.prototype.halfWidth = function(){
	return this.widthTela / 2
}

Bomba.prototype.halfHeight = function(){
	return this.heightTela / 2
}

Bomba.prototype.centerX = function(){
	return this.x + this.halfWidth()
}

Bomba.prototype.centerY = function(){
	return this.y + this.halfHeight()
}