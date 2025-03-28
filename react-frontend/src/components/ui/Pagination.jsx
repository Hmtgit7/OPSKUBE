import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon
  } from '@heroicons/react/solid';
  
  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    hasNextPage, 
    hasPrevPage 
  }) => {
    // Handle page changes
    const handlePageChange = (page) => {
      if (page < 1 || page > totalPages) return;
      onPageChange(page);
    };
  
    // Create page numbers to display
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
  
      if (totalPages <= maxPagesToShow) {
        // If total pages is less than max pages to show, display all pages
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always include first and last page
        pages.push(1);
  
        // Calculate range of pages to show around current page
        const leftBound = Math.max(2, currentPage - 1);
        const rightBound = Math.min(totalPages - 1, currentPage + 1);
  
        // Add ellipsis after first page if needed
        if (leftBound > 2) {
          pages.push('...');
        }
  
        // Add pages in range
        for (let i = leftBound; i <= rightBound; i++) {
          pages.push(i);
        }
  
        // Add ellipsis before last page if needed
        if (rightBound < totalPages - 1) {
          pages.push('...');
        }
  
        pages.push(totalPages);
      }
  
      return pages;
    };
  
    // If only one page, don't display pagination
    if (totalPages <= 1) return null;
  
    // Generate page numbers
    const pageNumbers = getPageNumbers();
  
    return (
      <div className="flex items-center justify-center mt-8">
        <nav className="flex items-center space-x-1">
          {/* First page button */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
            aria-label="First page"
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>
  
          {/* Previous page button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className={`p-2 rounded-md ${
              !hasPrevPage
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
  
          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                {page}
              </button>
            )
          ))}
  
          {/* Next page button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`p-2 rounded-md ${
              !hasNextPage
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
  
          {/* Last page button */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
            aria-label="Last page"
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </nav>
      </div>
    );
  };
  
  export default Pagination;