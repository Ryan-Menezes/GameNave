(function(){
	// Constantes do jogo

	const LEFT = {seta: 37, tecla: 65}, 
		  UP = {seta: 38, tecla: 87}, 
		  RIGHT = {seta: 39, tecla: 68}, 
		  DOWN = {seta: 40, tecla: 83}, 
		  ESPACO = 32

	const LIMITEBOMBAS = 5													// LIMITE DE BOMBAS QUE SERÃO GERADAS NA TELA
	const LIMITETIRO = 100													// LIMITE DE TIROS QUE PODERÃO SER DISPARADOS
	const TEMPOEXPLOSAO = 800												// TEMPO DE EPLOSÃO DAS BOMBAS
	const GRAVIDADE = 0.1													// VALOR DA GRAVIDADE QUE SERÁ APLICADO NA QUEDA DAS BOMBAS
	const TIRAVIDAIMPACTO = 0.5												// VALOR QUE SERÁ SUBTRAIDO DA SUA VIDA A CADA COLISÃO DE BOMBAS AO CHÃO
	const PONTOSCORE = 10 													// PONTOS ACRESCIDOS AO SCORE NO JOGO
	const TEMPORECARREGATIRO = 1000											// TEMPO PARA CARREGAR BALA POR BALA AOS TIROS DISPONÍVEIS
	const BARRAVIDA = window.document.getElementById('barraVida')			// ELEMENTO QUE ARMAZENA A VIDA RESTANTE DO PERSONAGEM
	const SCOREPLACAR = window.document.getElementById('scorePontos')		// ELEMENTO QUE ARMAZENA O SCORE DO JOGO
	const TIROSPLACAR = window.document.getElementById('totalTiros')		// ELEMENTO QUE ARMAZENA OS TIROS DISPONÍVEIS DO JOGO

	// Variaveis de movimento

	var movLeft = movUp = movRight = movDown = tiroDisparo = false			// VARIÁVEIS QUE INDICAM QUAL A AÇÃO QUE O JOGADOR QUER QUE O GAME FAÇA

	// Canvas

	var cnv = window.document.getElementsByTagName('canvas')[0]				// CANVAS DO JOGO
	var ctx = cnv.getContext("2d")											// CONTEXTO ONDE IRÁ SER DESENHADO O JOGO

	// Jogo

	var game = false														// VARIÁVEL QUE ARMAZENA A SITUAÇÃO DO JOGO													
	var frames = null														// VARIÁVEL QUE ARMAZENA OS FRAMES DO JOGO
	var life = 100															// VARIÁVEL QUE ARMAZENA A VIDA DO PERSONAGEM DURANTE O JOGO
	var tipoMensagem = 0 													// VARIÁVEL QUE ARMAZENA O TIPO DE MENSAGEM A SER APRESENTADA NA TELA: 0 - Inicio | 1 - Game Over
	var score = 0															// VARIÁVEL QUE ARMAZENA O SCORE DO JOGADOR DURANTE O JOGO
	var totalTiros = LIMITETIRO												// VARIÁVEL QUE ARMAZENA O TOTAL DE TIROS DO JOGADOR DURANTE O JOGO

	// Imagens

	var imgFundo = new Image()												// TEXTURA DO FUNDO
	imgFundo.src = "./IMGS/Fundo.webp"

	var imgNave = new Image()												// TEXTURA DA NAVE
	imgNave.src = "./IMGS/Nave.png"

	var imgBomba = new Image()												// TEXTURA DAS BOMBAS
	imgBomba.src = "./IMGS/Bomba.png"

	var imgExplosaoCeu = new Image()										// TEXTURA DA EXPLOSÃO NO CÉU
	imgExplosaoCeu.src = "./IMGS/ExplosaoAr.png"

	var imgExplosaoSolo = new Image()										// TEXTURA DA EXPLOSÃO NO SOLO
	imgExplosaoSolo.src = "./IMGS/ExplosaoSolo.png"

	var imgStart = new Image()												// TEXTURA DE START GAME
	imgStart.src = "./IMGS/Start.png"

	var imgGameOver = new Image()											// TEXTURA DE GAME OVER
	imgGameOver.src = "./IMGS/GameOver.png"

	// Audio do jogo

	var musica = new Audio()												// VARIÁVEL QUE ARMAZENA A MÚSICA DO JOGO
	musica.loop = true
	musica.src = "./AUDIOS/musica.mp3"
	musica.volume = window.document.getElementById('volMusica').value / 10
	musica.autoplay = true

	// Carregando loop do jogo

	imgFundo.onload = loop

	// Inicializando musica(OBS: Isso pode gerar algum erro em alguns navegadores)

	musica.addEventListener('canplaythrough', () => musica.play())

	// Carrega total de tiros

	setInterval(() => {if(totalTiros < LIMITETIRO) totalTiros++}, TEMPORECARREGATIRO)

	// Vetores de objetos

	var tiros = []
	var bombas = []
	var explosoes = []

	// Criando o personagem principal(Nave)

	var nave = new Nave(cnv.width, cnv.height, imgNave)

	function inicia(){
		game = true
		life = 100
		score = 0
		totalTiros = LIMITETIRO
		BARRAVIDA.style.width = `${life}%`
		SCOREPLACAR.innerText = score
		TIROSPLACAR.innerText = `${totalTiros}/${LIMITETIRO}`

		tiros = []
		bombas = []
		explosoes = []
		nave = new Nave(cnv.width, cnv.height, imgNave)

		if(frames == null) window.requestAnimationFrame(loop)
		
		setInterval(function(){
			if(explosoes.length > 0){
				explosoes[0].audio.remove()
				explosoes.splice(0, 1)
			}
		}, TEMPOEXPLOSAO)
	}

	cnv.addEventListener("mousedown", function(){
		if(!game) inicia()
		else tiroDisparo = true
	})

	cnv.addEventListener("mouseup", () => tiroDisparo = false)

	window.addEventListener("keydown", function(e){
		let codigo = e.keyCode

		if(codigo == LEFT.seta || codigo == LEFT.tecla) movLeft = true
		if(codigo == UP.seta || codigo == UP.tecla) movUp = true
		if(codigo == RIGHT.seta || codigo == RIGHT.tecla) movRight = true	
		if(codigo == DOWN.seta || codigo == DOWN.tecla) movDown = true
		if(codigo == ESPACO) tiroDisparo = true
	})

	window.addEventListener("keyup", function(e){
		let codigo = e.keyCode

		if(codigo == LEFT.seta || codigo == LEFT.tecla) movLeft = false
		if(codigo == UP.seta || codigo == UP.tecla) movUp = false
		if(codigo == RIGHT.seta || codigo == RIGHT.tecla) movRight = false	
		if(codigo == DOWN.seta || codigo == DOWN.tecla) movDown = false
		if(codigo == ESPACO) tiroDisparo = false
	})

	function geraBomba(){
		setTimeout(function(){
			if(bombas.length < LIMITEBOMBAS) bombas.push(new Bomba(cnv.width))
		}, 1000)
	}

	function geraExplosao(x, y, tipo){
		let explosao = (tipo == 1) ? new ExplosaoCeu(x, y, imgExplosaoCeu) : new ExplosaoSolo(x, y - 50, imgExplosaoSolo)

		if(explosao.audio.paused) explosao.audio.play()

		explosoes.push(explosao)
	}

	function colisao(objA, objB){
		let colidiu = false

		let catX = objA.centerX() - objB.centerX()
		let catY = objA.centerY() - objB.centerY()

		let sumHalfWidth = objA.halfWidth() + objB.halfWidth()
		let sumHalfHeight = objA.halfHeight() + objB.halfHeight()

		if(sumHalfWidth > Math.abs(catX) && sumHalfHeight > Math.abs(catY)) colidiu = true

		return colidiu
	}

	function update(){
		// Movimentando nave

		if(movLeft) nave.x -= nave.vel
		if(movUp) nave.y -= nave.vel
		if(movRight) nave.x += nave.vel
		if(movDown) nave.y += nave.vel

		// Verificando limites da nave

		nave.x = Math.max(0, Math.min(nave.x, (cnv.width - nave.widthTela)))
		nave.y = Math.max(0, Math.min(nave.y, (cnv.height - nave.heightTela)))

		// Verificando disparo da arma

		if(tiroDisparo){
			if(totalTiros > 0){
				let tiro = new Tiro(nave.x + nave.halfWidth(), nave.y)

				if(tiro.audio.paused) tiro.audio.play()

				tiros.push(tiro)
				totalTiros--
			}
		}

		// Verificando limites dos tiros

		for(let i in tiros){
			let tiro = tiros[i]

			if(tiro.y < 0){
				tiro.audio.remove()
				tiros.splice(i, 1)
			}
			else tiro.y -= tiro.vel
		}

		// Movimentando bomba

		for(let i in bombas){
			let bomba = bombas[i]

			if((bomba.y + bomba.heightTela) >= cnv.height){
				geraExplosao(bomba.x, cnv.height, 2)

				bombas.splice(i, 1)

				life -= TIRAVIDAIMPACTO

				if(life <= 0){
					game = false
					tipoMensagem = 1
				}
			}else{
				// bomba.vel += GRAVIDADE
				bomba.y += bomba.vel
			}
		}

		// Verificando colisão tiro com a bomba

		for(let t in tiros){
			let tiro = tiros[t]

			for(let b in bombas){
				let bomba = bombas[b]

				if(colisao(tiro, bomba)){
					geraExplosao(bomba.x, bomba.y, 1)

					tiros[t].audio.remove()
					tiros.splice(t, 1)
					bombas.splice(b, 1)

					score += PONTOSCORE
				}
			}
		}

		// Verificando colisão bomba nave

		for(let b in bombas){
			let bomba = bombas[b]

			if(colisao(nave, bomba)){
				nave.visible = false
				geraExplosao(nave.x, nave.y, 1)

				bombas.splice(b, 1)

				life = 0
				game = false
				tipoMensagem = 1
			}
		}

		// Animando a explosão

		for(let explosao of explosoes){
			setTimeout(function(){
				explosao.anima()
			}, TEMPOEXPLOSAO / 5)
		}
	}

	function draw(){
		ctx.clearRect(0, 0, cnv.width, cnv.height)
		ctx.drawImage(imgFundo, 0, 0, cnv.width, cnv.height)

		if(nave.visible)
			ctx.drawImage(nave.img, 0, 0, nave.width, nave.height, nave.x, nave.y, nave.widthTela, nave.heightTela)

		// Desenhando tiros

		for(let tiro of tiros){
			ctx.fillStyle = tiro.color

			ctx.fillRect(tiro.x, tiro.y, tiro.width, tiro.height)
		}

		// Desenhando bombas

		for(let bomba of bombas)
			ctx.drawImage(imgBomba, 0, 0, bomba.width, bomba.height, bomba.x, bomba.y, bomba.widthTela, bomba.heightTela)

		// Desenhando explosões

		for(let explosao of explosoes)
			ctx.drawImage(explosao.img, explosao.srcX, explosao.srcY, explosao.width, explosao.height, explosao.x, explosao.y, explosao.widthTela, explosao.heightTela)

		// Desenhando a barra de vida

		BARRAVIDA.style.width = `${life}%`
		SCOREPLACAR.innerText = score
		TIROSPLACAR.innerText = `${totalTiros}/${LIMITETIRO}`
	}

	function mostraMensagem(){
		ctx.clearRect(0, 0, cnv.width, cnv.height)
		ctx.drawImage(imgFundo, 0, 0, cnv.width, cnv.height)

		let widthBanner = 650
		let heightBanner = 200

		tiros = []
		bombas = []
		explosoes = []

		if(tipoMensagem == 0){
			ctx.drawImage(imgStart, cnv.width/2 - widthBanner/2, cnv.height/2 - heightBanner/2, widthBanner, heightBanner)
		}else if(tipoMensagem == 1){
			ctx.drawImage(imgGameOver, cnv.width/2 - widthBanner/2, cnv.height/2 - heightBanner/2, widthBanner, heightBanner)

			ctx.fillStyle = '#fff'
			ctx.font = '20px Arial'
			ctx.fillText(score, cnv.width/2 - ctx.measureText(score).width / 2, cnv.height/2 - heightBanner/2 + 155)
		}
	}

	// Funções de configurações de audio

	window.document.getElementById('volMusica').addEventListener('change', function(){
		if(musica !== null && musica !== undefined) musica.volume = event.target.value / 10
	})
	
	window.document.getElementById('volJogo').addEventListener('change', function(){
		for(let tiro of tiros) 
			if(tiro.audio) tiro.audio.volume = event.target.value / 10

		for(let explosao of explosoes) 
			if(explosao.audio) explosao.audio.volume = event.target.value / 10
	})
	
	function loop(){
		if(musica.paused && window.document.hasFocus()) musica.play() // Inicializando musica(OBS: Isso pode gerar algum erro em alguns navegadores)

		console.clear()

		if(game){
			geraBomba()
			update()
			draw()
		}else{
			setTimeout(mostraMensagem, TEMPOEXPLOSAO);
		}

		frames = window.requestAnimationFrame(loop)
	}
}())