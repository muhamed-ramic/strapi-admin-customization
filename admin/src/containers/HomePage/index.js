import React, { memo } from 'react';
import {Link} from 'react-router-dom';
const HomePage = ({ global: { plugins }, history: { push } }) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2>Hello World!</h2>
          </div>
          <div className="col-12">
           <h3>To go to custom page click here <Link to="/custom">Custom page</Link></h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(HomePage);
