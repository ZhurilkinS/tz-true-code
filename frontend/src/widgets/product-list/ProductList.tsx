import { Col, Row } from "react-bootstrap";
import type { Product } from "../../entities/Products/types/shemas";
import { ProductCard } from "../../entities/Products/ui/ProductCard";

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <Row>
      {products.map((product) => (
        <Col key={product.id} xs={12} sm={6} lg={4} className="mb-4">
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};
