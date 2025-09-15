import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "../Layout/Layout";
import { CatalogPage } from "../../pages/catalog/Catalog";
import { ProductPage } from "../../pages/product/ProductPage";

export default function Router(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
