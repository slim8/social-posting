import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss']
})
export class BlogPostsComponent implements OnInit {

  posts = [
    {img: 'https://assets.keap.com/image/upload/b_rgb:FFFFFF,c_limit,dpr_1,f_auto,h_395,q_95,w_569/v1/learn/images/Zz1lOTI0YzgzNzI0NDI1NDljMzRiZWVjOTI1ODk4OTZmNg==.jpg' , createdAt : '23.06.2022' , title : 'Hervorgehobener Post' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: '' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: 'https://assets.keap.com/image/upload/b_rgb:FFFFFF,c_limit,dpr_1,f_auto,h_395,q_95,w_569/v1/learn/images/Zz1lOTI0YzgzNzI0NDI1NDljMzRiZWVjOTI1ODk4OTZmNg==.jpg' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: 'https://assets.keap.com/image/upload/b_rgb:FFFFFF,c_limit,dpr_1,f_auto,h_395,q_95,w_569/v1/learn/images/Zz1lOTI0YzgzNzI0NDI1NDljMzRiZWVjOTI1ODk4OTZmNg==.jpg' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: '' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
    {img: 'https://assets.keap.com/image/upload/b_rgb:FFFFFF,c_limit,dpr_1,f_auto,h_395,q_95,w_569/v1/learn/images/Zz1lOTI0YzgzNzI0NDI1NDljMzRiZWVjOTI1ODk4OTZmNg==.jpg' , createdAt : '23.06.2022' , title : 'Gleichzeitig posten' ,teaser : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
