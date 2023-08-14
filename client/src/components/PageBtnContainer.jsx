import React from "react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAllJobsContext } from "../pages/AllJobs";

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJobsContext();
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });

  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageNum) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("page", pageNum);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Wrapper>
      {currentPage > 1 && (
        <button
          className="btn prev-btn"
          onClick={() => {
            let prevPage = currentPage - 1;
            if (prevPage < 1) prevPage = 1;

            handlePageChange(prevPage);
          }}
        >
          <HiChevronDoubleLeft />
          prev
        </button>
      )}
      <div className="btn-container">
        {pages.map((pageNumber) => {
          return (
            <button
              className={`btn page-btn ${
                pageNumber === currentPage && "active"
              }`}
              key={pageNumber}
              onClick={() => {
                handlePageChange(pageNumber);
              }}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      {currentPage < numOfPages && (
        <button
          className="btn next-btn"
          onClick={() => {
            let nextPage = currentPage + 1;
            if (nextPage > numOfPages) nextPage = numOfPages;

            handlePageChange(nextPage);
          }}
        >
          next
          <HiChevronDoubleRight />
        </button>
      )}
    </Wrapper>
  );
};

export default PageBtnContainer;
