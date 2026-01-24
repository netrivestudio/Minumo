// ===============================
// LOAD DATA
// ===============================
let data = JSON.parse(localStorage.getItem("minumoData")) || [];

// ===============================
// KONSTANTA BISNIS
// ===============================
const MODAL_PER_GALON = 4000;
const INFAQ_PER_GALON = 500;

// ===============================
// SIMPAN DATA
// ===============================
function simpanData() {
  localStorage.setItem("minumoData", JSON.stringify(data));
}

// ===============================
// TAMBAH DATA
// ===============================
function tambahData() {
  const nama = document.getElementById("namaPelanggan").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  const harga = parseInt(document.getElementById("harga").value) || 0;

  if (!nama || !tanggal || jumlah <= 0 || harga <= 0) {
    alert("Isi semua data dengan benar!");
    return;
  }

  const potongan = jenis === "Pemasukan" ? jumlah * INFAQ_PER_GALON : 0;

  data.push({ nama, tanggal, jenis, jumlah, harga, potongan });
  simpanData();
  renderTable();
  updateInfo();

  document.getElementById("namaPelanggan").value = "";
  document.getElementById("jumlah").value = "";
  document.getElementById("harga").value = "";
}

// ===============================
// RENDER TABEL
// ===============================
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
      <td>${item.harga.toLocaleString("id-ID")}</td>
      <td>${item.potongan.toLocaleString("id-ID")}</td>
      <td><button onclick="hapusBaris(${index})">Hapus</button></td>
    `;
    tbody.appendChild(row);
  });
}

// ===============================
// HAPUS BARIS
// ===============================
function hapusBaris(index) {
  data.splice(index, 1);
  simpanData();
  renderTable();
  updateInfo();
}

// ===============================
// HAPUS SEMUA
// ===============================
function hapusSemua() {
  if (confirm("Yakin mau hapus semua data?")) {
    data = [];
    simpanData();
    renderTable();
    updateInfo();
  }
}

// ===============================
// HITUNG TOTAL & PROFIT
// ===============================
function updateInfo() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalInfaq = 0;
  let totalGalon = 0;

  data.forEach(item => {
    const total = item.jumlah * item.harga;

    if (item.jenis === "Pemasukan") {
      totalPemasukan += total;
      totalGalon += item.jumlah;
      totalInfaq += item.potongan;
    } else {
      totalPengeluaran += total;
    }
  });

  const totalModal = totalGalon * MODAL_PER_GALON;
  const profitOperasional =
    totalPemasukan - totalModal - totalInfaq - totalPengeluaran;

  // TAMPILKAN KE LAYAR
  document.getElementById("totalPemasukan").textContent =
    totalPemasukan.toLocaleString("id-ID");

  document.getElementById("totalPengeluaran").textContent =
    totalPengeluaran.toLocaleString("id-ID");

  document.getElementById("saldoAkhir").textContent =
    (totalPemasukan - totalPengeluaran).toLocaleString("id-ID");

  document.getElementById("totalInfaq").textContent =
    totalInfaq.toLocaleString("id-ID");

  document.getElementById("totalGalon").textContent =
    totalGalon.toLocaleString("id-ID");

  document.getElementById("totalModal").textContent =
    totalModal.toLocaleString("id-ID");

  document.getElementById("profitOperasional").textContent =
    profitOperasional.toLocaleString("id-ID");
}

// ===============================
// LOAD AWAL
// ===============================
renderTable();
updateInfo();
