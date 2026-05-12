let allMovies = []; 
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    
    // Event listeners for basic interactions
    document.getElementById('toggle-cart').addEventListener('click', toggleCart);
    document.getElementById('confirm-booking').addEventListener('click', confirmRental);
});

async function fetchData() {
    try {
        const response = await fetch('movies.csv'); 
        const text = await response.text();
        
        const rows = text.split('\n').map(r => r.trim()).filter(r => r.length > 0);
        
        const headerCols = rows[0].split(',').map(h => h.trim());
        const headerRow = document.getElementById('table-header');
        headerRow.innerHTML = '';
        
        headerCols.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h.toUpperCase();
            headerRow.appendChild(th);
        });

        const actionTh = document.createElement('th');
        actionTh.textContent = "ACTION";
        headerRow.appendChild(actionTh);

        allMovies = rows.slice(1).map(row => {
            const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            return cols.map(c => c.replace(/"/g, '').trim());
        });

        renderTable(allMovies);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function applyFilters() {
    const titleVal = document.getElementById('filter-title').value.toLowerCase();
    const genreVal = document.getElementById('filter-genre').value.toLowerCase();
    const ratingVal = parseFloat(document.getElementById('filter-rating').value) || 0;

    const filteredMovies = allMovies.filter(row => {
        const title = (row[0] || "").toLowerCase();
        const genre = (row[1] || "").toLowerCase();
        const rating = parseFloat(row[4]) || 0;

        return title.includes(titleVal) && 
               genre.includes(genreVal) && 
               rating >= ratingVal;
    });

    renderTable(filteredMovies);
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

function renderTable(dataRows) {
    const tableBody = document.getElementById('table-body');
    const headers = ["Title", "Genre", "Year", "Duration", "Rating"];
    
    tableBody.innerHTML = '';

    dataRows.forEach(row => {
        const tr = document.createElement('tr');
        
        row.forEach((cell, index) => {
            const td = document.createElement('td');
            td.textContent = cell;
            td.setAttribute('data-label', headers[index] || "Info"); 
            tr.appendChild(td);
        });

        const actionTd = document.createElement('td');
        const btn = document.createElement('button');
        btn.textContent = "Add";
        btn.className = "add-btn";
        btn.onclick = () => addToCart(row);
        actionTd.appendChild(btn);
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    });
}

function addToCart(movie) {
    const movieTitle = movie[0];

    const alreadyInCart = cart.some(item => item.title === movieTitle);

    if (alreadyInCart) {
        alert("This movie is already in your cart!");
        return;
    }

    cart.push({
        title: movieTitle,
        genre: movie[1],
        year: movie[2]
    });
    
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const countLabel = document.getElementById('cart-count');
    const footer = document.getElementById('cart-footer');
    
    countLabel.textContent = cart.length;
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.style.padding = "10px";
        div.style.borderBottom = "1px solid #eee";
        div.innerHTML = `
            <strong>${item.title}</strong><br>
            <small>${item.year} | ${item.genre}</small><br>
            <button onclick="removeFromCart(${index})" style="color:red; cursor:pointer; background:none; border:none; padding:0;">Remove X</button>
        `;
        container.appendChild(div);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function confirmRental() {
    if (cart.length === 0) return;
    
    alert(`Successfully added ${cart.length}!`);
    
    cart = [];
    updateCartUI();
    toggleCart();
}