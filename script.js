var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    setTimeout(() => {
        this.tick();
    }, 2500); // Delay in milliseconds

    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 100 - Math.random() * 50;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = 500; // or 300 for faster delete start
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};




// clean refreshing for hyperlinks

window.addEventListener('load', () => {
    if (window.location.hash) {
        // Remove the hash from URL without reloading the page
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
});



const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const slideCount = dots.length;

let index = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let autoSlideInterval;

function showSlide(i) {
    index = (i + slideCount) % slideCount;
    slides.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
}

function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => showSlide(index + 1), 3000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

slides.addEventListener('mousedown', (e) => {
    stopAutoSlide();
    isDragging = true;
    startX = e.clientX;
    slides.style.cursor = 'grabbing';
});

slides.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const moveX = currentX - startX;
    slides.style.transform = `translateX(calc(-${index * 100}% + ${moveX}px))`;
});

slides.addEventListener('mouseup', (e) => {
    isDragging = false;
    slides.style.cursor = 'grab';
    const moveX = currentX - startX;
    if (moveX > 50) {
        showSlide(index - 1);
    } else if (moveX < -50) {
        showSlide(index + 1);
    } else {
        showSlide(index);
    }
    startAutoSlide();
});

slides.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        slides.style.cursor = 'grab';
        showSlide(index);
        startAutoSlide();
    }
});

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(parseInt(dot.dataset.index));
        startAutoSlide();
    });
});

startAutoSlide();
