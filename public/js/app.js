// Auto-detect API base URL (works for both local and production)
const API_BASE = '';
let currentDeleteId = null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupInputValidation();
});

// Setup real-time validation for price and quantity inputs
function setupInputValidation() {
    const priceInput = document.getElementById('productPrice');
    const quantityInput = document.getElementById('productQuantity');
    const updatePriceInput = document.getElementById('updatePrice');
    const updateQuantityInput = document.getElementById('updateQuantity');

    // Validate on input for add product form
    if (priceInput) {
        priceInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value < 0) {
                this.setCustomValidity('Price cannot be negative');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value < 0) {
                this.setCustomValidity('Quantity cannot be negative');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Validate on input for update form
    if (updatePriceInput) {
        updatePriceInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (this.value && value < 0) {
                this.setCustomValidity('Price cannot be negative');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    if (updateQuantityInput) {
        updateQuantityInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (this.value && value < 0) {
                this.setCustomValidity('Quantity cannot be negative');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Load all products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`);
        const products = await response.json();
        
        const productList = document.getElementById('productList');
        
        if (products.length === 0) {
            productList.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <p>No products yet. Add your first product!</p>
                </div>
            `;
        } else {
            productList.innerHTML = products.map((product, index) => `
                <div class="product-item">
                    <div class="product-info">
                        <span class="product-index">#${index + 1}</span>
                        <span class="product-name">${escapeHtml(product.name)}</span>
                        <span class="product-price">IDR ${parseFloat(product.price).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        <span class="product-quantity">Qty: ${product.quantity}</span>
                        <span class="product-id">${product._id}</span>
                        <span class="product-date created">${formatDate(product.createdAt)}</span>
                        <span class="product-date updated">${formatDate(product.updatedAt)}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-update" onclick='openUpdateModal("${product._id}", ${JSON.stringify(product.name)}, ${product.price}, ${product.quantity})'>Update</button>
                        <button class="btn btn-delete" onclick='openDeleteModal("${product._id}")'>Delete</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        document.getElementById('productList').innerHTML = `
            <div class="empty-state">
                <p style="color: #ef4444;">Failed to load products. Please check your API connection.</p>
            </div>
        `;
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Add product
async function handleAddProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value;
    const priceInput = document.getElementById('productPrice').value;
    const quantityInput = document.getElementById('productQuantity').value;
    
    const price = parseFloat(priceInput);
    const quantity = parseInt(quantityInput);

    // Validate non-negative values
    if (isNaN(price) || price < 0) {
        showNotification('Price cannot be negative', 'warning');
        return;
    }
    if (isNaN(quantity) || quantity < 0) {
        showNotification('Quantity cannot be negative', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price, quantity })
        });

        if (response.ok) {
            const product = await response.json();
            showNotification(
                `Product ID: ${product._id} are added successfully!`, 
                'success'
            );
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productQuantity').value = '';
            loadProducts();
        } else {
            const error = await response.json();
            showNotification(`Failed to add product: ${error.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showNotification('Failed to add product: Network error', 'error');
    }
}

// Open update modal
function openUpdateModal(id, name, price, quantity) {
    document.getElementById('updateProductId').value = id;
    document.getElementById('updateName').value = '';
    document.getElementById('updatePrice').value = '';
    document.getElementById('updateQuantity').value = '';
    document.getElementById('updateName').placeholder = `Current: ${name}`;
    document.getElementById('updatePrice').placeholder = `Current: IDR ${price}`;
    document.getElementById('updateQuantity').placeholder = `Current: ${quantity}`;
    document.getElementById('updateModal').classList.add('active');
}

// Close update modal
function closeUpdateModal() {
    document.getElementById('updateModal').classList.remove('active');
}

// Handle update product
async function handleUpdateProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('updateProductId').value;
    const name = document.getElementById('updateName').value;
    const priceInput = document.getElementById('updatePrice').value;
    const quantityInput = document.getElementById('updateQuantity').value;

    const updateData = {};
    if (name) updateData.name = name;
    
    // Validate and add price if provided
    if (priceInput) {
        const price = parseFloat(priceInput);
        if (isNaN(price) || price < 0) {
            showNotification('Price cannot be negative', 'warning');
            return;
        }
        updateData.price = price;
    }
    
    // Validate and add quantity if provided
    if (quantityInput) {
        const quantity = parseInt(quantityInput);
        if (isNaN(quantity) || quantity < 0) {
            showNotification('Quantity cannot be negative', 'warning');
            return;
        }
        updateData.quantity = quantity;
    }

    if (Object.keys(updateData).length === 0) {
        showNotification('No changes made', 'error');
        closeUpdateModal();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            const product = await response.json();
            showNotification(
                `Product ID: ${product._id} are updated successfully!`,
                'success'
            );         
            closeUpdateModal();
            loadProducts();
        } else {
            const error = await response.json();
            showNotification(`Failed to update product: ${error.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showNotification('Failed to update product: Network error', 'error');
    }
}

// Open delete modal
function openDeleteModal(id) {
    currentDeleteId = id;
    document.getElementById('deleteModal').classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    currentDeleteId = null;
    document.getElementById('deleteModal').classList.remove('active');
}

// Confirm delete
async function confirmDelete() {
    if (!currentDeleteId) return;

    try {
        const response = await fetch(`${API_BASE}/api/products/${currentDeleteId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification(
                `Product ID: ${currentDeleteId} are deleted successfully!`, 
                'success');
            closeDeleteModal();
            loadProducts();
        } else {
            const error = await response.json();
            showNotification(`Failed to delete product: ${error.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showNotification('Failed to delete product: Network error', 'error');
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

