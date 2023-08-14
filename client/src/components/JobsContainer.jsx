import React from "react";
import Wrapper from "../assets/wrappers/JobsContainer";
import Job from "./Job";
import { useAllJobsContext } from "../pages/AllJobs";
import PageBtnContainer from "./PageBtnContainer";

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobCount, allJobs, numOfPages } = data;
  if (jobCount === 0) {
    return (
      <Wrapper>
        <h5>
          {jobCount} job {jobCount.length > 1 && "s"} found{" "}
        </h5>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div className="jobs">
        {allJobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default JobsContainer;
