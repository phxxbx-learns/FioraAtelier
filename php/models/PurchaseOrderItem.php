<?php
class PurchaseOrderItem {
    private $conn;
    private $table_name = "purchase_order_items";

    public $id;
    public $purchase_order_id;
    public $product_id;
    public $quantity;
    public $unit_price;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET purchase_order_id=:purchase_order_id, 
                      product_id=:product_id, 
                      quantity=:quantity, 
                      unit_price=:unit_price"; // Changed to unit_price

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->purchase_order_id = htmlspecialchars(strip_tags($this->purchase_order_id));
        $this->product_id = htmlspecialchars(strip_tags($this->product_id));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->unit_price = htmlspecialchars(strip_tags($this->unit_price));

        // Bind values
        $stmt->bindParam(":purchase_order_id", $this->purchase_order_id);
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":unit_price", $this->unit_price);

        if($stmt->execute()) {
            // Update the total amount in purchase_orders table
            $this->updateOrderTotal();
            return true;
        }
        return false;
    }

    private function updateOrderTotal() {
        $query = "UPDATE purchase_orders po
                  SET total_amount = (
                      SELECT SUM(quantity * unit_price) 
                      FROM purchase_order_items 
                      WHERE purchase_order_id = :order_id
                  )
                  WHERE id = :order_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":order_id", $this->purchase_order_id);
        $stmt->execute();
    }

    public function readByOrder($order_id) {
        $query = "SELECT poi.*, p.name as product_name, 
                         (poi.quantity * poi.unit_price) as item_total
                  FROM " . $this->table_name . " poi
                  LEFT JOIN products p ON poi.product_id = p.id
                  WHERE poi.purchase_order_id = ?
                  ORDER BY poi.id ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $order_id);
        $stmt->execute();

        return $stmt;
    }

    // New method to get total for an order
    public function getOrderTotal($order_id) {
        $query = "SELECT SUM(quantity * unit_price) as order_total
                  FROM " . $this->table_name . "
                  WHERE purchase_order_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $order_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['order_total'] ?? 0;
    }
}
?>