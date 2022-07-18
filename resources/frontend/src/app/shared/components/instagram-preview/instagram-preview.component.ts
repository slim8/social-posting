import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { Mention } from 'ng-zorro-antd/mention';

@Component({
    selector: 'app-instagram-preview',
    templateUrl: './instagram-preview.component.html',
    styleUrls: ['./instagram-preview.component.scss']
})
export class InstagramPreviewComponent implements  OnInit, OnChanges {
    //preview images variable
    @Input() mediaList: any[] = [];
    @Input() message: string = "";
    @Output() newItemEvent = new EventEmitter<any[]>();
    mentions: any = [];
    isliked: boolean = false;

    //tags variables.
    displaMentions: boolean = false;
    taggedImage: any;
    imageWidth = 0;
    imageHeight = 0;
    posX = 0;
    posY = 0;
    inputValue2 = '';
    mentionIndex = 0;
    suggestions = [
        'Ali_werghemmi',
        'z.i.e.d.m',
        'oussemakassis',
        'amalrk',
        '中文',
        'にほんご',
    ];

    // carousel slider variables
    slideNbr = 0;
    nbrSlides: any = 1;

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
    /**
     *  empty mentions because when adding new media to preview,
     *  the html get reset, mentions can't be visible anymore but
     *  the mentions object still have the data, so we'll have to
     *  empty it to avoid compromises and duplicates.
     */

