import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss']
})
export class BlogPostsComponent implements OnInit {

  posts = [
    {img: 'https://cdn.eso.org/images/thumb300y/eso2008a.jpg' , createdAt : '23.06.2022' , title : 'Hervorgehobener Post' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: '' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: 'https://cdn.eso.org/images/thumb300y/eso2008a.jpg' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: 'https://cdn.eso.org/images/thumb300y/eso2008a.jpg' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: 'https://cdn.eso.org/images/thumb300y/eso2008a.jpg' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: 'https://cdn.eso.org/images/thumb300y/eso2008a.jpg' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
