import axios from 'axios';
import c3 from 'c3'

import { sweetalert2 } from './main.js';

const api_path = "yinmin";
const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin";
const config = {
  headers: {
    Authorization: '637po6yzi2bXojmEob5TAMnaZk93'
  }
}

// 請同學自行組出資料，不可直接寫死資料
c3.generate({
  bindto: '#chart',
  data: {
    columns: [
        ['床架', 45],
        ['收納', 35],
        ['窗簾', 20],
    ],
    type : 'pie',
  }
});



//GET 後台取得訂單
let orderData = [];
function getOrder() {
  const url = `${baseUrl}/${api_path}/orders`;
  
  axios.get(url, config)
    .then(function (response) {
      orderData = response.data.orders;
      renderOrder();
    })
    .then(function () {
      const orderStatus = document.querySelectorAll('.orderStatus a');
      orderStatus.forEach(function (item) {
        item.addEventListener('click', changeOrderStatus);
      })
      const delSingleOrderBtn = document.querySelectorAll('.delSingleOrder-Btn');
      delSingleOrderBtn.forEach(function (item) {
        item.addEventListener('click', removeOrderItem);
      })

    })
    .catch(function () {
      sweetalert2("取得訂單失敗");
    })
}
getOrder();

function renderOrder() {
  const orderPageable = document.querySelector('.orderPage-table tbody');
  let str = '';

  orderData.forEach(function (item) {
    str += `<tr><td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
     <p>${item.products[0].title}</p>
    </td>
    <td>${item.createdAt}</td>
    <td class="orderStatus">
      <a href="#" data-id="${item.id}"> 
        ${item.paid ? '已處理' : '未處理'}
      </a>
    </td>
    <td>
    <input type="button" class="delSingleOrder-Btn"  data-id="${item.id}" value="刪除">
    </td></tr>`
  });

  orderPageable.innerHTML = str;
}

// PUT 修改訂單狀態
function changeOrderStatus(e) {
  let status = false;

  if (e.target.textContent.trim() === '已處理'){
    status = true;
  } 
  e.preventDefault();
  const data = {
    data: {
      id: e.target.dataset.id,
      paid: !status
    }
  };

  axios.put(`${baseUrl}/${api_path}/orders`, data, config)
    .then(function () {
      getOrder();
    })
    .catch(function (error) {
      sweetalert2(error.response.data.message);
    })
}

// DELETE 刪除單一訂單
function removeOrderItem(e) {
  const id = e.target.dataset.id;

  axios.delete(`${baseUrl}/${api_path}/orders/${id}`, config)
    .then(function () {
      getOrder();
    })
    .catch(function (error) {
      sweetalert2(error.response.data.message);
    })
}

//DELETE 清除全部訂單
const discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click', removeOrderAll);

function removeOrderAll(e) {
  e.preventDefault();

  axios.delete(`${baseUrl}/${api_path}/orders`, config)
    .then(function () {
      getOrder();
    })
    .catch(function (error) {
      sweetalert2(error.response.data.message);
    });
}
