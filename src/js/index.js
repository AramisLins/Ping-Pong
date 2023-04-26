
const canvasE1 = document.querySelector("canvas")
const canvasCtx = canvasE1.getContext("2d")
const lineWidth = 15
const gapX = 10
const mouse = { x: 0, y: 0 }

const campo = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        //desenho do campo
        canvasCtx.fillStyle = "#286047"
        canvasCtx.fillRect(0, 0, this.w, this.h)
    }
}
const linhaCentral = {
    w: 15,
    h: campo.h,
    draw: function () {
        // desenho da linha central
        canvasCtx.fillStyle = "#ffffff"
        const x = window.innerWidth / 2 - lineWidth / 2 // ponto do inicio x
        const y = 0 // ponto do inicio y
        const w = lineWidth // tamanho da largura da linha
        const h = window.innerHeight // tamanho da altura da linha
        canvasCtx.fillRect(x, y, w, h)
    }
}

const raqueteEsquerda = {
    x: gapX,
    y: 0,
    w: linhaCentral.w,
    h: 200,
    _mover: function () {
        this.y = mouse.y - this.h / 2
    },
    draw: function () {
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._mover()
    }
}

const raqueteDireita = {
    x: campo.w - linhaCentral.w - gapX,
    y: 0,
    w: linhaCentral.w,
    h: 200,
    speed: 1,
    _mover: function () {
       if(this.y + this.h / 2 < bola.y + bola.r){
        this.y += this.speed
       }else{
        this.y -= this.speed
       }
        
    },
    speedUp: function (){
        this.speed += 1
    },
    draw: function () {
        //desenho da raquete direita
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._mover()
    }

}
const placar = {
    humano: 0,
    computador: 0,
    incrementarHumano: function () {
        this.humano++
    },
    incrementarComputador: function () {
        this.computador++
    },
    draw: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = 'center'
        canvasCtx.textBaseline = 'top'
        canvasCtx.fillStyle = '#01341D'
        canvasCtx.fillText(this.humano, campo.w / 4, 50)
        canvasCtx.fillText(this.computador, campo.w / 4 + campo.w / 2, 50)
    }
}
const bola = {
    x: 0,
    y: 0,
    r: 20,
    velocidade: 5,
    direcaoX: 1,
    direcaoY: 1,

    _calculoPosicao: function () {
        //verifica se o jogador 1 fez um ponto
        if (this.x > campo.w - this.r - raqueteDireita.w - gapX){
            if(this.y + this.r > raqueteDireita.y && this.y - this.r < raqueteDireita.y + raqueteDireita.h){
                this._reversoX()
            } else{
                placar.incrementarHumano()
                this._pontoFeito()
            }
        }
        // verificando se o jogador 2 (maquina) fez ponto
        if(this.x < this.r + raqueteEsquerda.w + gapX){
            if(this.y + this.r > raqueteEsquerda.y && this.y - this.r <raqueteEsquerda.y + raqueteEsquerda.h){
                this._reversoX()
            } else {
                placar.incrementarComputador()
                this._pontoFeito()
            }
        }
        //verifica as laterais superior e inferior do campo
        if ((this.y - this.r < 0 && this.direcaoY < 0) || (this.y > campo.h - this.r && this.direcaoY > 0) ){
            //rebate a bola invertendo o eixo Y
            this._reversoY()
        } 
    },
    _reversoX: function () {
        this.direcaoX = this.direcaoX * -1
    },
    _reversoY: function () {
        this.direcaoY = this.direcaoY * -1
    },
    _velocidadedaBola: function(){
        this.velocidade +=2
    },
    _pontoFeito: function(){
        this._velocidadedaBola()
        raqueteDireita.speedUp()
        this.x = campo.w / 2
        this.y = campo.h / 2

    },
    _mover: function () {
        this.x += this.direcaoX * this.velocidade
        this.y += this.direcaoY * this.velocidade
    },
    draw: function () {
        canvasCtx.fillStyle = "#fff"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calculoPosicao()
        this._mover()
    }
}
function setup() {
    canvasE1.width = canvasCtx.width = campo.w
    canvasE1.height = canvasCtx.height = campo.h
}

function draw() {
    campo.draw()
    linhaCentral.draw()
    raqueteEsquerda.draw()
    raqueteDireita.draw()
    placar.draw()
    bola.draw()
}




//suavizando a animação da bolinha
window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup()
main()
canvasE1.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
    
})
