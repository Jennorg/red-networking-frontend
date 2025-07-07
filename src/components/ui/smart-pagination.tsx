"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

export function SmartPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className = "",
  showPageNumbers = true,
  maxVisiblePages = 5,
}: SmartPaginationProps) {
  // Helper function to check if a page number is valid
  const isValidPageNumber = (pageNumber: number | null | undefined): boolean => {
    return pageNumber !== null && pageNumber !== undefined && pageNumber > 0;
  };

  // Helper function to check if previous button should be disabled
  const isPreviousDisabled = (): boolean => {
    return !isValidPageNumber(currentPage) || 
           currentPage <= 1 || 
           !isValidPageNumber(totalPages) ||
           totalPages <= 0 ||
           isLoading;
  };

  // Helper function to check if next button should be disabled
  const isNextDisabled = (): boolean => {
    return !isValidPageNumber(currentPage) || 
           !isValidPageNumber(totalPages) ||
           currentPage >= totalPages || 
           totalPages <= 0 ||
           isLoading;
  };

  // Helper function to check if a page link should be disabled
  const isPageLinkDisabled = (pageNumber: number): boolean => {
    return !isValidPageNumber(pageNumber) || 
           pageNumber > totalPages ||
           totalPages <= 0 ||
           isLoading;
  };

  // Helper function to handle page change with validation
  const handlePageChange = (page: number) => {
    console.log(`SmartPagination: Attempting to change to page ${page}`);
    if (!isValidPageNumber(page) || 
        page <= 0 || 
        page > totalPages || 
        page === currentPage ||
        isLoading) {
      console.log(`SmartPagination: Page change blocked - invalid or disabled`);
      return;
    }
    console.log(`SmartPagination: Calling onPageChange with page ${page}`);
    onPageChange(page);
  };

  // Helper function to generate visible page numbers
  const getVisiblePageNumbers = (): number[] => {
    if (!showPageNumbers || totalPages <= 0) return [];
    
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Don't render pagination if there are no pages or invalid data
  if (!isValidPageNumber(totalPages) || totalPages <= 0) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (isPreviousDisabled()) {
                return;
              }
              handlePageChange(currentPage - 1);
            }}
            className={`bg-gray-800 text-white border-2 border-blue-400 transition-all duration-200 ${
              isPreviousDisabled()
                ? "opacity-50 cursor-not-allowed border-gray-600"
                : "hover:bg-blue-400 hover:border-blue-300"
            }`}
            aria-disabled={isPreviousDisabled()}
            tabIndex={isPreviousDisabled() ? -1 : 0}
          />
        </PaginationItem>

        {showPageNumbers && getVisiblePageNumbers().map((pageNumber) => {
          const isDisabled = isPageLinkDisabled(pageNumber);
          const isActive = pageNumber === currentPage;
          
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                className={`bg-gray-800 text-white border-2 border-blue-400 transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-400 !text-black border-blue-300" 
                    : isDisabled
                    ? "opacity-50 cursor-not-allowed border-gray-600"
                    : "hover:bg-blue-400 hover:border-blue-300"
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (isDisabled) {
                    return;
                  }
                  handlePageChange(pageNumber);
                }}
                isActive={isActive}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (isNextDisabled()) {
                return;
              }
              handlePageChange(currentPage + 1);
            }}
            className={`bg-gray-800 text-white border-2 border-blue-400 transition-all duration-200 ${
              isNextDisabled()
                ? "opacity-50 cursor-not-allowed border-gray-600"
                : "hover:bg-blue-400 hover:border-blue-300"
            }`}
            aria-disabled={isNextDisabled()}
            tabIndex={isNextDisabled() ? -1 : 0}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
} 