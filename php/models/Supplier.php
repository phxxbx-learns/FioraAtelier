<?php
class Supplier {
    private $conn;
    private $table_name = "suppliers";

    public $id;
    public $name;
    public $contact_person;
    public $email;
    public $phone;
    public $address;
    public $status;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all suppliers
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Read single supplier by ID
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->name = $row['name'];
            $this->contact_person = $row['contact_person'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->address = $row['address'];
            $this->status = $row['status'];
            return true;
        }
        return false;
    }

    // Create supplier
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET name=:name, contact_person=:contact_person, email=:email,
                      phone=:phone, address=:address, status='active'";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":contact_person", $this->contact_person);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        
        return $stmt->execute();
    }

    // Update supplier
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name = :name,
                      contact_person = :contact_person,
                      email = :email,
                      phone = :phone,
                      address = :address,
                      status = :status
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":contact_person", $this->contact_person);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }

    // Delete supplier
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }

    // Toggle status
    public function toggleStatus() {
        $query = "UPDATE " . $this->table_name . "
                  SET status = CASE 
                    WHEN status = 'active' THEN 'inactive' 
                    ELSE 'active' 
                  END
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }
}
?>