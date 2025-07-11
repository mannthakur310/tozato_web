import React from "react";

function Footer() {
  return (
    <div>
      <div className="container justify-content-center">
        <footer className="py-3 my-4" style={{ width: "100vw" }}>
          <div style={{ width: "105vw",color:"white", height:"5px"}}>
            <hr />
          </div>
          <p className="text-center text-light mt-3" >© 2021 Company, Inc</p>
        </footer>
      </div>
    </div>
  );
}

export default Footer;

