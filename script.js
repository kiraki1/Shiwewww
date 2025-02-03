document.addEventListener("DOMContentLoaded", loadGallery);

let currentPage = 0;
const itemsPerPage = 3;

function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const titleInput = document.getElementById('imageTitle');

    if (fileInput.files.length === 0) {
        alert("กรุณาเลือกภาพก่อนอัปโหลด");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const imageData = {
            id: Date.now(),
            src: event.target.result,
            title: titleInput.value.trim() !== "" ? titleInput.value.trim() : "ไม่มีชื่อภาพ"
        };

        saveImage(imageData);
        displayGallery();
    };

    reader.readAsDataURL(file);

    fileInput.value = "";
    titleInput.value = "";
}

function saveImage(imageData) {
    let images = JSON.parse(localStorage.getItem("galleryImages")) || [];
    images.push(imageData);
    localStorage.setItem("galleryImages", JSON.stringify(images));
}

function loadGallery() {
    displayGallery();
}

function displayGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = "";

    let images = JSON.parse(localStorage.getItem("galleryImages")) || [];
    let start = currentPage * itemsPerPage;
    let end = start + itemsPerPage;
    let pageImages = images.slice(start, end);

    pageImages.forEach(imageData => {
        const container = document.createElement('div');
        container.classList.add('image-container');

        const imgElement = document.createElement('img');
        imgElement.src = imageData.src;
        imgElement.onclick = function() {
            openModal(imageData.src, imageData.title);
        };

        const titleElement = document.createElement('p');
        titleElement.textContent = imageData.title; // ⭐ แสดงชื่อที่กรอกแน่นอน ⭐

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "🗑️ ลบภาพ";
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = function() {
            deleteImage(imageData.id);
        };

        container.appendChild(imgElement);
        container.appendChild(titleElement);
        container.appendChild(deleteButton);

        gallery.appendChild(container);
    });
}

function deleteImage(imageId) {
    let images = JSON.parse(localStorage.getItem("galleryImages")) || [];
    let updatedImages = images.filter(img => img.id !== imageId);
    localStorage.setItem("galleryImages", JSON.stringify(updatedImages));
    displayGallery();
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        displayGallery();
    }
}

function nextPage() {
    let images = JSON.parse(localStorage.getItem("galleryImages")) || [];
    if ((currentPage + 1) * itemsPerPage < images.length) {
        currentPage++;
        displayGallery();
    }
}

function openModal(src, title) {
    document.getElementById('modal').style.display = "flex";
    document.getElementById('modalImg').src = src;
    document.getElementById('modalCaption').textContent = title;
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}
