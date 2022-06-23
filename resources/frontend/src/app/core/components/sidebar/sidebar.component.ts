import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, Input, OnInit } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';

const dashboardIcon = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 12.5H23.5V10.5H16V12.5ZM24 13V23.5H26V13H24ZM23.5 24H16V26H23.5V24ZM15.5 23.5V13H13.5V23.5H15.5ZM2.5 2H8.5V0H2.5V2ZM9 2.5V13H11V2.5H9ZM8.5 13.5H2.5V15.5H8.5V13.5ZM2 13V2.5H0V13H2ZM2.5 13.5C2.22386 13.5 2 13.2761 2 13H0C0 14.3807 1.11929 15.5 2.5 15.5V13.5ZM9 13C9 13.2761 8.77614 13.5 8.5 13.5V15.5C9.88071 15.5 11 14.3807 11 13H9ZM8.5 2C8.77614 2 9 2.22386 9 2.5H11C11 1.11929 9.88071 0 8.5 0V2ZM2.5 0C1.11929 0 0 1.11929 0 2.5H2C2 2.22386 2.22386 2 2.5 2V0ZM2.5 20H8.5V18H2.5V20ZM9 20.5V23.5H11V20.5H9ZM8.5 24H2.5V26H8.5V24ZM2 23.5V20.5H0V23.5H2ZM2.5 24C2.22386 24 2 23.7761 2 23.5H0C0 24.8807 1.11929 26 2.5 26V24ZM9 23.5C9 23.7761 8.77614 24 8.5 24V26C9.88071 26 11 24.8807 11 23.5H9ZM8.5 20C8.77614 20 9 20.2239 9 20.5H11C11 19.1193 9.88071 18 8.5 18V20ZM2.5 18C1.11929 18 0 19.1193 0 20.5H2C2 20.2239 2.22386 20 2.5 20V18ZM16 2H23.5V0H16V2ZM24 2.5V5.5H26V2.5H24ZM23.5 6H16V8H23.5V6ZM15.5 5.5V2.5H13.5V5.5H15.5ZM16 6C15.7239 6 15.5 5.77614 15.5 5.5H13.5C13.5 6.88071 14.6193 8 16 8V6ZM24 5.5C24 5.77614 23.7761 6 23.5 6V8C24.8807 8 26 6.88071 26 5.5H24ZM23.5 2C23.7761 2 24 2.22386 24 2.5H26C26 1.11929 24.8807 0 23.5 0V2ZM16 0C14.6193 0 13.5 1.11929 13.5 2.5H15.5C15.5 2.22386 15.7239 2 16 2V0ZM16 24C15.7239 24 15.5 23.7761 15.5 23.5H13.5C13.5 24.8807 14.6193 26 16 26V24ZM24 23.5C24 23.7761 23.7761 24 23.5 24V26C24.8807 26 26 24.8807 26 23.5H24ZM23.5 12.5C23.7761 12.5 24 12.7239 24 13H26C26 11.6193 24.8807 10.5 23.5 10.5V12.5ZM16 10.5C14.6193 10.5 13.5 11.6193 13.5 13H15.5C15.5 12.7239 15.7239 12.5 16 12.5V10.5Z" fill="{{color: #FFF}}"/></svg>';
const profileIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.9696 17.5047L15.5225 18.3379L14.9696 17.5047ZM5.03036 17.5047L4.47747 18.3379L5.03036 17.5047ZM9 15H11V13H9V15ZM2 10C2 5.58172 5.58172 2 10 2V0C4.47715 0 0 4.47715 0 10H2ZM10 2C14.4183 2 18 5.58172 18 10H20C20 4.47715 15.5228 0 10 0V2ZM12 8C12 9.10457 11.1046 10 10 10V12C12.2091 12 14 10.2091 14 8H12ZM10 10C8.89543 10 8 9.10457 8 8H6C6 10.2091 7.79086 12 10 12V10ZM8 8C8 6.89543 8.89543 6 10 6V4C7.79086 4 6 5.79086 6 8H8ZM10 6C11.1046 6 12 6.89543 12 8H14C14 5.79086 12.2091 4 10 4V6ZM11 15C12.5303 15 13.7943 16.1467 13.9772 17.6273L15.9621 17.3821C15.657 14.9118 13.5525 13 11 13V15ZM18 10C18 12.7844 16.5784 15.2371 14.4167 16.6714L15.5225 18.3379C18.2189 16.5488 20 13.4826 20 10H18ZM14.4167 16.6714C13.1515 17.511 11.6344 18 10 18V20C12.0398 20 13.9397 19.3882 15.5225 18.3379L14.4167 16.6714ZM6.02282 17.6273C6.20567 16.1467 7.46968 15 9 15V13C6.44747 13 4.34299 14.9118 4.0379 17.3821L6.02282 17.6273ZM10 18C8.36561 18 6.84849 17.511 5.58326 16.6714L4.47747 18.3379C6.06034 19.3882 7.96025 20 10 20V18ZM5.58326 16.6714C3.42161 15.2371 2 12.7844 2 10H0C0 13.4826 1.78112 16.5488 4.47747 18.3379L5.58326 16.6714Z" fill="white"/></svg>';
const folderIcon = '<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13V3C1 1.89543 1.89543 1 3 1H7.58579C7.851 1 8.10536 1.10536 8.29289 1.29289L10 3H17C18.1046 3 19 3.89543 19 5V13C19 14.1046 18.1046 15 17 15H3C1.89543 15 1 14.1046 1 13Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const editIcon = '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1.99997H3C1.89543 1.99997 1 2.8954 1 3.99997V16C1 17.1045 1.89543 18 3 18H15C16.1046 18 17 17.1045 17 16V9.99997M15.4142 6.41417L16.5 5.32842C17.281 4.54737 17.281 3.28104 16.5 2.5C15.7189 1.71895 14.4526 1.71895 13.6715 2.50001L12.5858 3.58575M15.4142 6.41417L9.37795 12.4505C9.09875 12.7297 8.74315 12.9201 8.35596 12.9975L5.41422 13.5858L6.00257 10.6441C6.08001 10.2569 6.27032 9.90131 6.54951 9.62211L12.5858 3.58575M15.4142 6.41417L12.5858 3.58575" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const albumIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6C3 4.34315 4.34315 3 6 3H14C15.6569 3 17 4.34315 17 6V14C17 15.6569 15.6569 17 14 17H6C4.34315 17 3 15.6569 3 14V6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 7V18C21 19.6569 19.6569 21 18 21H7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 12.375L6.66789 8.70711C7.05842 8.31658 7.69158 8.31658 8.08211 8.70711L10.875 11.5M10.875 11.5L13.2304 9.1446C13.6209 8.75408 14.2541 8.75408 14.6446 9.14461L17 11.5M10.875 11.5L12.8438 13.4688" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const sendIcon = '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6.31372L0.744282 5.49561C0.417352 5.5978 0.182649 5.88482 0.147406 6.22553C0.112163 6.56624 0.283148 6.89522 0.58224 7.06216L1 6.31372ZM18 1L18.8155 1.26385C18.9141 0.959006 18.8345 0.624611 18.6091 0.396932C18.3837 0.169252 18.0501 0.0863045 17.7443 0.181891L18 1ZM12.5 18L11.7437 18.4034C11.9056 18.7069 12.2332 18.8842 12.5758 18.8538C12.9184 18.8234 13.2096 18.5911 13.3155 18.2638L12.5 18ZM1.25572 7.13183L18.2557 1.81811L17.7443 0.181891L0.744282 5.49561L1.25572 7.13183ZM17.1845 0.736154L11.6845 17.7362L13.3155 18.2638L18.8155 1.26385L17.1845 0.736154ZM13.2563 17.5966L9.2563 10.0966L7.7437 10.9034L11.7437 18.4034L13.2563 17.5966ZM8.91776 9.75155L1.41776 5.56527L0.58224 7.06216L8.08224 11.2484L8.91776 9.75155ZM9.10609 11.1061L18.6061 1.60609L17.3939 0.393908L7.89391 9.89391L9.10609 11.1061Z" fill="white"/></svg>';
const pencilIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7842 6.33731L6.72307 13.3986C6.51367 13.608 6.24697 13.7507 5.95658 13.8088L3.75028 14.25L4.19154 12.0437C4.24961 11.7533 4.39235 11.4867 4.60174 11.2773L11.6629 4.21599M13.7842 6.33731L14.8449 5.27665C15.1378 4.98376 15.1378 4.50888 14.8449 4.21599L13.7842 3.15533C13.4913 2.86244 13.0165 2.86244 12.7236 3.15533L11.6629 4.21599M13.7842 6.33731L11.6629 4.21599" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const imageIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.536 0.622478C15.536 0.278693 15.2573 0 14.9135 0C14.5698 0 14.2911 0.278693 14.2911 0.622478V2.46398H12.4496C12.1058 2.46398 11.8271 2.74267 11.8271 3.08646C11.8271 3.43024 12.1058 3.70893 12.4496 3.70893H14.2911V5.55043C14.2911 5.89422 14.5698 6.17291 14.9135 6.17291C15.2573 6.17291 15.536 5.89422 15.536 5.55043V3.70893H17.3775C17.7213 3.70893 18 3.43024 18 3.08646C18 2.74267 17.7213 2.46398 17.3775 2.46398H15.536V0.622478ZM3.58467 0.985591L3.61038 0.985591H9.4928C9.83658 0.985591 10.1153 1.26428 10.1153 1.60807C10.1153 1.95185 9.83658 2.23055 9.4928 2.23055H3.61038C3.07717 2.23055 2.71471 2.23103 2.43454 2.25392C2.16163 2.27622 2.02207 2.31663 1.92472 2.36624C1.69046 2.4856 1.50001 2.67605 1.38065 2.91031C1.33104 3.00766 1.29063 3.14722 1.26833 3.42013C1.24544 3.7003 1.24496 4.06276 1.24496 4.59597V11.9324L4.67011 8.50721C5.1563 8.02102 5.94456 8.02102 6.43075 8.50721L9.4928 11.5693L12.0621 9C12.5483 8.51381 13.3365 8.51382 13.8227 9L15.7695 10.9468V8.50721C15.7695 8.16342 16.0481 7.88473 16.3919 7.88473C16.7357 7.88473 17.0144 8.16342 17.0144 8.50721V14.3896V14.4154V14.4154C17.0144 14.9165 17.0144 15.33 16.9869 15.6668C16.9583 16.0167 16.897 16.3384 16.743 16.6405C16.5043 17.109 16.1234 17.4899 15.6549 17.7286C15.3528 17.8825 15.0311 17.9439 14.6813 17.9725C14.3444 18 13.9309 18 13.4298 18H13.4298H13.404H3.61038H3.58465H3.58458C3.08354 18 2.67002 18 2.33316 17.9725C1.98326 17.9439 1.66163 17.8825 1.35952 17.7286C0.89101 17.4899 0.510101 17.109 0.271385 16.6405C0.117452 16.3384 0.0560975 16.0167 0.0275101 15.6668C-1.42727e-05 15.33 -7.71618e-06 14.9164 2.70846e-07 14.4153L5.09265e-07 14.3896V4.59597L2.70846e-07 4.57026C-7.71618e-06 4.06918 -1.42727e-05 3.65563 0.0275101 3.31875C0.0560975 2.96885 0.117452 2.64722 0.271385 2.34511C0.510101 1.8766 0.89101 1.49569 1.35952 1.25698C1.66163 1.10304 1.98326 1.04169 2.33316 1.0131C2.67004 0.985576 3.08359 0.985583 3.58467 0.985591ZM1.24496 14.3896V13.693L5.55043 9.38752L9.05264 12.8897L11.2702 15.1073C11.5133 15.3504 11.9074 15.3504 12.1505 15.1073C12.3936 14.8642 12.3936 14.4701 12.1505 14.227L10.3731 12.4496L12.9424 9.88032L15.7695 12.7074V14.3896C15.7695 14.9228 15.769 15.2853 15.7461 15.5655C15.7238 15.8384 15.6834 15.9779 15.6338 16.0753C15.5144 16.3095 15.3239 16.5 15.0897 16.6194C14.9923 16.669 14.8528 16.7094 14.5799 16.7317C14.2997 16.7546 13.9372 16.755 13.404 16.755H3.61038C3.07717 16.755 2.71471 16.7546 2.43454 16.7317C2.16163 16.7094 2.02207 16.669 1.92472 16.6194C1.69046 16.5 1.50001 16.3095 1.38065 16.0753C1.33104 15.9779 1.29063 15.8384 1.26833 15.5655C1.24544 15.2853 1.24496 14.9228 1.24496 14.3896Z" fill="black"/></svg>';
const videoIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.89941 11.8271V7.88472L9.99699 9.8559L6.89941 11.8271Z" fill="black" stroke="black" stroke-width="1.97118" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.536 0.622478C15.536 0.278693 15.2573 0 14.9135 0C14.5698 0 14.2911 0.278693 14.2911 0.622478V2.46398H12.4496C12.1058 2.46398 11.8271 2.74267 11.8271 3.08646C11.8271 3.43024 12.1058 3.70893 12.4496 3.70893H14.2911V5.55043C14.2911 5.89422 14.5698 6.17291 14.9135 6.17291C15.2573 6.17291 15.536 5.89422 15.536 5.55043V3.70893H17.3775C17.7213 3.70893 18 3.43024 18 3.08646C18 2.74267 17.7213 2.46398 17.3775 2.46398H15.536V0.622478ZM3.61038 0.985591L3.58467 0.985591C3.08359 0.985583 2.67004 0.985576 2.33316 1.0131C1.98326 1.04169 1.66163 1.10304 1.35952 1.25698C0.89101 1.49569 0.510101 1.8766 0.271385 2.34511C0.117452 2.64722 0.0560975 2.96885 0.0275101 3.31875C-1.42727e-05 3.65563 -7.71618e-06 4.06918 2.70846e-07 4.57026L5.09265e-07 4.59597V14.3896L2.70846e-07 14.4153C-7.71618e-06 14.9164 -1.42727e-05 15.33 0.0275101 15.6668C0.0560975 16.0167 0.117452 16.3384 0.271385 16.6405C0.510101 17.109 0.89101 17.4899 1.35952 17.7286C1.66163 17.8825 1.98326 17.9439 2.33316 17.9725C2.67002 18 3.08354 18 3.58458 18H3.58465H3.61038H13.404H13.4298H13.4298C13.9309 18 14.3444 18 14.6813 17.9725C15.0311 17.9439 15.3528 17.8825 15.6549 17.7286C16.1234 17.4899 16.5043 17.109 16.743 16.6405C16.897 16.3384 16.9583 16.0167 16.9869 15.6668C17.0144 15.33 17.0144 14.9165 17.0144 14.4154V14.4154V14.3896V8.50721C17.0144 8.16342 16.7357 7.88473 16.3919 7.88473C16.0481 7.88473 15.7695 8.16342 15.7695 8.50721V14.3896C15.7695 14.9228 15.769 15.2853 15.7461 15.5655C15.7238 15.8384 15.6834 15.9779 15.6338 16.0753C15.5144 16.3095 15.3239 16.5 15.0897 16.6194C14.9923 16.669 14.8528 16.7094 14.5799 16.7317C14.2997 16.7546 13.9372 16.755 13.404 16.755H3.61038C3.07717 16.755 2.71471 16.7546 2.43454 16.7317C2.16163 16.7094 2.02207 16.669 1.92472 16.6194C1.69046 16.5 1.50001 16.3095 1.38065 16.0753C1.33104 15.9779 1.29063 15.8384 1.26833 15.5655C1.24544 15.2853 1.24496 14.9228 1.24496 14.3896V4.59597C1.24496 4.06276 1.24544 3.7003 1.26833 3.42013C1.29063 3.14722 1.33104 3.00766 1.38065 2.91031C1.50001 2.67605 1.69046 2.4856 1.92472 2.36624C2.02207 2.31663 2.16163 2.27622 2.43454 2.25392C2.71471 2.23103 3.07717 2.23055 3.61038 2.23055H9.4928C9.83658 2.23055 10.1153 1.95185 10.1153 1.60807C10.1153 1.26428 9.83658 0.985591 9.4928 0.985591H3.61038Z" fill="black"/></svg>';
const menuButtonIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 5H18V3H6V5ZM5 18V9H3V18H5ZM5 9V6H3V9H5ZM19 6V9H21V6H19ZM19 9V18H21V9H19ZM4 10H10V8H4V10ZM10 10H20V8H10V10ZM18 19H10V21H18V19ZM10 19H6V21H10V19ZM9 9V20H11V9H9ZM3 18C3 19.6569 4.34315 21 6 21V19C5.44772 19 5 18.5523 5 18H3ZM19 18C19 18.5523 18.5523 19 18 19V21C19.6569 21 21 19.6569 21 18H19ZM18 5C18.5523 5 19 5.44772 19 6H21C21 4.34315 19.6569 3 18 3V5ZM6 3C4.34315 3 3 4.34315 3 6H5C5 5.44772 5.44772 5 6 5V3Z" fill="black" fill-opacity="0.5"/></svg>';
const facebookIcon = '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7.5455C15 3.378 11.6425 0 7.5 0C3.3575 0 0 3.378 0 7.5455C0 11.3125 2.742 14.434 6.328 15V9.727H4.424V7.545H6.328V5.883C6.328 3.992 7.4475 2.947 9.161 2.947C9.981 2.947 10.84 3.0945 10.84 3.0945V4.9515H9.8935C8.962 4.9515 8.672 5.5335 8.672 6.1305V7.5455H10.752L10.4195 9.7265H8.672V15C12.258 14.434 15 11.3125 15 7.5455Z" fill="black" fill-opacity="0.3"/></svg>';
const instagramIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 2.25C7.1667 2.25 6.9372 2.25765 6.2172 2.2905C5.49855 2.32335 5.0076 2.43765 4.5783 2.6046C4.1283 2.7738 3.72015 3.0393 3.38265 3.3831C3.0394 3.72021 2.77374 4.12807 2.60415 4.5783C2.4381 5.0076 2.32335 5.499 2.2905 6.21765C2.2581 6.9372 2.25 7.16625 2.25 9C2.25 10.8337 2.25765 11.0628 2.2905 11.7828C2.32335 12.5014 2.43765 12.9924 2.6046 13.4217C2.7738 13.8717 3.0393 14.2798 3.3831 14.6173C3.72022 14.9606 4.12808 15.2263 4.5783 15.3958C5.0076 15.5623 5.49855 15.6766 6.2172 15.7095C6.9372 15.7423 7.1667 15.75 9 15.75C10.8333 15.75 11.0628 15.7423 11.7828 15.7095C12.5014 15.6766 12.9924 15.5623 13.4217 15.3954C13.8717 15.2262 14.2798 14.9607 14.6173 14.6169C14.9606 14.2798 15.2263 13.8719 15.3958 13.4217C15.5623 12.9924 15.6766 12.5014 15.7095 11.7828C15.7423 11.0628 15.75 10.8333 15.75 9C15.75 7.1667 15.7423 6.9372 15.7095 6.2172C15.6766 5.49855 15.5623 5.0076 15.3954 4.5783C15.2259 4.12788 14.9603 3.71984 14.6169 3.38265C14.2798 3.0394 13.8719 2.77374 13.4217 2.60415C12.9924 2.4381 12.501 2.32335 11.7824 2.2905C11.0628 2.2581 10.8337 2.25 9 2.25ZM9 3.46635C10.8022 3.46635 11.016 3.4731 11.7279 3.5055C12.3858 3.53565 12.7431 3.645 12.9811 3.73815C13.2961 3.8601 13.5211 4.0068 13.7574 4.2426C13.9936 4.47885 14.1399 4.70385 14.2619 5.01885C14.3546 5.2569 14.4643 5.6142 14.4945 6.2721C14.5269 6.984 14.5337 7.19775 14.5337 9C14.5337 10.8022 14.5269 11.016 14.4945 11.7279C14.4643 12.3858 14.355 12.7431 14.2619 12.9811C14.1538 13.2743 13.9814 13.5396 13.7574 13.7574C13.5396 13.9815 13.2744 14.1539 12.9811 14.2619C12.7431 14.3546 12.3858 14.4643 11.7279 14.4945C11.016 14.5269 10.8027 14.5337 9 14.5337C7.1973 14.5337 6.984 14.5269 6.2721 14.4945C5.6142 14.4643 5.2569 14.355 5.01885 14.2619C4.72565 14.1538 4.4604 13.9814 4.2426 13.7574C4.01858 13.5396 3.84621 13.2743 3.73815 12.9811C3.64545 12.7431 3.53565 12.3858 3.5055 11.7279C3.4731 11.016 3.46635 10.8022 3.46635 9C3.46635 7.19775 3.4731 6.984 3.5055 6.2721C3.53565 5.6142 3.645 5.2569 3.73815 5.01885C3.8601 4.70385 4.0068 4.47885 4.2426 4.2426C4.46037 4.01852 4.72563 3.84614 5.01885 3.73815C5.2569 3.64545 5.6142 3.53565 6.2721 3.5055C6.984 3.4731 7.19775 3.46635 9 3.46635V3.46635Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.99977 11.2523C8.704 11.2523 8.41113 11.1941 8.13787 11.0809C7.86462 10.9677 7.61633 10.8018 7.40719 10.5927C7.19805 10.3835 7.03215 10.1352 6.91897 9.86198C6.80578 9.58873 6.74752 9.29586 6.74752 9.00009C6.74752 8.70432 6.80578 8.41144 6.91897 8.13819C7.03215 7.86493 7.19805 7.61665 7.40719 7.4075C7.61633 7.19836 7.86462 7.03246 8.13787 6.91928C8.41113 6.80609 8.704 6.74784 8.99977 6.74784C9.59711 6.74784 10.17 6.98513 10.5924 7.4075C11.0147 7.82988 11.252 8.40275 11.252 9.00009C11.252 9.59742 11.0147 10.1703 10.5924 10.5927C10.17 11.015 9.59711 11.2523 8.99977 11.2523V11.2523ZM8.99977 5.53059C8.0796 5.53059 7.19712 5.89612 6.54647 6.54678C5.89581 7.19744 5.53027 8.07992 5.53027 9.00009C5.53027 9.92025 5.89581 10.8027 6.54647 11.4534C7.19712 12.1041 8.0796 12.4696 8.99977 12.4696C9.91994 12.4696 10.8024 12.1041 11.4531 11.4534C12.1037 10.8027 12.4693 9.92025 12.4693 9.00009C12.4693 8.07992 12.1037 7.19744 11.4531 6.54678C10.8024 5.89612 9.91994 5.53059 8.99977 5.53059V5.53059ZM13.4786 5.46759C13.4786 5.6851 13.3922 5.8937 13.2384 6.0475C13.0846 6.20131 12.876 6.28771 12.6585 6.28771C12.441 6.28771 12.2324 6.20131 12.0786 6.0475C11.9248 5.8937 11.8384 5.6851 11.8384 5.46759C11.8384 5.25008 11.9248 5.04147 12.0786 4.88767C12.2324 4.73387 12.441 4.64746 12.6585 4.64746C12.876 4.64746 13.0846 4.73387 13.2384 4.88767C13.3922 5.04147 13.4786 5.25008 13.4786 5.46759" fill="black"/></svg>';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
    @Input() isCollapsed: boolean | undefined;
    roles: any = null;

    constructor(
        private iconService: NzIconService,
        private jwtService: JwtHelperService) {
        // fetch('http://localhost:4200/assets/img/svgs/icons/dashboard.svg').then(response => response.text()).then(text => { console.log(text); this.dashboardIcon = text; });
        this.iconService.addIconLiteral('ng-zorro:dashboard', dashboardIcon);
        this.iconService.addIconLiteral('ng-zorro:profile', profileIcon);
        this.iconService.addIconLiteral('ng-zorro:folder', folderIcon);
        this.iconService.addIconLiteral('ng-zorro:edit', editIcon);
        this.iconService.addIconLiteral('ng-zorro:album', albumIcon);
        this.iconService.addIconLiteral('ng-zorro:send', sendIcon);
        this.iconService.addIconLiteral('ng-zorro:pencil', pencilIcon);
        this.iconService.addIconLiteral('ng-zorro:image', imageIcon);
        this.iconService.addIconLiteral('ng-zorro:video', videoIcon);
        this.iconService.addIconLiteral('ng-zorro:menuButton', menuButtonIcon);
        this.iconService.addIconLiteral('ng-zorro:facebook', facebookIcon);
        this.iconService.addIconLiteral('ng-zorro:instagram', instagramIcon);
    }

    ngOnInit(): void {
        this.roles = this.jwtService.decodeToken().data.roles;
        const sideNav = document.querySelector('.mod-sidebar')?.parentElement?.parentElement;
        const sideNavMenu = document.querySelector('.mod-sidebar');
        sideNav?.addEventListener('mouseover', this.openSidenav);
        sideNav?.addEventListener('mouseleave', this.closeSidenav);
        sideNavMenu?.addEventListener('click', this.toggleActiveItem);
    }

    checkRole(role: any): void {
        return this.roles.includes(role);
    }

    openSidenav() {
        let modMenu = document.querySelector('.mod-sidebar');
        let menu = document.querySelector('.mod-sidebar')?.parentElement?.parentElement?.parentElement;
        menu?.classList.add('is-active');
        modMenu?.classList.add('is-active');
    }

    closeSidenav() {
        let modMenu = document.querySelector('.mod-sidebar');
        let menu = document.querySelector('.mod-sidebar')?.parentElement?.parentElement?.parentElement;
        setTimeout(() => {
            menu?.classList.remove('is-active');
            modMenu?.classList.remove('is-active');
        }, 1500);
    }

    toggleActiveItem(event: any) {
        window.clearTimeout();
        if (event.target.classList.contains('m-label')) {
            const links = document.querySelectorAll('.m-label');
            links.forEach((link: any) => {
                link.parentElement.children[0].classList.remove('is-selected');
                link.classList.remove('is-selected');
            });
            event.target.parentElement.children[0].classList.add('is-selected');
            event.target.classList.add('is-selected');
        }
    }

}
