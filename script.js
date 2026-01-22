let data = [];

function tambahData() {
  const nama = document.getElementById("namaPelanggan").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  const harga = parseInt(document.getElementById("harga").value) || 0;

  const potongan = jumlah * 500;

  if (!nama || !tanggal || jumlah <= 0 || harga <= 0) {
    alert("Isi semua data dengan benar!");
    return;
  }

  data.push({ nama, tanggal, jenis, jumlah, harga, potongan });

  renderTable();
  updateInfo();

  // reset input biar enak input berikutnya
  document.getElementById("namaPelanggan").value = "";
  document.getElementById("jumlah").value = "";
  document.getElementById("harga").value = "";
}

function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.tanggal}</td>
      <td>${item.jenis}</td>
      <td>${item.jumlah}</td>
      <td>${item.harga}</td>
      <td>${item.potongan}</td>
      <td><button onclick="hapusBaris(${index})">Hapus</button></td>
    `;

    tbody.appendChild(row);
  });
}

function hapusBaris(index) {
  data.splice(index, 1);
  renderTable();
  updateInfo();
}

function hapusSemua() {
  if (confirm("Yakin mau hapus semua data?")) {
    data = [];
    renderTable();
    updateInfo();
  }
}

function updateInfo() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalInfaq = 0;

  data.forEach((item) => {
    const total = item.jumlah * item.harga;

    if (item.jenis === "Pemasukan") totalPemasukan += total;
    else totalPengeluaran += total;

    totalInfaq += item.potongan;
  });

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  document.getElementById("totalPemasukan").textContent = totalPemasukan;
  document.getElementById("totalPengeluaran").textContent = totalPengeluaran;
  document.getElementById("saldoAkhir").textCon
