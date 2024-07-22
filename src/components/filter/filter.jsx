import { useState } from "react";
// import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./filter.css";
const FilterDropdown = ({ applyFilter, resetFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // State hook to track the open/closed state of the dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Asynchronous function to handle form submission
  // Applies the filter with the provided start and end dates
  // and closes the dropdown
  async function onSubmit() {
    applyFilter(new Date(startDate), new Date(endDate));
    setIsOpen(false);
  }

  // Asynchronous function to handle form reset
  // Clears the start and end dates, resets the filter
  // and closes the dropdown
  async function onReset() {
    setStartDate("");
    setEndDate("");
    resetFilter();
    setIsOpen(false);
  }

  return (
    <div className="mx-3 p-2" style={{background:"white" , borderRadius:"10px"}}  >
      <Dropdown onToggle={() => setIsOpen(!isOpen)} show={isOpen}>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          className="btn btn-primary"
        >
          Filter
        </Dropdown.Toggle>

        <Dropdown.Menu show={isOpen}>
          <div className="m-3">
            <p className="font-weight-bold h5">Filter by Date: </p>
            <div className="mx-2 my-6 ">
              <div className="mx-2 my-2">
                <p className="font-weight-normal h6">From Data: </p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                />
              </div>
              <div className="mx-2 my-2">
                <p className="font-weight-normal h6">To Data: </p>
                <input
                  type="date"
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                  value={endDate}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={onSubmit}
              className="btn btn-primary mx-2"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={onReset}
              className="btn  btn-outline-primary mx-2"
            >
              Reset
            </button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FilterDropdown;
