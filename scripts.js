var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

function Complex(re, im) {
    this.re = re;
    this.im = im;
}

Complex.prototype.add = function(other) {
    return new Complex(this.re + other.re, this.im + other.im);
}

Complex.prototype.mul = function(other) {
    return new Complex(this.re * other.re - this.im * other.im, this.re * other.im + this.im * other.re);
}

Complex.prototype.abs = function() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
}

function hexToRgb(hex) {
    hex = hex.slice(1);
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function belongs(re, im, juliaC, iterations) {
    var z = new Complex(re,im);
    for (let k = 0; k < iterations; k++) {
        z = z.mul(z).add(juliaC);
        if (z.abs() > 2) return k/iterations;
    }
    return -1;
}

function defineFillStyle(baseColor, style, be) {
    switch (style) {
        case 0:
            if (be === -1) {
                return 'white';
            } else {
                return `rgb(${be*baseColor.r},${be*baseColor.g},${be*baseColor.b}`;
            }
        case 1:
            if (be === -1) {
                return 'white';
            } else {
                const invertColor = {r: 255 - baseColor.r, g: 255 - baseColor.g, b: 255 - baseColor.b}
                return `rgb(${-(be*(invertColor.r))+255},${-(be*invertColor.g)+255},${-(be*invertColor.b)+255})`;
            }
        case 2:
            if (be === -1) {
                return 'black';
            } else {
                return `rgb(${be*baseColor.r},${be*baseColor.g},${be*baseColor.b}`;
            }
        case 3:
            if (be === -1) {
                return 'black';
            } else {
                const invertColor = {r: 255 - baseColor.r, g: 255 - baseColor.g, b: 255 - baseColor.b}
                return `rgb(${-(be*(invertColor.r))+255},${-(be*invertColor.g)+255},${-(be*invertColor.b)+255})`;
            }
        default:
            return 'black';
    }
}

function draw(juliaC, iterations, baseColor, colorScheme) {
    for (let i = 0; i < window.innerWidth; i++) {
        for (let j = 0; j < window.innerHeight; j++) {
            var be = belongs((2*i/window.innerWidth) - 1,(2*j/window.innerHeight) - 1, juliaC, iterations);
            
            c.fillStyle = defineFillStyle(baseColor, colorScheme, be);

            c.fillRect(i,j,1,1);
        }
    }
}

//var initJuliaC = new Complex(-0.8, 0.156);
//var initJuliaC = new Complex(-0.735, 0.2);
var initJuliaC = new Complex(0.3, 0.02);
//var initJuliaC = new Complex(0.394, 0.232);

var initColor = {r: 100, g: 200, b: 255}

draw(initJuliaC, 100, initColor, 0);

document
    .getElementById('hide')
    .addEventListener('click', ()=> {
        document.getElementById('settings').style.display = 'none';
    })

document
    .getElementById('generate')
    .addEventListener('click', ()=> {
        const re = parseFloat(document.getElementById('re-value').value);
        const im = parseFloat(document.getElementById('im-value').value);
        const iterations = parseInt(document.getElementById('iterations').value, 10);
        const baseColor = document.getElementById('color-picker').value;
        const colorScheme = parseInt(document.getElementById('select-color').value, 10);

        const juliaC = new Complex(re,im);

        draw(juliaC, iterations, hexToRgb(baseColor), colorScheme);
    })
