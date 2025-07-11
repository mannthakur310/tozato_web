import React, { useState, useEffect,useRef } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./Home.css";
import Card from "../Card";
import { baseurl } from "../../Urls";

function Home() {
  const [search, setsearch] = useState('')
  const [foodData, setFoodData] = useState([]); //not used for objects
  const [foodCategory, setFoodCategory] = useState([]); //not used for objects

  const myRef = useRef();

  const loadData = async () => {
    let response = await fetch(`${baseurl}/api/foodData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    setFoodData(response[0]);
    setFoodCategory(response[1]);
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
        >
          <div className="carousel-inner">
            <div className="carousel-caption " style={{ zIndex: "10" }}>
              <div className="d-flex justify-content-center" role="search"  ref={myRef}>
                <input
                  className="form-control me-2 bg-muted "
                  type="search"
                  placeholder="Search Here"
                  aria-label="Search"
                  value={search}
                  onChange={(e)=>{setsearch(e.target.value)}}
                  onClick={() => myRef.current?.scrollIntoView({
                    behavior: 'smooth'
                  }) }
                />
              </div>
            </div>
            <div className="carousel-item active">
              <img
                style={{ height: "95vh", filter: "brightness(60%)" }}
                src="https://static.onecms.io/wp-content/uploads/sites/43/2022/09/26/25473-the-perfect-basic-burger-ddmfs-4x3-1350-1.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                style={{ height: "100vh", filter: "brightness(50%)" }}
                src="https://th.bing.com/th/id/OIP.4DGd-_RHf2I40HkNq_xJpgHaFC?rs=1&pid=ImgDetMain"
                className="d-block w-100 "
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                style={{ height: "100vh", filter: "brightness(50%)" }}
                src="https://theawesomedaily.com/wp-content/uploads/2016/09/pictures-of-pizza-23-1.jpg"
                className="d-block w-100 "
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="container d-inline">
        {Array.isArray(foodCategory) && foodCategory.length > 0 ? (
          foodCategory.map((data) => {
            return (
              <div className="row mb-2">
                <div key={data._id} className="fs-5 m-2 text-light">
                  {data.CategoryName}
                </div>
                <div style={{ width: "105vw", color: "white", height: "7px" }}>
                  <hr />
                </div>
                {(Array.isArray(foodData) && foodData.length > 0) ? (
                  foodData
                    .filter((items) => (items.CategoryName === data.CategoryName) && (items.name.toLowerCase().includes(search.toLowerCase())))
                    .map((filterItem) => {
                      const{_id,img,name}=filterItem //important
                      return (
                        <div
                          key={_id}
                          className="col-12 col-md-6 col-lg-3"
                        >
                          <Card
                            foodItem={filterItem}
                            option={filterItem.options[0]}
                          />
                        </div>
                      );
                    })
                ) : (
                  <div>""</div>
                )}
              </div>
            );
          })
        ) : (
          <div>NO SUCH DATA FOUND</div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
