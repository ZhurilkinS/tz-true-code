import { Card, Button, Badge, Placeholder } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import type { Product } from "../types/shemas";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
}

export const ProductCard = ({
  product,
  onEdit,
  onDelete,
  loading = false,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const hasDiscount = product.discountPrice !== null;

  const handleView = (id: number) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <Card className="h-100 shadow-sm">
        <Placeholder as={Card.Img} variant="top" style={{ height: "200px" }} />
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 shadow-sm hover-shadow">
      {product.imageUrl && (
        <Card.Img
          variant="top"
          src={product.imageUrl}
          alt={product.name}
          style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
          onClick={() => handleView(product.id)}
        />
      )}

      <Card.Body className="d-flex flex-column">
        <Card.Title
          className="h6 mb-2 cursor-pointer"
          style={{ cursor: "pointer" }}
          onClick={() => handleView(product.id)}
        >
          {product.name}
        </Card.Title>

        <Card.Text className="text-muted small flex-grow-1 mb-3">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            {hasDiscount ? (
              <>
                <span className="h5 text-success me-2">
                  ${product.discountPrice}
                </span>
                <span className="text-muted text-decoration-line-through">
                  ${product.price}
                </span>
                <Badge bg="danger" className="ms-2">
                  Скидка
                </Badge>
              </>
            ) : (
              <span className="h5 text-primary">${product.price}</span>
            )}
          </div>
          <small className="text-muted">#{product.article}</small>
        </div>

        <div className="d-flex gap-2 mt-auto">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleView(product.id)}
          >
            Подробнее
          </Button>

          {onEdit && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onEdit(product)}
            >
              Редактировать
            </Button>
          )}

          {onDelete && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(product.id)}
            >
              Удалить
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
