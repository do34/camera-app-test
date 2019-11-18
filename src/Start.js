import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.css";

class Start extends Component {
    closeApp() {
        navigator.app.exitApp()
    }

    render() {
        return (
            <div className="screen-center">
                <Link className="big-button" to="/App"><img alt="make shot" src="hand-business-card.png" width="150px"/></Link>
                <Link className="big-button" to="/Test">Test</Link>
                <button className="big-button" onClick={this.closeApp}>close</button>
            </div>
        );
    };
}

export default Start;