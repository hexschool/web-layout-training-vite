import axios from 'axios';

import { sweetalert2, formattedNumber } from './main.js';

const api_path = "yinmin";
const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer";


// Scrollspy
document.addEventListener('DOMContentLoaded', function () {
  const ele = document.querySelector('.recommendation-wall');
  ele.style.cursor = 'grab';
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  const mouseDownHandler = function (e) {
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';

    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };
  const mouseUpHandler = function () {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };
  // Attach the handler
  ele.addEventListener('mousedown', mouseDownHandler);
});

// GET 取得商品列表
let products = [];

function getProduct() {
  axios.get(`${baseUrl}/${api_path}/products`)
    .then(function (response) {
      products = response.data.products;
      renderProducts();
    })
    .then(function () {
      const addCardBtn = document.querySelectorAll('.addCardBtn');

      // 拿到每一個 card 的 按鈕 DOM
      addCardBtn.forEach((item) => {
        item.addEventListener('click', addtoCart);
      })
    })
    .catch(function () {
      sweetalert2("取得商品失敗");
    });
}


// 呈現卡片在畫面上
function renderProducts() {
  const productWrap = document.querySelector('.productWrap');
  let str = '';

  products.forEach(function (item) {
    str += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${item.images}"
      alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${formattedNumber(item.origin_price)}</del>
    <p class="nowPrice">NT$${formattedNumber(item.price)}</p>
  </li>`
  })
  productWrap.innerHTML = str;
};


// GET 取得購物車列表
let cartData = [];

function getCart() {
  axios.get(`${baseUrl}/${api_path}/carts`)
    .then(function (response) {
      cartData = response.data;
      renderCart();
    })
    .then(function () {
      // 取得每個品項的移除按鈕 DOM
      const discardBtn = document.querySelectorAll('.discardBtn a');
      discardBtn.forEach(function (item) {
        item.addEventListener('click', removeCartItem);
      })
    })
    .catch(function () {
      sweetalert2("取得購物車失敗");
    })
}

// 呈現購物車列表在畫面上
function renderCart() {
  const shoppingCart = document.querySelector('.shoppingCart-tbody');
  const total = document.querySelector('.total');
  let str = '';

  cartData.carts.forEach(function (item) {
    str += `<tr><td>
    <div class="cardItem-title">
      <img src="${item.product.images}" alt="">
      <p>${item.product.title}</p>
    </div>
  </td>
  <td>NT$ ${formattedNumber(item.product.price)}</td>
  <td> ${item.quantity} </td>
  <td>NT$ ${formattedNumber(item.product.price * item.quantity)}</td>
  <td class="discardBtn">
    <a href="#" class="material-icons" data-id="${item.id}">
      clear
    </a>
  </td></tr> `
  });
  shoppingCart.innerHTML = str;

  total.textContent = `NT$ ${formattedNumber(cartData.finalTotal)}`
}

// POST 加入購物車
function addtoCart(e) {
  e.preventDefault();
  const url = `${baseUrl}/${api_path}/carts`;
  const id = e.target.dataset.id;
  let num = 1;

  cartData.carts.forEach(function (item) {
    if (item.product.id === id) {
      num = item.quantity += 1
    }
  })

  const data = {
    data: {
      productId: id,
      quantity: num
    }
  };
  
  axios.post(url, data)
    .then(function () {
      getCart();
    })
    .catch(function (error) {
      sweetalert2(error.response.data.message);
    });
}

// DELETE 清空購物車
const discardAllBtn = document.querySelector('.discardAllBtn');

function removeCartAll(e) {
  e.preventDefault();
  axios.delete(`${baseUrl}/${api_path}/carts`)
    .then(function () {
      getCart();
    })
    .catch(function (error) {
      sweetalert2(error.response.data.message);
    });
}

discardAllBtn.addEventListener('click', removeCartAll);


// DELETE 刪除單筆項目
function removeCartItem(e) {
  e.preventDefault();
  const id = e.target.dataset.id;

  axios.delete(`${baseUrl}/${api_path}/carts/${id}`)
    .then(function () {
      getCart();
    })
    .catch(function (error) {
      sweetalert2(error.response.data.message);
    });
}

// POST 送出訂單
const orderInfoBtn = document.querySelector('.orderInfo-btn');

function addOrder(e) {
  e.preventDefault();
  const customerName = document.querySelector('#customerName');
  const customerPhone = document.querySelector('#customerPhone');
  const customerEmail = document.querySelector('#customerEmail');
  const customerAddress = document.querySelector('#customerAddress');
  const orderInfoInput = document.querySelector('.orderInfo-input');
  const orderInfoForm = document.querySelector('.orderInfo-form');

  const data = {
    data: {
      user: {
        name: customerName.value,
        tel: customerPhone.value,
        email: customerEmail.value,
        address: customerAddress.value,
        payment: orderInfoInput.value
      }
    }
  };

  axios.post(`${baseUrl}/${api_path}/orders`, data)
    .then(function () {
      getCart();
      orderInfoForm.reset();
    })
    .catch(function (error) {
      sweetalert2(error.response.data.message);
    });
}

orderInfoBtn.addEventListener('click', addOrder);


function init() {
  getProduct();
  getCart();
}
init();