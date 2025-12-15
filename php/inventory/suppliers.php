<?php
session_start();
require_once '../config/database.php';
require_once '../models/Supplier.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$database = new Database();
$db = $database->getConnection();
$supplier = new Supplier($db);

$message = '';
$message_type = ''; // success or error
$edit_mode = false;
$current_supplier = null;

// Handle actions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['add_supplier'])) {
        $supplier->name = $_POST['name'];
        $supplier->contact_person = $_POST['contact_person'];
        $supplier->email = $_POST['email'];
        $supplier->phone = $_POST['phone'];
        $supplier->address = $_POST['address'];
        
        if ($supplier->create()) {
            $message = "Supplier added successfully!";
            $message_type = "success";
        } else {
            $message = "Failed to add supplier!";
            $message_type = "error";
        }
    }
    
    if (isset($_POST['update_supplier'])) {
        $supplier->id = $_POST['id'];
        $supplier->name = $_POST['name'];
        $supplier->contact_person = $_POST['contact_person'];
        $supplier->email = $_POST['email'];
        $supplier->phone = $_POST['phone'];
        $supplier->address = $_POST['address'];
        $supplier->status = $_POST['status'];
        
        if ($supplier->update()) {
            $message = "Supplier updated successfully!";
            $message_type = "success";
            $edit_mode = false;
        } else {
            $message = "Failed to update supplier!";
            $message_type = "error";
        }
    }
    
    if (isset($_POST['cancel_edit'])) {
        $edit_mode = false;
    }
}

// Handle GET actions
if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'edit':
            $supplier->id = $_GET['id'];
            if ($supplier->readOne()) {
                $edit_mode = true;
                $current_supplier = [
                    'id' => $supplier->id,
                    'name' => $supplier->name,
                    'contact_person' => $supplier->contact_person,
                    'email' => $supplier->email,
                    'phone' => $supplier->phone,
                    'address' => $supplier->address,
                    'status' => $supplier->status
                ];
            }
            break;
            
        case 'toggle_status':
            $supplier->id = $_GET['id'];
            if ($supplier->toggleStatus()) {
                $message = "Supplier status updated!";
                $message_type = "success";
            } else {
                $message = "Failed to update status!";
                $message_type = "error";
            }
            break;
            
        case 'delete':
            $supplier->id = $_GET['id'];
            if ($supplier->delete()) {
                $message = "Supplier deleted successfully!";
                $message_type = "success";
            } else {
                $message = "Failed to delete supplier!";
                $message_type = "error";
            }
            break;
    }
}

