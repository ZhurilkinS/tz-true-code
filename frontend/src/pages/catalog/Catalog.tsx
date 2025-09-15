import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { getProductsWithFilters } from "../../entities/Products/model/productsThunks";
import { setPage } from "../../entities/Products/model/productsSlice";

import { ProductFilter } from "../../features/product-filter/ProductFilter";
import { ProductSort } from "../../features/product-sort/ProductSort";
import { ProductList } from "../../widgets/product-list/ProductList";
import { AppPagination } from "../../shared/ui/AppPagination";
import { ProductCreateForm } from "../../features/product-create/ProductCreateForm";

export const CatalogPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, pagination, filters } = useAppSelector(
    (state) => state.products
  );
  const [showCreateModal, setShowCreateModal] = useState(false); // Состояние для модалки

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
    dispatch(setPage(page));
  };

  useEffect(() => {
    console.log("useEffect triggered, page:", pagination.page);
    dispatch(getProductsWithFilters());
  }, [dispatch, pagination.page, filters]);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);

    dispatch(getProductsWithFilters());
  };

  if (loading) {
    return (
      <>
        <Container className="text-center py-5 main-content">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Загрузка товаров...</span>
          </Spinner>
          <p className="mt-3 text-muted">Загрузка товаров...</p>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Container className="py-5 main-content">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Ошибка загрузки</Alert.Heading>
            <p>{error}</p>
            <Button
              variant="outline-danger"
              onClick={() => dispatch(getProductsWithFilters())}
            >
              Попробовать снова
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container className="py-4 main-content">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="text-primary">Каталог товаров</h1>
                <p className="text-muted mb-0">
                  Найдено товаров: {pagination.total}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="ms-3"
              >
                + Добавить товар
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={3} className="mb-4">
            <div className="sticky-top" style={{ top: "80px", zIndex: 100 }}>
              <ProductFilter />
              <ProductSort />
            </div>
          </Col>

          <Col lg={9}>
            {pagination.total > 0 && (
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-muted">
                  Показано {items.length} из {pagination.total} товаров
                </small>
                <small className="text-muted">
                  Страница {pagination.page} из {pagination.totalPages}
                </small>
              </div>
            )}

            <ProductList products={items} />

            {pagination.totalPages > 1 && (
              <AppPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {items.length === 0 && !loading && (
              <Alert variant="info" className="text-center mt-4">
                <Alert.Heading>Товары не найдены</Alert.Heading>
                <p>Попробуйте изменить параметры фильтрации или поиска</p>
                <Button
                  variant="outline-info"
                  onClick={() => setShowCreateModal(true)}
                >
                  Добавить первый товар
                </Button>
              </Alert>
            )}
          </Col>
        </Row>
      </Container>

      <ProductCreateForm
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};
