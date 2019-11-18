import React, { Component } from "react";
import { Link } from "react-router-dom";
// import ToolBar from './tool-bar';
import App from './App';
import $ from 'jquery';
import "./App.css";
import "./tool-bar.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faCheck } from '@fortawesome/free-solid-svg-icons';
// import { faUndo } from '@fortawesome/free-solid-svg-icons';

class Result extends Component {

    constructor(props) {
        super(props);
        console.log(props, this.state);
        let isPortrait = window.screen.width < window.screen.height;
        this.state = {
            ...this.state,
            img: props.location.img,
            rect: props.location.rect,
            cardOrientationLS: props.location.cardOrientationLS,
            isPortrait: isPortrait
        };
        this.componentDidMount = this.componentDidMount.bind(this);

        this.handleOrientationChange = this.handleOrientationChange.bind(this);

        App.setRotationClasses(isPortrait);
    }

    showImage(img) {
        console.log("showImage", img);
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        var imageObj = new Image();
        //   var imageObj = document.getElementById('image');
        // imageObj.height = Math.ceil(this.state.rect.height)
        // imageObj.width = Math.ceil(this.state.rect.width)
        imageObj.onload = () => {
            console.log('onload', this.state.rect)
            console.log('onload', imageObj.height);
            console.log('onload', imageObj.width);
            console.log($(window).height(), $(window).width());

            var kx = imageObj.width / $(window).width();
            var ky = imageObj.height / $(window).height();
            // draw cropped image

            var sourceX = Math.ceil(this.state.rect.pos.left * kx);
            var sourceY = Math.ceil(this.state.rect.pos.top * ky);
            var sourceWidth = Math.ceil(this.state.rect.width * kx);
            var sourceHeight = Math.ceil(this.state.rect.height * ky);

            var destWidth = Math.ceil(this.state.rect.width);
            var destHeight = Math.ceil(this.state.rect.height);

            var destX = 0;
            var destY = 0;

            console.log(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            const dataURL = canvas.toDataURL();
            $(canvas).remove();
            console.log(dataURL);
            // $("#imageRes").css({
            //     top:this.state.rect.pos.top,
            //     left:this.state.rect.pos.left,
            //     position: "absolute",
            //     border: "3px dashed red"
            // });
            $("#imageRes")[0].src = dataURL;
            $("#imageRes")[0].setAttribute("has-image","y");
        };

        imageObj.src = img;
    }

    componentDidMount() {
        console.log("componentDidMount");
    
        if ('onorientationchange' in window) {
          window.addEventListener(App.eventName, this.handleOrientationChange, true);
        }

        this.showImage(this.state.img);
      }
    
      componentWillUnmount() {
        console.log("componentWillUnmount");
        
        window.removeEventListener(App.eventName, this.handleOrientationChange, true);
      }

    handleOrientationChange() {
        console.log("res - orientationchange", window.screen);
        $("#imageRes").hide();
        let isPortrait = window.screen.width < window.screen.height;
        
        App.setRotationClasses(isPortrait);
    
        this.setState((state, props) => {
          return {isPortrait: isPortrait};
        });

        setTimeout(function(){
            $("#imageRes").show();
          },500)
    }

    // width={this.state.rect.width} height={this.state.rect.height}

    render() {
        console.log("render res" , ($("#imageRes").length && $("#imageRes")[0].setAttribute("has-image","y")))
        let css = {display:"none"};
            css = App.getRangeCss(this.state.cardOrientationLS, this.state.isPortrait);

        return (<div className="result">
            <canvas id="myCanvas" style={{display:"none"}} width={this.state.rect.width} height={this.state.rect.height} ></canvas>
            <img id="imageRes" style={css.range} alt="result" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" ></img>

            <div className="tool-bar">
                <Link to="/App"> <FontAwesomeIcon icon={faUndo} /></Link>
                <Link to="/"><FontAwesomeIcon icon={faCheck} /></Link>
            </div>

        </div>)
    }
}

export default Result;