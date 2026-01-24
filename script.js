function exportPDF() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  // ===============================
  // HITUNG TOTAL
  // ===============================
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

  const MODAL_PER_GALON = 4000;
  const totalModal = totalGalon * MODAL_PER_GALON;
  const profitOperasional =
    totalPemasukan - totalModal - totalInfaq - totalPengeluaran;

  const exportTime = new Date().toLocaleString("id-ID");

  // ===============================
  // HEADER PDF
  // ===============================
  doc.setFontSize(16);
  doc.text('Makmur Sentosa "MINUMO"', 14, 15);

  doc.setFontSize(10);
  doc.text(`Export: ${exportTime}`, 14, 22);

  // ===============================
  // TABEL DATA (TANPA KOLOM HAPUS)
  // ===============================
  const head = [[
    "No",
    "Nama Pelanggan",
    "Tanggal",
    "Jenis",
    "Jumlah Galon",
    "Harga",
    "Total",
    "Infaq"
  ]];

  const body = data.map((item, i) => ([
    i + 1,
    item.nama,
    item.tanggal,
    item.jenis,
    item.jumlah,
    `Rp ${item.harga.toLocaleString("id-ID")}`,
    `Rp ${(item.jumlah * item.harga).toLocaleString("id-ID")}`,
    `Rp ${item.potongan.toLocaleString("id-ID")}`
  ]));

  doc.autoTable({
    startY: 30,
    head: head,
    body: body,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [33, 150, 243], // BIRU MINUMO
      textColor: 255,
      fontStyle: "bold",
      halign: "center"
    },
    bodyStyles: {
      halign: "center"
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // ===============================
  // RINGKASAN BAWAH
  // ===============================
  let y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.text(`Total Pemasukan     : Rp ${totalPemasukan.toLocaleString("id-ID")}`, 14, y);
  doc.text(`Total Pengeluaran   : Rp ${totalPengeluaran.toLocaleString("id-ID")}`, 14, y + 6);
  doc.text(`Saldo Akhir         : Rp ${(totalPemasukan - totalPengeluaran).toLocaleString("id-ID")}`, 14, y + 12);
  doc.text(`Total Galon Terjual : ${totalGalon}`, 14, y + 18);
  doc.text(`Total Modal Galon   : Rp ${totalModal.toLocaleString("id-ID")}`, 14, y + 24);
  doc.text(`Akumulasi Infaq     : Rp ${totalInfaq.toLocaleString("id-ID")}`, 14, y + 30);
  doc.text(`Profit Operasional  : Rp ${profitOperasional.toLocaleString("id-ID")}`, 14, y + 36);

  // ===============================
  // SIMPAN PDF
  // ===============================
  doc.save("Pembukuan_MINUMO_Lengkap.pdf");
}
