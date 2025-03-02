// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentSection = 'dashboard';
    let products = [];
    let categories = [];
    let currentProductId = null;
    let deleteItemId = null;
    let deleteItemType = null;
    
    // DOM Elements
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const adminSections = document.querySelectorAll('.admin-section');
    const addProductBtns = document.querySelectorAll('#add-product-btn, #add-product-btn-2');
    const saveProductBtn = document.getElementById('save-product-btn');
    const productForm = document.getElementById('product-form');
    const productSaleCheckbox = document.getElementById('product-sale');
    const saleOptionDiv = document.querySelector('.sale-option');
    const productImageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    const productsTableBody = document.getElementById('products-table-body');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const topSellerToggle = document.getElementById('topSeller-toggle');
    const newestToggle = document.getElementById('newest-toggle');
    const productModal = new bootstrap.Modal(document.getElementById('product-modal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('delete-confirm-modal'));
    
    // Initialize the admin panel
    initAdminPanel();
    
    // Event Listeners
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.id.replace('nav-', '');
            showSection(targetSection);
        });
    });
    
    addProductBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openProductModal();
        });
    });
    
    saveProductBtn.addEventListener('click', saveProduct);
    
    productSaleCheckbox.addEventListener('change', function() {
        if (this.checked) {
            saleOptionDiv.classList.remove('d-none');
        } else {
            saleOptionDiv.classList.add('d-none');
        }
    });
    
    productImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    confirmDeleteBtn.addEventListener('click', function() {
        if (deleteItemType === 'product') {
            deleteProduct(deleteItemId);
        } else if (deleteItemType === 'category') {
            deleteCategory(deleteItemId);
        }
        deleteModal.hide();
    });
    
    topSellerToggle.addEventListener('change', function() {
        toggleSectionVisibility('topSeller-tag', this.checked);
    });
    
    newestToggle.addEventListener('change', function() {
        toggleSectionVisibility('newest-tag', this.checked);
    });
    
    // Functions
    function initAdminPanel() {
        // Load mock data for demonstration
        loadMockData();
        
        // Update dashboard stats
        updateDashboardStats();
        
        // Populate products table
        populateProductsTable();
        
        // Initialize charts
        initCharts();
    }
    
    function showSection(sectionName) {
        currentSection = sectionName;
        
        // Update navigation
        navLinks.forEach(link => {
            if (link.id === 'nav-' + sectionName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Show/hide sections
        adminSections.forEach(section => {
            if (section.id === sectionName + '-section') {
                section.classList.remove('d-none');
            } else {
                section.classList.add('d-none');
            }
        });
    }
    
    function loadMockData() {
        // Mock product data
        products = [
            {
                id: 'prod-001',
                name: 'Fancy Product',
                price: 60.00,
                priceRange: {min: 40.00, max: 80.00},
                stock: 15,
                categories: [],
                onSale: false,
                salePrice: null,
                material: 'Cotton',
                description: 'High-quality fancy product for all occasions.',
                image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
                sku: 'FP-001',
                viewOptions: true
            },
            {
                id: 'prod-002',
                name: 'Special Item',
                price: 20.00,
                stock: 25,
                categories: ['best-sellers'],
                onSale: true,
                salePrice: 18.00,
                material: 'Silk',
                description: 'A special item with five-star reviews.',
                image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
                sku: 'SI-001',
                rating: 5
            },
            {
                id: 'prod-003',
                name: 'Sale Item',
                price: 50.00,
                stock: 10,
                categories: [],
                onSale: true,
                salePrice: 25.00,
                material: 'Linen',
                description: 'Item currently on sale at a great price.',
                image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
                sku: 'SA-001'
            },
            {
                id: 'prod-004',
                name: 'Popular Item',
                price: 40.00,
                stock: 0,
                categories: ['best-sellers'],
                onSale: false,
                salePrice: null,
                material: 'Polyester',
                description: 'A very popular item with our customers.',
                image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
                sku: 'PI-001',
                rating: 5
            },
            {
                id: 'prod-005',
                name: 'Another Sale Item',
                price: 50.00,
                stock: 8,
                categories: [],
                onSale: true,
                salePrice: 25.00,
                material: 'Wool',
                description: 'Another fantastic item currently on sale.',
                image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
                sku: 'SA-002'
            },
            {
                id: 'prod-006',
                name: 'Premium Product',
                price: 200.00,
                priceRange: {min: 120.00, max: 280.00},
                stock: 5,
                categories: [],
                onSale: false,
                salePrice: null,
                material: 'Leather',
                description: 'Premium quality product with luxury materials.',
                image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
                sku: 'PP-001',
                viewOptions: true
            },
            {
                id: 'prod-007',
                name: 'New Special Item',
                price: 20.00,
                stock: 30,
                categories: ['newest', 'best-sellers'],
                onSale: true,
                salePrice: 18.00,
                material: 'Canvas',
                description: 'New special item with great customer reviews.',
                image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
                sku: 'NSI-001',
                rating: 5
            },
            {
                id: 'prod-008',
                name: 'New Popular Item',
                price: 40.00,
                stock: 20,
                categories: ['newest'],
                onSale: false,
                salePrice: null,
                material: 'Mixed',
                description: 'New popular item that customers love.',
                image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
                sku: 'NPI-001',
                rating: 5
            }
        ];
        
        // Mock categories
        categories = [
            {
                id: 'best-sellers',
                name: 'Best Sellers',
                description: 'Most popular products that our customers love',
                visible: true
            },
            {
                id: 'newest',
                name: 'Newest',
                description: 'Our latest arrivals and freshest products',
                visible: true
            }
        ];
    }
    
    function updateDashboardStats() {
        // Count products
        const totalProducts = products.length;
        const inStock = products.filter(p => p.stock > 0).length;
        const onSale = products.filter(p => p.onSale).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        
        // Update dashboard stats
        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('in-stock').textContent = inStock;
        document.getElementById('on-sale').textContent = onSale;
        document.getElementById('out-of-stock').textContent = outOfStock;
    }
    
    function populateProductsTable() {
        productsTableBody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            
            // Determine price display format
            let priceDisplay;
            if (product.priceRange) {
                priceDisplay = `$${product.priceRange.min.toFixed(2)} - $${product.priceRange.max.toFixed(2)}`;
            } else if (product.onSale) {
                priceDisplay = `<span class="text-muted text-decoration-line-through">$${product.price.toFixed(2)}</span> $${product.salePrice.toFixed(2)}`;
            } else {
                priceDisplay = `$${product.price.toFixed(2)}`;
            }
            
            // Determine stock status
            let stockStatus;
            if (product.stock === 0) {
                stockStatus = '<span class="badge bg-danger">Out of Stock</span>';
            } else if (product.stock < 10) {
                stockStatus = `<span class="badge bg-warning text-dark">Low: ${product.stock}</span>`;
            } else {
                stockStatus = `<span class="badge bg-success">${product.stock}</span>`;
            }
            
            // Create category badges
            const categoryBadges = product.categories.map(cat => {
                const category = cat === 'best-sellers' ? 'Best Sellers' : 'Newest';
                return `<span class="badge bg-info">${category}</span>`;
            }).join(' ');
            
            // Sale badge
            const saleBadge = product.onSale ? '<span class="badge bg-warning text-dark">Sale</span>' : '';
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" class="img-thumbnail"></td>
                <td>${product.name}</td>
                <td>${priceDisplay}</td>
                <td>${stockStatus}</td>
                <td>${categoryBadges || '-'}</td>
                <td>${saleBadge || '-'}</td>
                <td>
                    <div class="btn-group action-buttons">
                        <button class="btn btn-sm btn-primary edit-product" data-id="${product.id}">
                            <i class="bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-success view-product" data-id="${product.id}">
                            <i class="bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                            <i class="bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            productsTableBody.appendChild(row);
        });
        
        // Add event listeners to the buttons
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                openProductModal(productId);
            });
        });
        
        document.querySelectorAll('.view-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                viewProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                confirmDelete(productId, 'product');
            });
        });
    }
    
    function openProductModal(productId = null) {
        // Reset form
        productForm.reset();
        saleOptionDiv.classList.add('d-none');
        imagePreview.src = 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg';
        
        // Set modal title
        const modalTitle = document.getElementById('product-modal-label');
        
        if (productId) {
            // Edit existing product
            currentProductId = productId;
            modalTitle.textContent = 'Edit Product';
            
            // Find the product
            const product = products.find(p => p.id === productId);
            if (product) {
                // Fill form with product data
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-stock').value = product.stock;
                document.getElementById('product-sku').value = product.sku || '';
                document.getElementById('product-material').value = product.material || '';
                document.getElementById('product-description').value = product.description || '';
                
                // Handle sale option
                if (product.onSale) {
                    document.getElementById('product-sale').checked = true;
                    document.getElementById('product-sale-price').value = product.salePrice;
                    saleOptionDiv.classList.remove('d-none');
                }
                
                // Handle categories
                document.getElementById('category-best-sellers').checked = product.categories.includes('best-sellers');
                document.getElementById('category-newest').checked = product.categories.includes('newest');
                
                // Show product image
                imagePreview.src = product.image;
            }
        } else {
            // Add new product
            currentProductId = null;
            modalTitle.textContent = 'Add New Product';
        }
        
        // Show the modal
        productModal.show();
    }
    
    function saveProduct() {
        // Get form values
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const sku = document.getElementById('product-sku').value;
        const material = document.getElementById('product-material').value;
        const description = document.getElementById('product-description').value;
        const onSale = document.getElementById('product-sale').checked;
        const salePrice = onSale ? parseFloat(document.getElementById('product-sale-price').value) : null;
        
        // Get categories
        const categories = [];
        if (document.getElementById('category-best-sellers').checked) {
            categories.push('best-sellers');
        }
        if (document.getElementById('category-newest').checked) {
            categories.push('newest');
        }
        
        // Get image URL (in a real app, this would be handled by file upload)
        const image = imagePreview.src;
        
        if (currentProductId) {
            // Update existing product
            const productIndex = products.findIndex(p => p.id === currentProductId);
            if (productIndex !== -1) {
                products[productIndex] = {
                    ...products[productIndex],
                    name,
                    price,
                    stock,
                    sku,
                    material,
                    description,
                    onSale,
                    salePrice,
                    categories,
                    image
                };
            }
        } else {
            // Add new product
            const newProduct = {
                id: 'prod-' + (Math.floor(Math.random() * 10000)).toString().padStart(3, '0'),
                name,
                price,
                stock,
                sku,
                material,
                description,
                onSale,
                salePrice,
                categories,
                image
            };
            
            products.push(newProduct);
            
            // In a real app, we would also generate the HTML file for this product
            generateProductHTML(newProduct);
        }
        
        // Update UI
        updateDashboardStats();
        populateProductsTable();
        initCharts();
        
        // Close the modal
        productModal.hide();
    }
    
    function generateProductHTML(product) {
        // This function would generate an HTML file for a product in a real application
        console.log(`Generated HTML file for ${product.name}`);
        
        // Example of HTML content that would be created
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="${product.description}" />
    <meta name="author" content="" />
    <title>${product.name} - Shop</title>
    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
    <!-- Bootstrap icons-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
    <!-- Core theme CSS (includes Bootstrap)-->
    <link href="css/styles.css" rel="stylesheet" />
</head>
<body>
    <!-- Navigation-->
    <!-- Same as index.html -->
    
    <!-- Product section-->
    <section class="py-5">
        <div class="container px-4 px-lg-5 my-5">
            <div class="row gx-4 gx-lg-5 align-items-center">
                <div class="col-md-6"><img class="card-img-top mb-5 mb-md-0" src="${product.image}" alt="${product.name}" /></div>
                <div class="col-md-6">
                    <h1 class="display-5 fw-bolder">${product.name}</h1>
                    <div class="fs-5 mb-5">
                        ${product.onSale ? 
                          `<span class="text-decoration-line-through">$${product.price.toFixed(2)}</span>
                           <span>$${product.salePrice.toFixed(2)}</span>` 
                          : `<span>$${product.price.toFixed(2)}</span>`}
                    </div>
                    <p class="lead">${product.description}</p>
                    <div class="d-flex">
                        <input class="form-control text-center me-3" id="inputQuantity" type="num" value="1" style="max-width: 3rem" />
                        <button class="btn btn-outline-dark flex-shrink-0" type="button">
                            <i class="bi-cart-fill me-1"></i>
                            Add to cart
                        </button>
                    </div>
                    <div class="mt-4">
                        <p class="mb-0"><strong>SKU:</strong> ${product.sku}</p>
                        <p class="mb-0"><strong>Material:</strong> ${product.material}</p>
                        <p class="mb-0"><strong>In Stock:</strong> ${product.stock}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Related items section-->
    <!-- Similar to index.html -->
    
    <!-- Footer-->
    <!-- Same as index.html -->
    
    <!-- Bootstrap core JS-->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Core theme JS-->
    <script src="js/scripts.js"></script>
</body>
</html>
        `;
        
        // In a real application, we would save this to a file
        return htmlContent;
    }
    
    function viewProduct(productId) {
        // In a real application, this would redirect to the product page
        const product = products.find(p => p.id === productId);
        if (product) {
            alert(`Viewing product: ${product.name}\nIn a real application, this would open the product page.`);
        }
    }
    
    function confirmDelete(itemId, itemType) {
        deleteItemId = itemId;
        deleteItemType = itemType;
        deleteModal.show();
    }
    
    function deleteProduct(productId) {
        // Find the product index
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            // Remove the product
            products.splice(productIndex, 1);
            
            // Update UI
            updateDashboardStats();
            populateProductsTable();
            initCharts();
        }
    }
    
    function deleteCategory(categoryId) {
        // Find the category index
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        if (categoryIndex !== -1) {
            // Remove the category
            categories.splice(categoryIndex, 1);
            
            // Update products that had this category
            products.forEach(product => {
                product.categories = product.categories.filter(cat => cat !== categoryId);
            });
            
            // Update UI
            populateProductsTable();
            // Refresh categories list (not implemented in this example)
        }
    }
    
    function toggleSectionVisibility(sectionId, isVisible) {
        // In a real application, this would update the actual HTML
        console.log(`${sectionId} is now ${isVisible ? 'visible' : 'hidden'}`);
        
        // Example of how it might be implemented:
        // const section = document.getElementById(sectionId);
        // if (section) {
        //     section.style.display = isVisible ? 'block' : 'none';
        // }
        
        // Alternatively, it could add/remove a class:
        // if (section) {
        //     if (isVisible) {
        //         section.classList.remove('hidden');
        //     } else {
        //         section.classList.add('hidden');
        //     }
        // }
    }
    
    function initCharts() {
        // Product Performance Chart
        const performanceCtx = document.getElementById('product-performance-chart').getContext('2d');
        
        // Get top 5 products by stock
        const topProducts = [...products]
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 5);
        
        const performanceChart = new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: topProducts.map(p => p.name),
                datasets: [{
                    label: 'Stock Level',
                    data: topProducts.map(p => p.stock),
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Category Distribution Chart
        const categoryCtx = document.getElementById('category-distribution-chart').getContext('2d');
        
        // Count products by category
        const bestSellersCount = products.filter(p => p.categories.includes('best-sellers')).length;
        const newestCount = products.filter(p => p.categories.includes('newest')).length;
        const uncategorizedCount = products.filter(p => p.categories.length === 0).length;
        
        const categoryChart = new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: ['Best Sellers', 'Newest', 'Uncategorized'],
                datasets: [{
                    data: [bestSellersCount, newestCount, uncategorizedCount],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
        
        // Populate stock levels table
        const stockTable = document.getElementById('stock-levels-table').querySelector('tbody');
        stockTable.innerHTML = '';
        
        // Sort products by stock level (lowest first)
        const sortedProducts = [...products].sort((a, b) => a.stock - b.stock);
        
        sortedProducts.forEach(product => {
            const row = document.createElement('tr');
            
            let statusClass, statusText;
            if (product.stock === 0) {
                statusClass = 'text-danger';
                statusText = 'Out of Stock';
            } else if (product.stock < 10) {
                statusClass = 'text-warning';
                statusText = 'Low Stock';
            } else {
                statusClass = 'text-success';
                statusText = 'In Stock';
            }
            
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.stock}</td>
                <td class="${statusClass}">${statusText}</td>
                <td>
                    <button class="btn btn-sm btn-primary update-stock" data-id="${product.id}">
                        Update Stock
                    </button>
                </td>
            `;
            
            stockTable.appendChild(row);
        });
        
        // Add event listeners to update stock buttons
        document.querySelectorAll('.update-stock').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id === productId);
                if (product) {
                    const newStock = prompt(`Update stock for ${product.name}:`, product.stock);
                    if (newStock !== null && !isNaN(newStock)) {
                        product.stock = parseInt(newStock);
                        updateDashboardStats();
                        populateProductsTable();
                        initCharts();
                    }
                }
            });
        });
    }
});