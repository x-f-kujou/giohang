const sheetId = "1U7aPpLyUdDa1u1MOhX7i1nq4N-8UzvrlnGjLM6wI9hY";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

fetch(url)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const container = document.getElementById("products");
    container.innerHTML = "";

    rows.forEach(r => {
      const ten = r.c[1]?.v || "";
      const gia = r.c[2]?.v || "";
      const anh = r.c[3]?.v || "";
      const link = r.c[5]?.v || "#";

      container.innerHTML += `
        <div class="product">
          <img src="${anh}" alt="${ten}">
          <h3>${ten}</h3>
          <div class="price">${gia} ₫</div>
          <a href="${link}" target="_blank">Mua ngay</a>
        </div>
      `;
    });
  });
