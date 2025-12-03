import { Component, OnInit, OnDestroy, ViewEncapsulation, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import { RouterLink } from "@angular/router";

interface Project {
  id: number;
  title: string;
  location: string;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portfolio-list.html',
  styleUrls: ['./portfolio-list.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioList implements OnInit, OnDestroy {
  private swiper?: Swiper;
  showSectionLabel = input<boolean>(true);
  showDescriptions = input<boolean>(false);
  projects = input([
    {
      id: "9b2bd03e-1cd2-4e15-a117-f8abc5650fd2",
      "title": "Appartamento Cardito",
      "description": "Lorem ipsum dolor sit amet consectetur. Gravida at cursus non lobortis cras volutpat molestie. Nunc ornare nibh euismod senectus commodo nam at morbi. Pellentesque ullamcorper est nam pretium nunc. Ac turpis nunc tristique ut porttitor amet id venenatis lobortis. Cras pretium commodo leo nunc. Mauris posuere purus aenean quis lorem. Ac quam cursus viverra viverra interdum vel nullam orci at. Tincidunt aliquet donec feugiat purus mauris malesuada. Vel odio dolor habitasse nam at rutrum quam a morbi. Turpis sed eget neque iaculis dui. Pellentesque sem felis velit nibh leo quam. Egestas commodo sagittis pellentesque ipsum venenatis id id id. Facilisis facilisis sit dictum nibh dui aliquam. Convallis egestas rhoncus velit duis urna ut lacus. Consectetur metus cras nunc a est. Tellus purus non magna erat dolor sit orci.\n\n\nLuctus viverra nibh est nullam gravida egestas in senectus. Commodo ullamcorper laoreet pretium mauris. Nibh neque morbi dui elit semper. Duis tellus libero nunc vitae nisi. Eu sed lectus ut enim eu nibh. Integer sem massa dui orci eu viverra. Quam odio egestas sit arcu facilisi molestie amet egestas. Quisque maecenas ut cum a imperdiet volutpat amet. Sit et adipiscing curabitur etiam nibh mauris neque odio in. Ipsum imperdiet diam ornare risus nibh. Sed non mattis dolor feugiat. Molestie lacus massa in elit. Metus porttitor donec eu ut condimentum sed convallis augue eu. Diam cursus etiam quis faucibus vulputate mauris elit nec eu. Nunc eleifend massa eu aliquet enim varius nunc in convallis.",
      "createdAt": "2025-11-27T21:55:17.833985",
      "immagini": [
        {
          "id": "8b9cd91c-64d0-4054-a819-4d9c615f2a49",
          "url": "https://vgatubktsfzxdrhcxtqu.supabase.co/storage/v1/object/public/immagini_lavori/cardito_anna.jpeg",
          "created_at": "2025-11-27T21:55:56.251104+00:00",
          "ristrutturazione_id": "9b2bd03e-1cd2-4e15-a117-f8abc5650fd2"
        }
      ]
    },
    {
      id: "a581755e-928d-478a-85b6-f35f08244cce",
      "title": "Appartamento Genny e Anna",
      "description": "Lorem ipsum dolor sit amet consectetur. Gravida at cursus non lobortis cras volutpat molestie. Nunc ornare nibh euismod senectus commodo nam at morbi. Pellentesque ullamcorper est nam pretium nunc. Ac turpis nunc tristique ut porttitor amet id venenatis lobortis. Cras pretium commodo leo nunc. Mauris posuere purus aenean quis lorem. Ac quam cursus viverra viverra interdum vel nullam orci at. Tincidunt aliquet donec feugiat purus mauris malesuada. Vel odio dolor habitasse nam at rutrum quam a morbi. Turpis sed eget neque iaculis dui. Pellentesque sem felis velit nibh leo quam. Egestas commodo sagittis pellentesque ipsum venenatis id id id. Facilisis facilisis sit dictum nibh dui aliquam. Convallis egestas rhoncus velit duis urna ut lacus. Consectetur metus cras nunc a est. Tellus purus non magna erat dolor sit orci.\n\n\nLuctus viverra nibh est nullam gravida egestas in senectus. Commodo ullamcorper laoreet pretium mauris. Nibh neque morbi dui elit semper. Duis tellus libero nunc vitae nisi. Eu sed lectus ut enim eu nibh. Integer sem massa dui orci eu viverra. Quam odio egestas sit arcu facilisi molestie amet egestas. Quisque maecenas ut cum a imperdiet volutpat amet. Sit et adipiscing curabitur etiam nibh mauris neque odio in. Ipsum imperdiet diam ornare risus nibh. Sed non mattis dolor feugiat. Molestie lacus massa in elit. Metus porttitor donec eu ut condimentum sed convallis augue eu. Diam cursus etiam quis faucibus vulputate mauris elit nec eu. Nunc eleifend massa eu aliquet enim varius nunc in convallis.",
      "createdAt": "2025-09-24T21:23:49.014879",
      "immagini": [
        {
          "id": "4faac623-c474-42ee-9d53-b0d951410d1e",
          "url": "https://vgatubktsfzxdrhcxtqu.supabase.co/storage/v1/object/public/immagini_lavori/1758748838398.jpeg",
          "created_at": "2025-11-30T19:15:50.498085+00:00",
          "ristrutturazione_id": "a581755e-928d-478a-85b6-f35f08244cce"
        },
        {
          "id": "f95f91e7-aeaf-4612-9b10-7f23dabd00d8",
          "url": "https://vgatubktsfzxdrhcxtqu.supabase.co/storage/v1/object/public/immagini_lavori/anna_e_genny_bagno.jpeg",
          "created_at": "2025-12-02T22:00:48.327681+00:00",
          "ristrutturazione_id": "a581755e-928d-478a-85b6-f35f08244cce"
        },
        {
          "id": "0d734f1b-663d-47fd-8afd-59105d0bb6c1",
          "url": "https://vgatubktsfzxdrhcxtqu.supabase.co/storage/v1/object/public/immagini_lavori/anna_e_genny_cucina.jpeg",
          "created_at": "2025-12-02T22:01:07.440543+00:00",
          "ristrutturazione_id": "a581755e-928d-478a-85b6-f35f08244cce"
        }
      ]
    },
    {
      id: "8a4fe562-7dd6-4763-8df7-8603bb8d3a53",
      "title": "Appartamento Mariano",
      "description": "Lorem ipsum dolor sit amet consectetur. Gravida at cursus non lobortis cras volutpat molestie. Nunc ornare nibh euismod senectus commodo nam at morbi. Pellentesque ullamcorper est nam pretium nunc. Ac turpis nunc tristique ut porttitor amet id venenatis lobortis. Cras pretium commodo leo nunc. Mauris posuere purus aenean quis lorem. Ac quam cursus viverra viverra interdum vel nullam orci at. Tincidunt aliquet donec feugiat purus mauris malesuada. Vel odio dolor habitasse nam at rutrum quam a morbi. Turpis sed eget neque iaculis dui. Pellentesque sem felis velit nibh leo quam. Egestas commodo sagittis pellentesque ipsum venenatis id id id. Facilisis facilisis sit dictum nibh dui aliquam. Convallis egestas rhoncus velit duis urna ut lacus. Consectetur metus cras nunc a est. Tellus purus non magna erat dolor sit orci.\n\n\nLuctus viverra nibh est nullam gravida egestas in senectus. Commodo ullamcorper laoreet pretium mauris. Nibh neque morbi dui elit semper. Duis tellus libero nunc vitae nisi. Eu sed lectus ut enim eu nibh. Integer sem massa dui orci eu viverra. Quam odio egestas sit arcu facilisi molestie amet egestas. Quisque maecenas ut cum a imperdiet volutpat amet. Sit et adipiscing curabitur etiam nibh mauris neque odio in. Ipsum imperdiet diam ornare risus nibh. Sed non mattis dolor feugiat. Molestie lacus massa in elit. Metus porttitor donec eu ut condimentum sed convallis augue eu. Diam cursus etiam quis faucibus vulputate mauris elit nec eu. Nunc eleifend massa eu aliquet enim varius nunc in convallis.",
      "createdAt": "2025-09-24T21:20:38.314939",
      "immagini": [
        {
          "id": "9bfda9cc-fdb6-42bf-a1d7-57da9e270a8b",
          "url": "https://vgatubktsfzxdrhcxtqu.supabase.co/storage/v1/object/public/immagini_lavori/1758748838398.jpeg",
          "created_at": "2025-11-27T21:41:35.380383+00:00",
          "ristrutturazione_id": "8a4fe562-7dd6-4763-8df7-8603bb8d3a53"
        }
      ]
    }
  ]);

  ngOnInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 100);
  }

  initSwiper(): void {
    this.swiper = new Swiper('.portfolio-swiper', {
      modules: [Pagination],
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: false,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}