      this.mentions = [];
      document.addEventListener('click', this.resetPostView);
      if(changes['mediaList']) {
        this.nbrSlides = changes['mediaList'].currentValue.length;
        this.mediaList = changes['mediaList'].currentValue;
      }
      setTimeout(() => {
        this.refreshDots();
        this.initCarouselDots();
        this.initCarouselNextButton();
      }, 200);
    }

    ngOnInit(): void {
      setTimeout(() => {
        this.initCarousel();
      }, 202);
    }

    initCarouselDots() {
      this.nbrSlides = 0;
      let carouselDotsContainer = document.getElementById("dots") as any;
      setTimeout(() => {
        this.nbrSlides = document.querySelectorAll("[data-slides] > li > img")?.length;
        for (let i = 0; i < this.nbrSlides; i++) {
          let dotElem = document.createElement("li");
          let dotImg = document.createElement("img");
          dotElem.setAttribute("style", "filter: opacity(0.3);");
          dotImg.setAttribute("src", "../../../../assets/img/svgs/dot.svg");
          dotImg.setAttribute("alt", "#dot" + i);
          dotImg.setAttribute("style", "width: 7px;");
          dotElem.appendChild(dotImg);
          carouselDotsContainer?.appendChild(dotElem);
        }
      }, 50);
    }

    initCarousel() {
      let offset = 0;
      let dots = document.querySelectorAll('.m-dots li');
      this.nbrSlides = document.querySelectorAll("[data-slides] > li > img")?.length;
      let carouselWidth = 360 * this.nbrSlides;
      let carousel = document.getElementById("data-slides");
      let prev = document.getElementById("prev");
      let next = document.getElementById("next");
      if (dots.length == 1) {
        dots[0].setAttribute("style", "display:none;");
      } else if (dots.length > 1) {
        dots[0].setAttribute("style", "display:block;filter: opacity(1);");
      }

      if (this.nbrSlides == 1 || this.nbrSlides == 0) {
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
      this.initCarouselNextButton();
      buttons.forEach((button: any) => {
        button.addEventListener("click", () => {
          if (prev != null) {
            prev.style.display = "block";
          }

          if (prev != null) {
            prev.style.display = "block";
          }
          if (next != null) {
            next.style.display = "block";
          }
          const stride = button.dataset.carouselButton === 'next' ? 1 : -1;
          const offsetStride = button.dataset.carouselButton === 'next' ? -360 : 360;
          offset += offsetStride;

          if (carousel != null) {
            carousel.style.transform = "translateX(" + offset + "px)";
          }
          const slides = button.closest("[data-carousel]").querySelectorAll("[data-slides]>li>img");
          this.slideNbr += stride;

          if (this.slideNbr < 1) {
            if (prev != null) {
              prev.style.display = "none";

            }
            if (next != null && this.nbrSlides > 1) {
              next.style.display = "block";
            }
          }
          else if ((this.slideNbr + 1) == slides.length) {
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
          } else if (dots.length > 1) {
            dots[0].setAttribute("style", "display:block;");
          }

          document.querySelectorAll('.m-dots li').forEach((dot: any) => {
            dot.setAttribute("style", "filter: opacity(0.3);");
          })

          let activeDot = document.querySelector('.m-dots li:nth-child(' + (this.slideNbr + 1) + ')');
          if (activeDot != null) {
            activeDot.setAttribute("style", "filter: opacity(1);");
          }
        })
      })
    }

    // after adding new image to carousel
    initCarouselNextButton() {
        this.nbrSlides = document.querySelectorAll("[data-slides] > li > img")?.length;
        let next = document.getElementById("next");
        if (this.nbrSlides >=2 && this.nbrSlides > this.slideNbr) {
            // next is possibly null (can't use next?.style in this case so i had to use if not null)
            if (next != null) {
              next.style.display = "block";
            }
        }
    }

    refreshDots() {
      let carouselDotsContainer = document.getElementById("dots") as HTMLElement;
      carouselDotsContainer.innerHTML = "";
    }

    onSelect() {
        this.mentionIndex=this.mentions.length;
        let tooltip = document.createElement('div');
        tooltip.setAttribute('data-index', this.mentionIndex.toString());
        tooltip.setAttribute('class', 'mentioned');
        let close = document.createElement('div');
        let imagetop = this.posY;
        let imageleft = this.posX;
        let mention = {
          id: 0,
          image: 0,
          username: '',
          x: 0,
          y: 0,
        };
        mention.username = this.inputValue2;
        mention.id = this.mentionIndex;
        mention.x = Math.round((this.posX / this.imageWidth) * 100) / 100;
        mention.y = Math.round((this.posY / this.imageHeight) * 100) / 100;
        mention.image = this.slideNbr;
        this.mentions.push(mention);
        this.passToParentComponent(this.mentions);

        close.classList.add('m-close');
        close.innerHTML = 'x';
        close?.setAttribute('style', 'border-radius: 50%; background-color: black; filter: invert(1); width: 12px; height: 12px; margin: 0 4px 0 10px;');
        tooltip.innerHTML = this.inputValue2;
        this.taggedImage?.appendChild(tooltip);
        tooltip.appendChild(close);
        tooltip?.setAttribute(
            'style',
            'top: ' +
            this.posY +
            'px;left: ' +
            this.posX +
            'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
        );

        // add function remove mention
        let mentioned = document.querySelectorAll('.mentioned');
        mentioned.forEach((elem:any)=>{
          let that = this;
          elem.children[0].addEventListener('click', function(){ that.removeMention(elem) });
        })

        let tooltipwidth = tooltip.offsetWidth;
        let tooltipheight = tooltip.offsetHeight;

        //check left + bottom offset
        if (
            this.posX - tooltipwidth / 2 < 0 &&
            this.posY + tooltipheight > this.imageHeight
        ) {
            imageleft += tooltipwidth / 2 - this.posX;
            imagetop -= imagetop - this.imageHeight + tooltipheight;
            tooltip?.setAttribute(
                'style',
                'top: ' +
                imagetop +
                'px;left: ' +
                imageleft +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        //check right + bottom offset
        else if (
            this.posX + tooltipwidth / 2 > this.imageWidth &&
            this.posY + tooltipheight > this.imageHeight
        ) {
            imageleft -= tooltipwidth / 2 + (this.posX - this.imageWidth);
            imagetop -= imagetop - this.imageHeight + tooltipheight;
            tooltip?.setAttribute(
                'style',
                'top: ' +
                imagetop +
                'px;left: ' +
                imageleft +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        //check left offset
        else if (this.posX - tooltipwidth / 2 < 0) {
            imageleft += tooltipwidth / 2 - this.posX;
            tooltip?.setAttribute(
                'style',
                'top: ' +
                this.posY +
                'px;left: ' +
                imageleft +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        //check bottom offset
        else if (this.posY + tooltipheight > this.imageHeight) {
            imagetop -= imagetop - this.imageHeight + tooltipheight;
            tooltip?.setAttribute(
                'style',
                'top: ' +
                imagetop +
                'px;left: ' +
                this.posX +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        //check right offset
        else if (this.posX + tooltipwidth / 2 > this.imageWidth) {
            imageleft -= tooltipwidth / 2 + (this.posX - this.imageWidth);
            tooltip?.setAttribute(
                'style',
                'top: ' +
                this.posY +
                'px;left: ' +
                imageleft +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        this.mentionIndex++;
    }

    viewMentions() {
        this.displaMentions = !this.displaMentions;
        let mentions = Array.from(document.getElementsByClassName('mentioned'));
        mentions.forEach((element: any) => {
            if (this.displaMentions) {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.display = 'none!important';
                }, 300);
            }
            if (!this.displaMentions) {
                element.style.display = 'block!important';
                element.style.opacity = '0.3';
            }
        });
    }

    tag(event: any) {
        this.taggedImage = event.target.closest('li');
        this.imageHeight = event.target.clientHeight;
        this.imageWidth = event.target.clientWidth;
        this.inputValue2 = '';
        let post = event.target;
        let input = document.getElementsByClassName(
            'm-input-tag'
        )[0] as HTMLElement;
        let tooltip = document.getElementById('tooltip') as HTMLElement;
        this.posX = event.offsetX;
        this.posY = event.offsetY + 20;

        input?.classList.add('is-shown');
        tooltip?.classList.add('is-shown');
        tooltip?.setAttribute(
            'style',
            'top: ' + this.posY + 'px;left: ' + this.posX + 'px;'
        );
        post?.setAttribute('style', 'filter: brightness(0.5);');
        input.focus();
    }

    resetPostView(e: any) {
        let instaPost = document.getElementById('carousel') as HTMLElement;
        let tagPerson = document.getElementById('tagPerson') as HTMLElement;
        let Slides = document.getElementById('data-slides') as HTMLElement;
        let images: any[] = [];
        if (Slides != null) { images = Array.from(Slides?.children) };
        let input = document.getElementsByClassName('m-input-tag')[0] as HTMLElement;
        let tagOption = document.getElementsByClassName('tag-option');
        let tooltip = document.getElementById('tooltip') as HTMLElement;

        if (
            !e.composedPath()?.includes(instaPost) &&
            !e.composedPath()?.includes(tagPerson) &&
            !e.composedPath()?.includes(tagOption) &&
            !e.composedPath()?.includes(tooltip)
        ) {
            input?.classList.remove('is-shown');
            tooltip?.classList.remove('is-shown');
            images?.forEach(element => {
                element?.children[0]?.setAttribute('style', 'filter: brightness(1);')
            });
        }
    }

    passToParentComponent(value: any[]) {
      this.newItemEvent.emit(value);
    }

    liked(event: any) {
      event.target.classList.toggle('like');
      event.target.classList.toggle('is-liked');
      this.isliked = !this.isliked;
    }

    removeMention(elem:HTMLDivElement) {
      let index = elem.dataset['index'];
      elem.remove();
      this.mentions = this.mentions.filter((r:any) => r.id!=index);
    }

    // mentions on change
    onChange(e:any) {
      //todo
    }
}
