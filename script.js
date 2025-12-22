const sheetId = "DAN_ID_SHEET_CUA_BAN";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

fetch(url)
  .then(r => r.text())
  .then(t => {
    const json = JSON.parse(t.substring(47, t.length - 2));
    const rows = json.table.rows;
    const box = document.getElementById("products");
    box.innerHTML = "";

    rows.forEach(r => {
      if (!r.c[1]) return;

      const ten = r.c[1].v;
      const gia = Number(r.c[2].v);
      const anh = r.c[3].v;

      box.innerHTML += `
        <div class="product">
          <img src="${anh}">
          <h3>${ten}</h3>
          <p>${gia.toLocaleString()} ₫</p>
          <button onclick='addToCart(${JSON.stringify({
            id: ten,
            name: ten,
            price: gia,
            image: anh
          })})'>Mua ngay</button>
        </div>
      `;
    });
  });
