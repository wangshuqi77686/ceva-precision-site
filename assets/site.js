import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const wrap=document.querySelector('.hero-visual'), canvas=document.querySelector('#product-canvas');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,1,.01,100); camera.position.set(1.55,1.10,2.45);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.2;
const controls=new OrbitControls(camera,canvas); controls.enableDamping=true; controls.target.set(0,.42,0); controls.minDistance=1.35; controls.maxDistance=4; controls.maxPolarAngle=Math.PI*.72;
scene.add(new THREE.HemisphereLight(0xcbe5ff,0x06121d,2.0));
const key=new THREE.DirectionalLight(0xffffff,3.8);key.position.set(-3,-4,5);scene.add(key);
const rim=new THREE.DirectionalLight(0x50ef88,2.2);rim.position.set(3,1,3);scene.add(rim);
const blue=new THREE.PointLight(0x3c8bd7,12,5);blue.position.set(-2,-1,1);scene.add(blue);
let model,exploded=false,initial=new Map();
new GLTFLoader().load('assets/model/ci5plus.glb',g=>{model=g.scene;model.rotation.z=0;scene.add(model);model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;initial.set(o,{p:o.position.clone()})}});wrap.classList.add('ready');fit();},undefined,()=>{wrap.classList.add('ready','fallback');canvas.style.display='none'});
function fit(){const b=new THREE.Box3().setFromObject(model),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());model.position.sub(c);model.position.y+=s.y*.5;}
function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}animate();
const views={front:[0,.78,2.55],detail:[-.55,.72,1.70],feeder:[.78,.78,1.85],reset:[1.55,1.10,2.45]};
document.querySelectorAll('.model-toolbar button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.model-toolbar button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const v=btn.dataset.view;if(v==='explode'){exploded=!exploded;model?.traverse(o=>{if(!o.isMesh)return;const base=initial.get(o)?.p;if(!base)return;o.position.copy(base);if(exploded){if(/Feeder/.test(o.name))o.position.x+=.16;if(/Screen/.test(o.name))o.position.y+=.10;if(/MillDoor|MillWindow/.test(o.name))o.position.z+=.12}});return}if(views[v]){camera.position.fromArray(views[v]);controls.target.set(v==='feeder'?.26:v==='detail'?-.18:0,.42,0);controls.update()}}));

const products={ci5:{i:'01 / 03',name:'CI5',desc:'五轴干式义齿切削设备，以航空铝材机身、全伺服驱动与开放式 CAM 工作流，面向稳定、高效的日常加工。',spec:['0.01 mm','0–60,000 rpm','9 把','520 × 645 × 820 mm']},ci5w:{i:'02 / 03',name:'CI5W',desc:'五轴干湿两用设备，面向玻璃陶瓷、钛柱、钛盘、PMMA 与氧化锆等多材料加工，并配备循环过滤水冷系统。',spec:['0.01 mm','60,000 rpm','9 把','520 × 650 × 820 mm']},ci5plus:{i:'03 / 03',name:'CI5PLUS',desc:'自动上下料五轴干切设备，15 料盘自动切换，支持 24 小时连续加工与物联网功能选配。',spec:['0.02 mm','0–60,000 rpm','9 把','965 × 730 × 860 mm']}};
const labels=['加工精度','主轴转速','刀库容量','设备尺寸'];document.querySelectorAll('.product-tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.product-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const p=products[b.dataset.product];document.querySelector('.product-index').textContent=p.i;document.querySelector('#product-name').textContent=p.name;document.querySelector('#product-desc').textContent=p.desc;document.querySelector('#product-specs').innerHTML=p.spec.map((v,i)=>`<div><dt>${labels[i]}</dt><dd>${v}</dd></div>`).join('')});

const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>obs.observe(e));
const glow=document.querySelector('.cursor-glow');addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
