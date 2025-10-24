import React from "react";
import axios from "axios";
import config from "./config";

const baseUrl = config.baseUrl;

function getProductList() {
  const response = axios({
    method: "GET",
    url: "Product/GetProductList",
    baseURL: baseUrl,
  });
  return response;
}

function addProduct(params: any) {
  const { productName, andaId, remarks, isActive } = params;

  const postProps = {
    productId: 0,
    productName: productName,
    andaId: andaId,
    remarks: remarks,
    isActive: isActive,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "Product/AddProduct",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

function updateProduct(params: any) {
  const { productId, productName, andaId, remarks, isActive } = params;

  const postProps = {
    productId: productId,
    productName: productName,
    andaId: andaId,
    remarks: remarks,
    isActive: isActive,
    // createdDate: new Date(),
    // modifiedDate: new Date(),
    // createdBy: 0,
    // modifiedBy: 0,
  };

  const response = axios({
    method: "POST",
    url: "Product/UpdateProduct",
    baseURL: baseUrl,
    data: {
      ...postProps,
    },
  });

  return response;
}

// function getProductListEx() {
//   const response = axios({
//     method: "GET",
//     url: "Product/GetProductListEx",
//     baseURL: baseUrl,
//   });
//   return response;
// }
function getProductListEx(params?: {
  filterCol?: string;
  filterOperator?: string;
  filterValue?: string;
  ItemsPerPage?: number;
  PageNumber?: number;
}) {
  const { filterCol, filterOperator, filterValue, ItemsPerPage, PageNumber } = params || {};
  const response = axios({
    method: "GET",
    url: "Product/GetProductListEx",
    baseURL: baseUrl,
    params: {
      filterCol,
      filterOperator,
      filterValue,
      ItemsPerPage,
      PageNumber
    },
  });
  return response;
}

const Product = {
  getProductList,
  addProduct,
  updateProduct,
  getProductListEx,
};

export default Product;
