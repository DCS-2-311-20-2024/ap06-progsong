//
// 応用プログラミング 第6回 課題2 (ap0602.js)
//  G284092022 五十嵐健翔
// $Id$
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import {CSS3DRenderer, CSS3DObject} from "three/addons"

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {w:0.6, h:0.1, d:0.6,
     nRow:7, nCol:11, gapX:0.1, gapY:0.3, gapZ:0.4};

  // シーン作成
  const scene = new THREE.Scene();

  // 第1のレンダラ
  const nameHeight = document.getElementById("output1").clientHeight;
  const renderer = new THREE.WebGLRenderer();
  {
    renderer.setClearColor(0x204060);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      0.7*window.innerWidth,
      0.5*window.innerWidth);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.zIndex = 1;
    renderer.domElement.style.top = nameHeight;
  }
  // 第2のレンダラ
  const renderer2 = new THREE.WebGLRenderer();
  {
    renderer2.setClearColor(0x207070);
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.setSize(
      0.3*window.innerWidth,
      0.6*window.innerWidth);
    renderer2.domElement.style.position = "absolute";
    renderer2.domElement.style.zIndex = 1;
    renderer2.domElement.style.top = nameHeight;
  }
  // CSS3Dレンダラ
  const cssRenderer = new CSS3DRenderer();
  {
    cssRenderer.setSize(
      0.7*window.innerWidth,
      0.5*window.innerWidth);
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.zIndex = 0;
    cssRenderer.domElement.style.top = nameHeight;
  }

  // カメラの作成
   const camera1 = new THREE.PerspectiveCamera(
    50, 7/5, 0.1, 1000);
  {
    camera1.position.set(0,2,15);
    camera1.lookAt(0,0,0);
    // camera1.position.set(-1,0,0);
    // camera1.lookAt(0,-1.5,5);
  }
  // 第2のカメラ
  const camera2 = new THREE.PerspectiveCamera(
    50, 1/2, 0.1, 1000);
  {
    camera2.position.set(0,18,6);
    camera2.lookAt(0,0,6);
  }

  // 光源の設定
  { // 環境ライト
    const light = new THREE.AmbientLight();
    light.intensity=0.4;
    scene.add(light);
  }
  { // ポイントライト
    const light = new THREE.PointLight(0xffffff, 500);
    light.position.set(0, 2, 0);
    scene.add(light);
  }

  // 3D物体
  // スクリーン
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(8.0,4.5),
    new THREE.MeshBasicMaterial({
      color:0x000000,
      opacity:0.0,
      blending: THREE.NoBlending,
      side:THREE.DoubleSide
    })
  )
  screen.position.set(0,0,0);
  scene.add(screen);
  
  // 椅子
  const chair = new THREE.Group();
  {
    const chairMaterial = new THREE.MeshLambertMaterial({color:0x802000});
    const ch1 = new THREE.Mesh(
      new THREE.BoxGeometry(param.w,param.h,param.d),
      chairMaterial);
      ch1.position.set(0,0.3,0);
      chair.add(ch1);
      const ch2 = new THREE.Mesh(
        new THREE.BoxGeometry(param.w,param.d,param.h),
        chairMaterial);
      ch2.position.set(0,0.3+(param.d+param.h)/2,(param.d+param.h)/2);
      chair.add(ch2);
  }
  // 座席の生成
 const seats = new THREE.Group();
 for(let r =0;r<param.nRow;r+=1){
  for(let c=0;c<param.nCol;c+=1){
    const seat = chair.clone();
    seat.position.set(
      (param.w+param.gapX)*(c-(param.nCol-1)/2),
      (param.gapZ)*r-2,
      (param.d+param.gapZ)*(r+5)
    );
    seats.add(seat);
  }
 }
 scene.add(seats);
  // ダミーを作る関数
  function makeDummy(color) {
    const dummy = new THREE.Group();
    {
      const dhead = new THREE.Mesh(
        new THREE.SphereGeometry(0.3/2,12,12),
        new THREE.MeshLambertMaterial({color:color})
      );
      dummy.add(dhead);
      const dbody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4/2,0.4/2,0.3,12,1),
        new THREE.MeshLambertMaterial({color:color})
      )
      dbody.position.set(0,-(0.3+0.3)/2,0);
      dummy.add(dbody);
    }
    return dummy;
  }

  // 他の観客
  for(let r=0;r<param.nRow;r++){
    for(let c=0;c<param.nCol;c++){
      if(Math.random()<0.4){
        const dummy = makeDummy("red");
        dummy.position.set(
          (param.w+param.gapX)*(c-(param.nCol-1)/2),
          (param.gapZ)*r-1.2,
          (param.d+param.gapZ)*(r+5)
        )
        scene.add(dummy);
      }
    }
  }
  // アバターの生成
  const avatar = makeDummy("white");
  setAvatar(
    new THREE.Vector3(0,
      3*param.gapY-2,
      3*(param.d+param.gapZ)+5)
  )
  scene.add(avatar);
  // アバターの移動
  function setAvatar(position){
    avatar.position.copy(position);
    avatar.position.y+=0.85;
    camera1.position.copy(avatar.position);
    camera1.lookAt(0,0,0);
    camera1.updateProjectionMatrix();
  }

  // CSS3D表示のための設定
  // iframe要素の生成
  const iframe = document.createElement("iframe");
  iframe.style.width = "640px";
  iframe.style.height = "360px";
  iframe.style.border = "0px";
  iframe.src = "https://www.youtube.com/embed?version=3"
      +"&mute=1&autoplay=1&controls=0"
      +"&loop=1&playlist=w23RIKTYF28,-9pMuSNlN6A";
  
  // CSSオブジェクトの生成
  const cssObject = new CSS3DObject(iframe);
  cssObject.scale.x *= 8/640;
  cssObject.scale.y *= 8/640;
  scene.add(cssObject);

  // レンダラーの配置
  document.getElementById("output1").appendChild(cssRenderer.domElement);
  document.getElementById("output1").appendChild(renderer.domElement);
  document.getElementById("output2").appendChild(renderer2.domElement);
  // シート選択のための設定
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  function onMouseDown(event) {
    // マウスの位置を±1の範囲に変換
    mouse.x = (event.clientX / window.innerWidth - 0.7)*20/3 -1;
    if(mouse.x < -1){
      mouse.x = -1;
    }
    mouse.y = -(event.clientY / (window.innerWidth*0.6))*2+1;
    // 光線を発射
    raycaster.setFromCamera(mouse,camera2);
    // 全ての座席について
    seats.children.forEach((seat)=>{
      //マウスが指しているか確認
      const intersects = raycaster.intersectObject(seat,true);
      if(intersects.length>0){
        //指していたら、その位置にマーカを設置
        setAvatar(intersects[0].object.parent.position);
      }
    });
  }
  window.addEventListener("mousedown", onMouseDown, false);

  // Windowサイズの変更処理
  window.addEventListener("resize", ()=>{
    // camera1.updateProjectionMatrix();
    // camera2.updateProjectionMatrix();
    cssRenderer.setSize( 0.7*window.innerWidth,0.5*window.innerWidth);
    renderer.setSize( 0.7*window.innerWidth,0.5*window.innerWidth );
    renderer2.setSize( 0.3*window.innerWidth,0.6*window.innerWidth );
  }, false);

  // 描画処理
  function update(time) {
    cssRenderer.render(scene, camera1);
    renderer.render(scene, camera1);
    renderer2.render(scene, camera2);
    requestAnimationFrame(update);
  }

  // 描画開始
  requestAnimationFrame(update);
}

document.onload = init();