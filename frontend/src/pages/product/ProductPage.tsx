import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Badge,
  Breadcrumb,
  Card,
  ButtonGroup,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import {
  clearError,
  setCurrentProduct,
} from "../../entities/Products/model/productsSlice";
import {
  deleteProduct,
  getProduct,
} from "../../entities/Products/model/productsThunks";
import { ConfirmModal } from "../../shared/ui/AppModal";
import { ProductEditForm } from "../../features/product-edit/ProductEditForm";
import axios from "axios";

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentProduct, loading, error } = useAppSelector(
    (state) => state.products
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    dispatch(clearError());
    dispatch(getProduct(Number(id)));

    return () => {
      dispatch(setCurrentProduct(null));
    };
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (!currentProduct) return;

    try {
      setDeleteLoading(true);
      await dispatch(deleteProduct(currentProduct.id)).unwrap();
      setShowDeleteModal(false);
      navigate("/", {
        replace: true,
        state: { message: "Товар успешно удален" },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Ошибка удаления товара:", err);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);

    if (id) {
      dispatch(getProduct(Number(id)));
    }
  };

  const handleBackToCatalog = () => {
    navigate("/catalog");
  };

  if (!id) {
    return (
      <>
        <Container className="py-5 main-content">
          <Alert variant="warning">
            <Alert.Heading>Товар не найден</Alert.Heading>
            <p>Неверный идентификатор товара</p>
            <Button variant="outline-primary" onClick={handleBackToCatalog}>
              Вернуться в каталог
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Container className="text-center py-5 main-content">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Загрузка товара...</span>
          </Spinner>
          <p className="mt-3 text-muted">Загрузка информации о товаре...</p>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Container className="py-5 main-content">
          <Alert variant="danger">
            <Alert.Heading>Ошибка загрузки товара</Alert.Heading>
            <p>{error}</p>
            <div className="d-flex gap-2">
              <Button
                variant="outline-danger"
                onClick={() => dispatch(getProduct(Number(id)))}
              >
                Попробовать снова
              </Button>
              <Button variant="outline-primary" onClick={handleBackToCatalog}>
                Вернуться в каталог
              </Button>
            </div>
          </Alert>
        </Container>
      </>
    );
  }

  if (!currentProduct) {
    return (
      <>
        <Container className="py-5 main-content">
          <Alert variant="warning">
            <Alert.Heading>Товар не найден</Alert.Heading>
            <p>Запрошенный товар не существует или был удален</p>
            <Button variant="outline-primary" onClick={handleBackToCatalog}>
              Вернуться в каталог
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  const hasDiscount =
    currentProduct.discountPrice !== null &&
    currentProduct.discountPrice !== undefined;
  const isActive = currentProduct.isActive;

  return (
    <>
      <Container className="py-4 main-content">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Каталог
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{currentProduct.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          <Col md={6} className="mb-4">
            <Card className="h-100">
              {currentProduct.imageUrl ? (
                <>
                  {imageLoading && (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "400px" }}
                    >
                      <Spinner animation="border" variant="secondary" />
                    </div>
                  )}
                  <Card.Img
                    variant="top"
                    src={currentProduct.imageUrl}
                    alt={currentProduct.name}
                    style={{
                      height: "400px",
                      objectFit: "cover",
                      display: imageLoading ? "none" : "block",
                    }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                </>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center bg-light"
                  style={{ height: "400px" }}
                >
                  <span className="text-muted">Изображение отсутствует</span>
                </div>
              )}
            </Card>
          </Col>

          <Col md={6}>
            <div className="d-flex flex-column h-100">
              {!isActive && (
                <Badge bg="secondary" className="mb-2 align-self-start">
                  Неактивный
                </Badge>
              )}

              <h1 className="h2 mb-3">{currentProduct.name}</h1>

              <p className="text-muted mb-3">
                Артикул: #{currentProduct.article}
              </p>

              <div className="mb-4">
                {hasDiscount ? (
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="h3 text-danger me-3">
                        ${currentProduct.discountPrice}
                      </span>
                      <span className="h5 text-muted text-decoration-line-through">
                        ${currentProduct.price}
                      </span>
                      <Badge bg="danger" className="ms-2">
                        Скидка
                      </Badge>
                    </div>
                    <small className="text-success">
                      Вы экономите $
                      {currentProduct.price -
                        (currentProduct.discountPrice || 0)}
                    </small>
                  </div>
                ) : (
                  <span className="h3 text-primary">
                    ${currentProduct.price}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <h5 className="mb-2">Описание</h5>
                <p className="text-muted" style={{ lineHeight: "1.6" }}>
                  {currentProduct.description || "Описание отсутствует"}
                </p>
              </div>

              <div className="mb-4">
                <h5 className="mb-3">Информация о товаре</h5>
                <Row>
                  <Col sm={6}>
                    <div className="mb-2">
                      <strong>Статус:</strong>{" "}
                      <Badge bg={isActive ? "success" : "secondary"}>
                        {isActive ? "Активный" : "Неактивный"}
                      </Badge>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-2">
                      <strong>Добавлен:</strong>{" "}
                      {new Date(currentProduct.createdAt).toLocaleDateString(
                        "ru-RU"
                      )}
                    </div>
                  </Col>
                  {currentProduct.updatedAt && (
                    <Col sm={6}>
                      <div className="mb-2">
                        <strong>Обновлен:</strong>{" "}
                        {new Date(currentProduct.updatedAt).toLocaleDateString(
                          "ru-RU"
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
              </div>

              <div className="mt-auto d-flex gap-2 flex-wrap">
                <Button variant="outline-primary" onClick={handleBackToCatalog}>
                  ← Назад к каталогу
                </Button>

                <ButtonGroup>
                  <Button
                    variant="outline-warning"
                    onClick={() => setShowEditModal(true)}
                  >
                     Редактировать
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Удаление...
                      </>
                    ) : (
                      "Удалить"
                    )}
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </Col>
        </Row>

        {currentProduct && (
          <ProductEditForm
            product={currentProduct}
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            onSuccess={handleEditSuccess}
          />
        )}

        <ConfirmModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Подтверждение удаления"
          message={`Вы уверены, что хотите удалить товар "${currentProduct.name}"? Это действие нельзя отменить.`}
          confirmText={deleteLoading ? "Удаление..." : "Удалить"}
          cancelText="Отмена"
          variant="danger"
          loading={deleteLoading}
        />
      </Container>
    </>
  );
};
