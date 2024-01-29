const daftarBuku = [];
const riwayatBuku = "LIST_BUKU";

function masukanBuku() {
  const judulBuku = document.getElementById("judulBuku").value;
  const penulisBuku = document.getElementById("penulisBuku").value;
  const tahunBuku = document.getElementById("tahun").value;

  const idBuku = DataIdBuku();
  const objectBuku = dataBuku(idBuku, judulBuku, penulisBuku, tahunBuku, false);

  daftarBuku.push(objectBuku);
  dataTersimpan();

  document.dispatchEvent(new Event(render));
}

function dataBuku(idBuku, judulBuku, penulisBuku, tahunBuku, sudahDiBaca) {
  return {
    idBuku,
    judulBuku,
    penulisBuku,
    tahunBuku,
    sudahDiBaca,
  };
}

function DataIdBuku() {
  return +new Date();
}

function checkStorage() {
  return typeof Storage !== "undefined";
}

function dataTersimpan() {
  if (checkStorage()) {
    localStorage.setItem(riwayatBuku, JSON.stringify(daftarBuku));
  } else {
    return [];
  }
}

function ambilDataLokalS() {
  const dataLokal = localStorage.getItem(riwayatBuku);
  const data = JSON.parse(dataLokal);

  if (data !== null) {
    for (const buku of data) {
      daftarBuku.push(buku);
    }
  }
  document.dispatchEvent(new Event(render));
}

function bukuBelumDibaca(belumDibaca) {
  const targetBuku = mencariBuku(belumDibaca);
  if (targetBuku == null) return;
  targetBuku.sudahDiBaca = false;

  dataTersimpan();
  document.dispatchEvent(new Event(render));
}

function finished(bukuDiBaca) {
  const selesai = cariBuku(bukuDiBaca);
  if (selesai == null) {
    return;
  }
  selesai.sudahDiBaca = true;
  dataTersimpan();
  document.dispatchEvent(new Event(render));
}

function hapusBukuDariList(bukuDiHapus) {
  const targetBuku = mencariIndex(bukuDiHapus);

  if (targetBuku === -1) return;

  daftarBuku.splice(targetBuku, 1);
  dataTersimpan();
  document.dispatchEvent(new Event(render));
}

function mencariBuku(belumDiBaca) {
  for (const itemBuku of daftarBuku) {
    if (itemBuku.idBuku == belumDiBaca.idBuku) {
      return itemBuku;
    }
  }
}

function mencariIndex(bukuDiHapus) {
  for (const index in daftarBuku) {
    if (daftarBuku[index].idBuku === bukuDiHapus.idBuku) {
      return index;
    }
  }
  return -1;
}

function cariBuku(buku) {
  for (const itemBuku of daftarBuku) {
    if (itemBuku == buku) {
      return itemBuku;
    }
  }
  return null;
}

function masukanKeRakBuku(buku) {
  const judulBuku = document.createElement("h3");
  judulBuku.innerText = buku.judulBuku;

  const penulisBuku = document.createElement("h4");
  penulisBuku.innerText = buku.penulisBuku;

  const tahunBuku = document.createElement("p");
  tahunBuku.innerText = buku.tahunBuku;

  const deskContainer = document.createElement("div");
  deskContainer.classList.add("buku");
  deskContainer.append(judulBuku, penulisBuku, tahunBuku);

  const hapusBuku = document.createElement("button");
  hapusBuku.innerText = "remove";

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("button");

  buttonDiv.appendChild(hapusBuku);

  hapusBuku.addEventListener("click", function () {
    hapusBukuDariList(buku);
  });

  const container = document.createElement("div");
  container.classList.add("listBuku");

  container.append(deskContainer, buttonDiv);

  if (buku.sudahDiBaca) {
    const belumDiBaca = document.createElement("button");
    belumDiBaca.classList.add("undo");
    belumDiBaca.innerText = "undo";

    belumDiBaca.addEventListener("click", function () {
      bukuBelumDibaca(buku);
    });
    buttonDiv.append(belumDiBaca);

    container.append(buttonDiv);
  } else {
    const sudahDiBaca = document.createElement("button");
    sudahDiBaca.innerText = "SELESAI";

    sudahDiBaca.addEventListener("click", function () {
      finished(buku);
    });

    buttonDiv.appendChild(sudahDiBaca);
    container.append(buttonDiv);
  }

  return container;
}

document.addEventListener("DOMContentLoaded", function () {
  const masukanDaftarBuku = document.getElementById("tambah");
  masukanDaftarBuku.addEventListener("submit", function (e) {
    masukanBuku();
    e.preventDefault();
  });

  if (checkStorage()) {
    ambilDataLokalS();
  }
});

document.addEventListener(render, function () {
  const unreaded = document.getElementById("unreaded");
  const readed = document.getElementById("readed");
  unreaded.innerText = "";
  readed.innerText = "";

  for (const itemBuku of daftarBuku) {
    const buku = masukanKeRakBuku(itemBuku);
    if (!itemBuku.sudahDiBaca) {
      unreaded.append(buku);
    } else {
      readed.append(buku);
    }
  }
});
