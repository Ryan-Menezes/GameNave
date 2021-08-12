function Nave(widthTela, heightTela, img){
	this.widthTela = 40
	this.heightTela = 40
	this.width = 1600
	this.height = 1600
	this.x = (widthTela / 2) - (this.widthTela / 2)
	this.y = (heightTela / 2) - (this.heightTela / 2)
	this.img = img
	this.vel = 8
	this.visible = true
}

Nave.prototype.halfWidth = function(){
	return this.widthTela / 2
}

Nave.prototype.halfHeight = function(){
	return this.heightTela / 2
}

Nave.prototype.centerX = function(){
	return this.x + this.halfWidth()
}

Nave.prototype.centerY = function(){
	return this.y + this.halfHeight()
}