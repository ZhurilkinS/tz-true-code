import { Card, Form } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/hooks'
import { getProductsWithFilters } from '../../entities/Products/model/productsThunks'
import { setFilters } from '../../entities/Products/model/productsSlice'


export const ProductSort = () => {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.products)

  const handleSortChange = (key: 'sortBy' | 'sortOrder', value: string) => {
    dispatch(setFilters({ [key]: value }))
    dispatch(getProductsWithFilters())
  }

  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">Сортировка</h6>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Сортировать по</Form.Label>
          <Form.Select
            value={filters.sortBy}
            onChange={(e) => handleSortChange('sortBy', e.target.value)}
          >
            <option value="name">По названию</option>
            <option value="price">По цене</option>
            <option value="createdAt">По дате добавления</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Порядок</Form.Label>
          <Form.Select
            value={filters.sortOrder}
            onChange={(e) => handleSortChange('sortOrder', e.target.value)}
          >
            <option value="ASC">По возрастанию</option>
            <option value="DESC">По убыванию</option>
          </Form.Select>
        </Form.Group>
      </Card.Body>
    </Card>
  )
}