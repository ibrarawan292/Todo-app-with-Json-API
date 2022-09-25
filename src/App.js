import axios from 'axios';
import { MDBBtn, MDBBtnGroup, MDBCol, MDBContainer, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBRow, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

function App() {


  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("")
  const [currnetPage, setCurrentPage] = useState(0)
  const [pageLimit, setPageLimit] = useState(4)
  const [sortFilterValue, setSortFilterValue] = useState("")
  const [operation, setOperation] = useState("")

  const sortOptions = ["name", "username", "email", "address", "phone", "status"]


  useEffect(() => {
    storeUserData(0, 4, 0);

  }, [])

  const storeUserData = async (start, end, increase, optType = null, filterOrSortValue) => {
    switch (optType) {
      case "search":
        setOperation(optType);
        setSortValue("");
        return await axios.get(`http://localhost:5000/Users?q=${value}&_start=${start}&_end=${end}`)
          .then((responce) => {
            setData(responce.data);
            setCurrentPage(currnetPage + increase)

          })
          .catch((err) => console.log(err));
      case "sort":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return await axios.get(`http://localhost:5000/Users?_sort=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((responce) => {
            setData(responce.data);
            setCurrentPage(currnetPage + increase)
          })
          .catch((err) => console.log(err))
      case "filter":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return await axios.get(`http://localhost:5000/Users?status=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((responce) => {
            setData(responce.data);
            setCurrentPage(currnetPage + increase)
          })
          .catch((err) => console.log(err))
      default:
        return await axios.get(`http://localhost:5000/Users?_start=${start}=0&_end=${end}`)
          .then((responce) => {
            setData(responce.data);
            setCurrentPage(currnetPage + increase)
          })
          .catch((err) => console.log(err));

    }

  }





  const handleReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setSortValue("");
    storeUserData(0, 4, 0)
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    storeUserData(0, 4, 0, "search")
    // return await axios.get(`http://localhost:5000/Users?q=${value}`)
    //   .then((responce) => {
    //     setData(responce.data);
    //     setValue(value)
    //   })
    //   .catch((err) => console.log(err))

  }

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    storeUserData(0, 4, 0, "sort", value)
    // return await axios.get(`http://localhost:5000/Users?_sort=${value}&_order=asc`)
    //   .then((responce) => {
    //     setData(responce.data);
    //   })
    //   .catch((err) => console.log(err))
  }

  const handleFilter = async (value) => {
    storeUserData(0, 4, 0, "filter", value)
    // await axios.get(`http://localhost:5000/Users?status=${value}`)
    //   .then((responce) => {
    //     setData(responce.data)
    //   })
    //   .catch((err) => console.log(err))
  }

  const renderPagination = () => {
    if (data.length < 4 && currnetPage === 0) return null;
    if (currnetPage === 0) {
      return (
        <MDBPagination>
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => storeUserData(4, 8, 1, operation, sortFilterValue)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else if (currnetPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBBtn onClick={() =>
              storeUserData(
                (currnetPage - 1) * 4,
                currnetPage * 4,
                -1,
                operation,
                sortFilterValue)
            }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currnetPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() =>
              storeUserData(
                (currnetPage + 1) * 4,
                (currnetPage + 2) * 4,
                1, operation, sortFilterValue)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination>
          <MDBPaginationItem>
            <MDBBtn onClick={() => storeUserData((currnetPage - 1) * 4, currnetPage * 4, -1, operation, sortFilterValue)}>prev</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currnetPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      )
    }
  }
  return (
    <div className="App">
      <MDBContainer>
        <form action=""
          style={{
            margin: 'auto',
            padding: "15px",
            maxWidth: '400px',
            alignContent: 'center'
          }}
          className="d-flex input-group w-auto"
          onSubmit={handleSearch}
        >
          <input type="text" className='form-control' placeholder='search value...' value={value} onChange={(e) => setValue(e.target.value)} />

          <MDBBtn type='submit' color='dark'>Search</MDBBtn>
          <MDBBtn className='mx-2' color='info' onClick={() => handleReset()}>Reset</MDBBtn>

        </form>
        <div style={{ marginTop: "100px" }}>
          <h2 className='text-center'>
            Search, filter, Sort and Pagination using Json fake Rest API
          </h2>
          <MDBRow>
            <MDBCol size="12">
              <MDBTable>
                <MDBTableHead dark>
                  <tr>
                    <th scope='col'>No.</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Phone</th>
                    <th scope='col'>Address</th>
                    <th scope='col'>Status</th>
                  </tr>
                </MDBTableHead>
                {
                  data.length === 0 ? (
                    <MDBTableBody className='align-center mb-0'>
                      <tr>
                        <td colSpan={8} className="text-center mb-0">
                          No Data found
                        </td>
                      </tr>
                    </MDBTableBody>
                  ) : (
                    data.map((item, index) => {

                      return <MDBTableBody key={index}>
                        <tr>
                          <th scope='row'>{index + 1}</th>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.phone}</td>
                          <td>{item.address}</td>
                          <td>{item.status}</td>
                        </tr>
                      </MDBTableBody>
                    })
                  )
                }
              </MDBTable>
            </MDBCol>
          </MDBRow>
        </div>
        <div
          style={{
            margin: 'auto',
            padding: "15px",
            maxWidth: "250px",
            alignContent: "center"
          }}>
          {renderPagination()}
        </div>
        {
          data.length > 0 && (
            <MDBRow>
              <MDBCol size="8">
                <h5>Sort by:</h5>
                <select
                  style={{ width: "50%", borderRadius: "2px", height: "35px" }}
                  value={sortValue}
                  onChange={handleSort}
                >
                  <option value="">Please select Value</option>
                  {sortOptions.map((item, index) => {
                    return <option key={index} value={item}>{item}</option>
                  })
                  }
                </select>
              </MDBCol>
              <MDBCol size="4">
                <h5>Filter by status:</h5>
                <MDBBtnGroup>
                  <MDBBtn color='success' style={{ marginLeft: "2px" }} onClick={() => handleFilter('active')}>
                    Active
                  </MDBBtn>
                  <MDBBtn color='danger' style={{ marginLeft: "2px" }} onClick={() => handleFilter('Inactive')}>
                    Inactive
                  </MDBBtn>
                </MDBBtnGroup>
              </MDBCol>
            </MDBRow>
          )
        }
      </MDBContainer>
    </div>
  );
}

export default App;
