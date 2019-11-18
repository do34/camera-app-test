import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from 'jquery';
import "./App.css";
import "./range.scss";
import "./tool-bar.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faCamera, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class App extends Component {

  static eventName = /ios/i.test(navigator.userAgent) ? "orientationchange" : "resize";

  constructor(props) {
    console.log("constructor app")
    super(props);
    let isPortrait = window.screen.width < window.screen.height;
    let initialPos = !isPortrait ;
    this.state = {
      ...this.state
      , cardOrientationLS: initialPos
      , saveToFile : true
      , isPortrait : isPortrait
    }

    this.handleOrientationChange = this.handleOrientationChange.bind(this);
    
    this.openResult = this.openResult.bind(this);
    this.rotateRange = this.rotateRange.bind(this);
    this.openCamera = this.openCamera.bind(this);
    // this.getRangeCss = this.getRangeCss.bind(this);
    // this.setRotationClasses = this.setRotationClasses.bind(this);

    App.setRotationClasses(isPortrait);
  }

  rotateRange() {
    console.log("rotateRange");
    let newVal = !this.state.cardOrientationLS;
    this.setState((state, props) => {
      return {cardOrientationLS: newVal};
    });
  }

  openCamera() {
    console.log("openCamera");
    if (typeof window.CameraPreview != "undefined") {
      // let max = Math.max(window.screen.width,window.screen.height);
      let options = {
        // x: 0,
        // y: 0,
        // width: max,
        // height: max,
        camera: window.CameraPreview.CAMERA_DIRECTION.BACK,
        toBack: true,
        tapPhoto: false,
        tapFocus: true,
        previewDrag: false,
        storeToFile: this.state.saveToFile,
        disableExifHeaderStripping: false
      };
      console.log(options);
      $("html").addClass("camera-is-on");
      window.CameraPreview.startCamera(options, console.error);
    }
    else {
      $("body")[0].style.backgroundImage = 'url(./image.jpg)';
      $("body")[0].style.backgroundSize = "cover";
      $("body")[0].style.backgroundRepeat = "no-repeat";
      $("body")[0].style.backgroundAttachment = "fixed";
      
    }
  }


  closeCamera() {
    console.log("closeCamera");
    if (typeof window.CameraPreview != "undefined") {

      $("html").removeClass("camera-is-on");
      window.CameraPreview.stopCamera();
    }
    else {
      $("body")[0].style.backgroundImage = 'none';
    }
  }

  openResult() {
    console.log("openResult");
    let range = $(".bc-range");
    let rect = { pos: range.offset(), width: range.width(), height: range.height() }
    if (typeof window.CameraPreview != "undefined") {
      window.CameraPreview[this.state.saveToFile ? 'takePicture': 'takeSnapshot']({quality: 100}, (data) => {
        console.log(data);
        this.closeCamera();

        this.props.history.push({
          pathname: '/Result',
          img: this.state.saveToFile ? data : "data:image/jpg;base64," + data,
          rect: rect,
          cardOrientationLS: this.state.cardOrientationLS,
          rectCssFnc: this.getRangeCss
        });
      });
    }
    else {
      this.closeCamera();
      
      this.props.history.push({
        pathname: '/Result',
        rect: rect,
        img: './image.jpg',
        cardOrientationLS: this.state.cardOrientationLS
      });
    }

  }

  getImage() {
    console.log("getImage");
    return this.state.image;
  }

  componentDidMount() {
    console.log("componentDidMount");

    this.openCamera();

    if ('onorientationchange' in window) {
      window.addEventListener(App.eventName, this.handleOrientationChange, true);
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    this.closeCamera();
    window.removeEventListener(App.eventName, this.handleOrientationChange, true);
  }

  handleOrientationChange() {
    console.log("app - orientationchange", window.screen);
    $(".bc-range").hide();
    let isPortrait = window.screen.width < window.screen.height;
    
    App.setRotationClasses(isPortrait);

    this.setState((state, props) => {
      return {isPortrait: isPortrait};
    });
    if (typeof window.CameraPreview != "undefined") {
    this.closeCamera();
    this.openCamera();
    }

    setTimeout(function(){
      $(".bc-range").show();
    },500)
  }

  getDPIOld() {
    var div = document.createElement( "div");
    div.style.height = "1in";
    div.style.width = "1in";
    div.style.top = "-100%";
    div.style.left = "-100%";
    div.style.position = "absolute";

    document.body.appendChild(div);

    var result =  div.offsetHeight;
    if (result !== div.offsetWidth){
      console.error("different dpi!")
    }

    document.body.removeChild( div );
    // var devicePixelRatio = window.devicePixelRatio || 1;
    return result;
  }

  static getRangeCss(rngLnd,dvcPrt){
    function findFirstPositive(b, a, i, c) {
      c = (d, e) => e >= d ? (a = d + (e - d) / 2, 0 < b(a) && (a === d || 0 >= b(a - 1)) ? a : 0 >= b(a) ? c(a + 1, e) : c(d, a - 1)) : -1
      for (i = 1; 0 >= b(i);) i *= 2
      return c(i / 2, i) | 0
    }
    var dpi = findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches)
    var devicePixelRatio = window.devicePixelRatio || 1;
    dpi = dpi / devicePixelRatio * 1.3;
    
    console.log("getRangeCss", dpi);
    let mmInInch = 25.4;
    
    // let borderRadiusMm = 3.48;
    let cardHeightMm = 53.98;
    let cardWidthMm = 85.60;

    let widthInIn = (rngLnd ? cardWidthMm : cardHeightMm) / mmInInch;
    let heightInIn = (rngLnd ? cardHeightMm : cardWidthMm ) / mmInInch;
    
    let heightInPx = Math.ceil(heightInIn * dpi);
    let widthInPx = Math.ceil(widthInIn * dpi);
    // let borderRadiusPx = (borderRadiusMm / mmInInch) * dpi;

    console.log(heightInPx, widthInPx, dpi);


    let marginInPx = 16;
    let borderInPx = 1;

    let toolbarSpace = 32;
    let toolBarSpaceWidth = dvcPrt ? 0 : 36;
    let toolBarSpaceHeight = dvcPrt ? toolbarSpace : 0;

    let css = {};

    let screen = window.screen;
    let sizeRatio = 1;

    if (! (
      (screen.availWidth - toolBarSpaceWidth - marginInPx * 2 - borderInPx * 2) >= widthInPx &&
      (screen.availHeight - toolBarSpaceHeight - marginInPx * 2 - borderInPx * 2) >= heightInPx
    )) {
      /// not enough space for business card on screen
      if ((screen.availWidth - toolBarSpaceWidth - marginInPx * 2 - borderInPx * 2) < widthInPx){
        // too wide
        sizeRatio = (screen.availWidth - toolBarSpaceWidth - marginInPx * 2 - borderInPx * 2) / widthInPx;
      }
      else {
        // too high
        sizeRatio = (screen.availHeight - toolBarSpaceHeight - marginInPx * 2 - borderInPx * 2) / heightInPx;
      }
      widthInPx = Math.ceil(widthInPx * sizeRatio);
      heightInPx = Math.ceil(heightInPx * sizeRatio);
      // borderRadiusPx *= sizeRatio;
    } 
    console.log(heightInPx, widthInPx, dpi);
    let top = Math.ceil((screen.availHeight - toolBarSpaceHeight - heightInPx  ) / 2);
    let left = Math.ceil((screen.availWidth - toolBarSpaceWidth - widthInPx ) / 2);
    css = {
      top: top + "px",
      left: left + "px",
      width: widthInPx + "px",
      height: heightInPx + "px",
      // "borderRadius": borderRadiusPx + "px",
      position: "absolute",
      borderWidth: borderInPx + "px"
    }

    let blenders = {
      top : {
        top: 0,
        left: 0,
        width: Math.ceil(screen.availWidth - toolBarSpaceWidth) + "px",
        height: top + "px"
      },
      bottom : {
        top: Math.ceil(top + heightInPx + borderInPx * 2) + "px",
        left: 0,
        width: Math.ceil(screen.availWidth - toolBarSpaceWidth) + "px",
        height: Math.ceil(screen.availHeight - (top + heightInPx + borderInPx * 2)) + "px"
      },
      left : {
        left: 0,
        top: (top - 1) + "px",
        height: Math.ceil(heightInPx + borderInPx * 2 + 2) + "px",
        width: left + "px"
      },
      right : {
        left: Math.ceil(left + widthInPx + borderInPx * 2) + "px",
        top: (top - 1) + "px",
        height: Math.ceil(heightInPx + borderInPx * 2 + 2) + "px",
        width: left + "px"
      }

    }

    return {range:css, blenders:blenders};
  }
  
  static setRotationClasses(isPortrait){
    console.log("setRotationClasses", isPortrait);
    $("html").removeClass("portrait landscape").addClass(isPortrait ? "portrait" : "landscape");
  }

  render() {
    console.log("render app");

    let css = App.getRangeCss(this.state.cardOrientationLS, this.state.isPortrait);
    return (
      <div className="App">
        <div className="working-space">
          <div className="bc-range" style={css.range}></div>
          <div className="blender bl-top" style={css.blenders.top}/>
          <div className="blender bl-bottom" style={css.blenders.bottom}/>
          <div className="blender bl-left" style={css.blenders.left}/>
          <div className="blender bl-right" style={css.blenders.right}/>
        </div>
        <div className="tool-bar">
          <Link to="/" onClick={this.closeCamera}><FontAwesomeIcon icon={faArrowLeft} /></Link>
          <button onClick={this.openResult}><FontAwesomeIcon icon={faCamera} /></button>
          <button onClick={this.rotateRange}><FontAwesomeIcon icon={faRulerCombined} /></button>
        </div>
      </div>
    );
  }
}

export default App;
