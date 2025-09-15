import { Pagination as BootstrapPagination } from 'react-bootstrap'

interface AppPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const AppPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: AppPaginationProps) => {
  if (totalPages <= 1) return null

  console.log('AppPagination render:', { currentPage, totalPages })

  const handleClick = (page: number) => {
    console.log('Page clicked:', page)
    onPageChange(page)
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <BootstrapPagination>
        <BootstrapPagination.Prev
          disabled={currentPage === 1}
          onClick={() => handleClick(currentPage - 1)}
        />
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handleClick(page)}
          >
            {page}
          </BootstrapPagination.Item>
        ))}
        
        <BootstrapPagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handleClick(currentPage + 1)}
        />
      </BootstrapPagination>
    </div>
  )
}