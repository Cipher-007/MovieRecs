import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50]

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalItems === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
      {/* Items info */}
      <div className="text-sm text-white/50">
        Showing <span className="text-white/70 font-medium">{startItem}-{endItem}</span> of{' '}
        <span className="text-white/70 font-medium">{totalItems}</span> items
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all
            bg-white/5 border border-white/10 text-white/60
            hover:bg-white/10 hover:text-white hover:border-white/20
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-white/60 disabled:hover:border-white/10"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <div className="px-4 py-1.5 text-sm font-medium text-white/70 bg-white/5 border border-white/10 rounded-lg">
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all
            bg-white/5 border border-white/10 text-white/60
            hover:bg-white/10 hover:text-white hover:border-white/20
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-white/60 disabled:hover:border-white/10"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/50">Show:</span>
        <div className="flex items-center gap-1">
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onItemsPerPageChange(option)}
              className={`px-2.5 py-1 text-sm font-medium rounded-md transition-all ${
                itemsPerPage === option
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
