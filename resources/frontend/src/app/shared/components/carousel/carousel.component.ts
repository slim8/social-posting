import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
        let offset = 0;
        let slideNbr = 0;
        let nbrSlides: any = 1;
        let dots = document.querySelectorAll('.m-dots li');
        nbrSlides = document.querySelector("[data-slides]")?.children.length;
        let carouselWidth = 360 * nbrSlides;
        let carousel = document.getElementById("data-slides");
        let prev = document.getElementById("prev");
        let next = document.getElementById("next");
        if (dots.length == 1) {
            dots[0].setAttribute("style", "display:none;");
        } else {
            dots[0].setAttribute("style", "display:block;filter: opacity(1);");
        }
        if (nbrSlides == 1) {
            if (next != null) {
                next.style.display = "none";
            }
            if (prev != null) {
                prev.style.display = "none";
            }
        }

        if (prev != null) {
            prev.style.display = "none";
        }
        if (carousel != null) {
            carousel.style.width = carouselWidth + "px";
        }
        const buttons = document.querySelectorAll("[data-carousel-button]");
        buttons.forEach((button: any) => {
            button.addEventListener("click", () => {
                if (prev != null) {
                    prev.style.display = "block";
                }
                const stride = button.dataset.carouselButton === 'next' ? 1 : -1;
                const offsetStride = button.dataset.carouselButton === 'next' ? -360 : 360;
                offset += offsetStride;

                if (carousel != null) {
                    carousel.style.transform = "translateX(" + offset + "px)";
                }
                const slides = button.closest("[data-carousel]").querySelector("[data-slides]");
                slideNbr += stride
                if (slideNbr < 1) {
                    if (prev != null) {
                        prev.style.display = "none";
                    }
                    if (next != null) {
                        next.style.display = "block";
                    }
                }

                else if ((slideNbr + 1) == slides.children.length) {
                    if (next != null) {
                        next.style.display = "none";
                    }
                } else {
                    if (next != null) {
                        next.style.display = "block";
                    }
                    if (prev != null) {
                        prev.style.display = "block";
                    }
                }

                if (dots.length == 1) {
                    dots[0].setAttribute("style", "display:none;");
                } else {
                    dots[0].setAttribute("style", "display:block;");
                }

                document.querySelectorAll('.m-dots li').forEach((dot: any) => {
                    dot.setAttribute("style", "filter: opacity(0.3);");
                })

                let activeDot = document.querySelector('.m-dots li:nth-child(' + (slideNbr + 1) + ')');
                if (activeDot != null) {
                    activeDot.setAttribute("style", "filter: opacity(1);");
                }
            })
        })
    }

}
