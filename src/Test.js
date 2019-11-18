import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.css";
// import $ from 'jquery';

class Test extends Component {
render() {
    return <test>
        <card></card>
        {/* <img alt="ss" className="test" src="test.png"></img> */}
        <Link to="/" onClick={this.closeCamera}>back</Link>
    </test>
}
}

export default Test;