// Get all suppliers
$stmt = $supplier->read();
$suppliers = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suppliers - Fiora Atelier Inventory</title>
    <link rel="stylesheet" href="styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        .action-buttons {
            display: flex;
            gap: 5px;
        }
        .btn-sm {
            padding: 5px 10px;
            font-size: 12px;
        }
        .btn-warning {
            background-color: #ffc107;
            color: #000;
        }
        .btn-danger {
            background-color: #dc3545;
            color: white;
        }
        .btn-secondary {
            background-color: #6c757d;
            color: white;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 1000;
        }
        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 20px;
            width: 50%;
            border-radius: 5px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .close {
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <?php include 'header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Suppliers</h1>
            <p>Manage your suppliers and vendor information</p>
        </div>
        
        <?php if ($message): ?>
            <div class="alert alert-<?php echo $message_type === 'success' ? 'success' : 'error'; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <div class="suppliers-container">
            <!-- Add/Edit Supplier Form -->
            <div class="content-card">
                <div class="card-header">
                    <h3><?php echo $edit_mode ? 'Edit Supplier' : 'Add New Supplier'; ?></h3>
                </div>
                <div class="card-body">
                    <form method="POST" action="">
                        <?php if ($edit_mode): ?>
                            <input type="hidden" name="id" value="<?php echo $current_supplier['id']; ?>">
                        <?php endif; ?>
                        
                        <div class="form-group">
                            <label for="name">Supplier Name *</label>
                            <input type="text" name="name" id="name" 
                                   value="<?php echo $edit_mode ? htmlspecialchars($current_supplier['name']) : ''; ?>" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact_person">Contact Person *</label>
                            <input type="text" name="contact_person" id="contact_person"
                                   value="<?php echo $edit_mode ? htmlspecialchars($current_supplier['contact_person']) : ''; ?>" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" name="email" id="email"
                                   value="<?php echo $edit_mode ? htmlspecialchars($current_supplier['email']) : ''; ?>" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="phone">Phone *</label>
                            <input type="text" name="phone" id="phone"
                                   value="<?php echo $edit_mode ? htmlspecialchars($current_supplier['phone']) : ''; ?>" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="address">Address *</label>
                            <textarea name="address" id="address" rows="3" required><?php echo $edit_mode ? htmlspecialchars($current_supplier['address']) : ''; ?></textarea>
                        </div>
                        
                        <?php if ($edit_mode): ?>
                            <div class="form-group">
                                <label for="status">Status</label>
                                <select name="status" id="status">
                                    <option value="active" <?php echo ($current_supplier['status'] == 'active') ? 'selected' : ''; ?>>Active</option>
                                    <option value="inactive" <?php echo ($current_supplier['status'] == 'inactive') ? 'selected' : ''; ?>>Inactive</option>
                                </select>
                            </div>
                        <?php endif; ?>
                        
                        <div class="form-actions">
                            <?php if ($edit_mode): ?>
                                <button type="submit" name="update_supplier" class="btn-primary">Update Supplier</button>
                                <button type="submit" name="cancel_edit" class="btn-secondary">Cancel</button>
                            <?php else: ?>
                                <button type="submit" name="add_supplier" class="btn-primary">Add Supplier</button>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Suppliers List -->
            <div class="content-card">
                <div class="card-header">
                    <h3>All Suppliers (<?php echo count($suppliers); ?>)</h3>
                </div>
                <div class="card-body">
                    <?php if (empty($suppliers)): ?>
                        <p>No suppliers found. Add your first supplier above.</p>
                    <?php else: ?>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact Person</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($suppliers as $supplier): ?>
                                    <tr>
                                        <td>
                                            <strong><?php echo htmlspecialchars($supplier['name']); ?></strong>
                                            <br><small><?php echo htmlspecialchars(substr($supplier['address'], 0, 50)) . (strlen($supplier['address']) > 50 ? '...' : ''); ?></small>
                                        </td>
                                        <td><?php echo htmlspecialchars($supplier['contact_person']); ?></td>
                                        <td><?php echo htmlspecialchars($supplier['email']); ?></td>
                                        <td><?php echo htmlspecialchars($supplier['phone']); ?></td>
                                        <td>
                                            <span class="status-badge <?php echo $supplier['status']; ?>">
                                                <?php echo ucfirst($supplier['status']); ?>
                                            </span>
                                        </td>
                                    <td>
                                        <div class="action-buttons">
                                            <a href="?action=edit&id=<?php echo $supplier['id']; ?>" 
                                               class="btn-primary btn-sm">Edit</a>
                                            <a href="?action=toggle_status&id=<?php echo $supplier['id']; ?>" 
                                               class="btn-warning btn-sm" 
                                               onclick="return confirm('Toggle status for <?php echo addslashes($supplier['name']); ?>?')">
                                                <?php echo $supplier['status'] == 'active' ? 'Deactivate' : 'Activate'; ?>
                                            </a>
                                            <a href="#" 
                                               onclick="showDeleteModal(<?php echo $supplier['id']; ?>, '<?php echo addslashes($supplier['name']); ?>')" 
                                               class="btn-danger btn-sm">
                                                Delete
                                            </a>
                                        </div>
                                    </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h3>Confirm Delete</h3>
            <p id="deleteMessage">Are you sure you want to delete this supplier?</p>
            <div class="modal-actions">
                <button onclick="confirmDelete()" class="btn-danger">Delete</button>
                <button onclick="closeModal()" class="btn-secondary">Cancel</button>
            </div>
        </div>
    </div>

    <script>
        // JavaScript for confirmation dialogs
        function confirmAction(action, name) {
            return confirm(`Are you sure you want to ${action} ${name}?`);
        }
        
            let deleteUrl = '';

    function showDeleteModal(supplierId, supplierName) {
        deleteUrl = `?action=delete&id=${supplierId}`;
        document.getElementById('deleteMessage').textContent = `Are you sure you want to delete "${supplierName}"? This action cannot be undone.`;
        document.getElementById('deleteModal').style.display = 'block';
    }

    function confirmDelete() {
        window.location.href = deleteUrl;
    }

    function closeModal() {
        document.getElementById('deleteModal').style.display = 'none';
        deleteUrl = '';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('deleteModal');
        if (event.target == modal) {
            closeModal();
        }
    }
    </script>
</body>
</html>