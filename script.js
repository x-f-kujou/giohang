const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

/* ================= CART ================= */
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBadge();
}
function updateBadge() {
  const cart = getCart();
  const count = cart.reduce((s, p) => s + p.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}

/* ================= LOAD PRODUCTS ================= */
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();
  loadList();
  loadDetail();
  renderCart();
});

function loadList() {
  const box = document.getElementById("products");
  if (!box) return;

  fetch(CSV_URL).then(r=>r.text()).then(t=>{
    const rows = t.trim().split("\n").slice(1);
    rows.forEach(r=>{
      const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if(!c[0]||!c[1])return;

      const p={
        id:c[0].trim(),
        name:c[1].replace(/"/g,""),
        price:Number(c[2])||0,
        image:c[3]?.replace(/"/g,"")||"https://via.placeholder.com/300"
      };

      box.innerHTML+=`
      <div class="product">
        <a href="product.html?id=${p.id}">
          <img src="${p.image}">
          <h3>${p.name}</h3>
        </a>
        <div class="price">${p.price.toLocaleString("vi-VN")} ₫</div>
        <button onclick='addToCart(${JSON.stringify(p)})'>Thêm giỏ</button>
      </div>`;
    });
  });
}

/* ================= DETAIL ================= */
function loadDetail() {
  const box=document.getElementById("productDetail");
  if(!box)return;
  const id=new URLSearchParams(location.search).get("id");
  if(!id)return;

  fetch(CSV_URL).then(r=>r.text()).then(t=>{
    const rows=t.trim().split("\n").slice(1);
    rows.forEach(r=>{
      const c=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if(c[0].trim()===id){
        box.innerHTML=`
        <div class="product-detail">
          <img src="${c[3]}">
          <h2>${c[1]}</h2>
          <div class="price">${Number(c[2]).toLocaleString("vi-VN")} ₫</div>
          <button onclick='addToCart({id:"${id}",name:"${c[1]}",price:${c[2]},image:"${c[3]}"})'>
            Thêm vào giỏ
          </button>
        </div>`;
      }
    });
  });
}

/* ================= ADD CART ================= */
function addToCart(p){
  const cart=getCart();
  const f=cart.find(i=>i.id===p.id);
  if(f)f.qty++;
  else cart.push({...p,qty:1});
  saveCart(cart);
  alert("Đã thêm vào giỏ");
}

/* ================= CART PAGE ================= */
function renderCart(){
  const box=document.getElementById("cart");
  const totalBox=document.getElementById("total");
  if(!box)return;
  let t=0;
  box.innerHTML="";
  getCart().forEach(p=>{
    t+=p.price*p.qty;
    box.innerHTML+=`<p>${p.name} x${p.qty}</p>`;
  });
  totalBox.innerText=t.toLocaleString("vi-VN")+" ₫";
    }
