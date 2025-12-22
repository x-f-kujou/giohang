const sheetId = "1U7aPpLyUdDa1u1MOhX7i1nq4N-8UzvrlnGjLM6wI9hY";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

fetch(url)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const container = document.getElementById("products");
    container.innerHTML = "";

    if (!rows || rows.length === 0) {
      container.innerHTML = "<p>Không có sản phẩm</p>";
      return;
    }

    rows.forEach(r => {
      const id   = r.c[0]?.v || "";
      const ten  = r.c[1]?.v || "";
      const gia  = Number(r.c[2]?.v || 0);
      const anh  = r.c[3]?.v || "";

      container.innerHTML += `
        <div class="product">
          <img src="${anh}" alt="${ten}">
          <h3>${ten}</h3>
          <div class="price">${gia.toLocaleString("vi-VN")} ₫</div>
          <button onclick='addToCart(${JSON.stringify({
            id: id,
            name: ten,
            price: gia,
            image: anh
          })})'>
            Mua ngay
          </button>
        </div>
      `;
    });
  })
  .catch(err => {
    document.getElementById("products").innerHTML =
      "<p>Lỗi tải sản phẩm</p>";
    console.error(err);
  });
