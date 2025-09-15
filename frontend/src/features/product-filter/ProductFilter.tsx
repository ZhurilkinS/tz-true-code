import { Form, Card, Button, Row, Col } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/hooks'
import { resetFilters, setFilters } from '../../entities/Products/model/productsSlice'
import { getProductsWithFilters } from '../../entities/Products/model/productsThunks'
import { useDebouncedCallback } from 'use-debounce'


export const ProductFilter = () => {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.products)

  const debouncedSearch = useDebouncedCallback((search: string) => {
    dispatch(setFilters({ search }))
    dispatch(getProductsWithFilters())
  }, 500)

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handlePriceFilter = () => {
    dispatch(getProductsWithFilters())
  }

  const handleReset = () => {
    dispatch(resetFilters())
    dispatch(getProductsWithFilters())
  }

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Фильтры</h6>
        <Button variant="outline-secondary" size="sm" onClick={handleReset}>
          Сбросить
        </Button>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Поиск</Form.Label>
            <Form.Control
              type="text"
              placeholder="Название или описание..."
              defaultValue={filters.search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Цена от</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value || '')}
                  onBlur={handlePriceFilter}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Цена до</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="10000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value || '')}
                  onBlur={handlePriceFilter}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  )
}