//
// 応用プログラミング 第6回 課題1 (ap0601)
// G284092022 五十嵐健翔
//
"use strict"; // 厳格モード

// ライブラリのインポート
import * as THREE from "three";
import { OrbitControls } from "three/addons";
import { CSS3DObject, CSS3DRenderer } from "three/addons";
import GUI from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  const params = {
    fov: 60, // 視野角
    axes: false, // 座標軸の標示
    cameraH: 6, // カメラの高さ
  };

  const dpy = {
    W:6.2, // ディスプレイの幅
    H: 3.6, // ディスプレイの高さ
    D: 0.2, // ディスプレイの厚さ
    E: 0.1, // ディスプレイの縁
  }
  const std = {
    H: 2.0, // ディスプレイスタンドの高さ
    W: 1.5, // ディスプレイスタンドの幅
    D: 1.9, // ディスプレイスタンドの奥行
    T: 0.1, // ディスプレイスタンドの厚さ
  }

  // シーン作成
  const scene = new THREE.Scene();

   // レンダラの設定
  const nameHeight = document.getElementById("name").clientHeight;
  let canvasHeight = window.innerHeight-nameHeight;
  let canvasWidth = window.innerWidth;
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0x406080);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = nameHeight;
  document.getElementById("canvas").appendChild(renderer.domElement);
  // レンダラに影の処理をさせる
  renderer.shadowMap.enabled = true;
  // CSSRenderer の追加
  const cssRenderer = new CSS3DRenderer();
  cssRenderer.setSize(canvasWidth, canvasHeight);
  cssRenderer.domElement.style.position = "absolute";
  cssRenderer.domElement.style.top = nameHeight;
  document.getElementById("canvas").appendChild(cssRenderer.domElement);

  // カメラの設定
  const camera = new THREE.PerspectiveCamera(
    params.fov, window.innerWidth/window.innerHeight, 0.01, 100);
  camera.position.set(0,0,params.cameraH);
  camera.lookAt(0,0,0);
  
  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // 光源の作成
  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(20, 35, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const ambLight = new THREE.AmbientLight(0x404040, 20);
  scene.add(ambLight);

 
  // CSSRenderer で表示する iframe要素を作る
  const iframe = document.createElement("iframe");
  iframe.style.width = "640px";
  iframe.style.height = "360px";
  iframe.style.border = "0px";
  iframe.src = "https://feng.takushoku-u.ac.jp/course/cs/";
  const webPage = new CSS3DObject(iframe);
  webPage.scale.x *=(dpy.W - dpy.E)/640;
  webPage.scale.y *=(dpy.H - dpy.E)/360;
  webPage.position.set(0,0,dpy.D/2);
  scene.add(webPage);

  // カメラ制御
  const orbitControls = new OrbitControls(camera, cssRenderer.domElement);
  orbitControls.enableDumping = true;
  orbitControls.minAzimuthAngle = -Math.PI/2;
  orbitControls.maxAzimuthAngle = Math.PI/2;
  // ディスプレイ
  const display = new THREE.Group();
  {
    // 表示部
    const silverMaterial = new THREE.MeshPhongMaterial({color: "silver"});
    const blackMaterial = new THREE.MeshPhongMaterial({color:"black"});
    const face = new THREE.Mesh(
      new THREE.BoxGeometry(dpy.W, dpy.H, dpy.D),
      [silverMaterial,silverMaterial,silverMaterial,
        silverMaterial,blackMaterial,silverMaterial]
    );
    display.add(face);
    // スタンド台
    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(std.W,std.T,std.D),
      silverMaterial
    )
    standBase.position.y=-(dpy.H/4+std.H);
    display.add(standBase);    
    // スタンド脚
    const theta = Math.PI/8;
    const standBack = new THREE.Mesh(
      new THREE.BoxGeometry(
        std.W,
        std.H/Math.cos(theta),
        std.T),
      silverMaterial
    );
    standBack.rotation.x=theta;
    standBack.position.set(
      0,
      -(dpy.H/4 + std.H/2),
      -(std.H*Math.tan(theta))/2 );
    display.add(standBack);
    // 影の設定
    display.children.forEach((child)=>{
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }
  display.castShadow = true;
  display.receiveShadow = true;
  scene.add(display);
  // デスク
  const desk = new THREE.Mesh(
    new THREE.PlaneGeometry(10,6),
    new THREE.MeshLambertMaterial({color:0xb08030})
  );
  desk.rotation.x=-0.5*Math.PI;
  desk.position.y=-(dpy.H/4+std.H+std.T/2);
  desk.receiveShadow = true;
  scene.add(desk);
  // 描画関数の定義
  function render() {
    axes.visible = params.axes;
    display.children.forEach((child) => {
      child.material.wireframe = params.wireframe;
    });
    orbitControls.update();
    // WebGL レンダラ
    renderer.render(scene, camera);
    // CSS3D レンダラ
    cssRenderer.render(scene,camera);
    requestAnimationFrame(render);
  }

  // サイズ変更
  window.addEventListener("resize", () => {
    canvasHeight = window.innerHeight-nameHeight;
    canvasWidth = window.innerWidth;
    camera.aspect = canvasWidth/canvasHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidth,canvasHeight);
    cssRenderer.setSize(canvasWidth,canvasHeight);
  });
  
  // GUIコントローラ
  const gui = new GUI();
  gui.add(params, "axes");
  
  // 最初の描画
  render();
}

// 3Dページ作成関数の呼び出し
init();
