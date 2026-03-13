import Float "mo:core/Float";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  type Medicine = {
    id : Nat;
    name : Text;
    category : Text;
    dosage : Text;
    quantity : Nat;
    supplierId : Nat;
    purchasePrice : Float;
    salePrice : Float;
    expiryDate : Text;
    isNearExpiry : Bool;
  };

  type Supplier = {
    id : Nat;
    name : Text;
    contact : Text; // JSON with phone/address/email
  };

  type Sale = {
    id : Nat;
    medicineId : Nat;
    medicineName : Text;
    category : Text;
    quantity : Nat;
    purchasePrice : Float;
    salePrice : Float;
    totalPrice : Float;
    saleDate : Text;
    patientName : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  type SalesTrend = {
    month : Text;
    totalSales : Nat;
    totalRevenue : Float;
  };

  type CategoryDemand = {
    category : Text;
    jan : Nat;
    feb : Nat;
    mar : Nat;
  };

  type AnalyticsSummary = {
    totalMedicines : Nat;
    totalSales : Nat;
    totalRevenue : Float;
  };

  module Medicine {
    public func compare(m1 : Medicine, m2 : Medicine) : Order.Order {
      Nat.compare(m1.id, m2.id);
    };
  };

  module Supplier {
    public func compare(s1 : Supplier, s2 : Supplier) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  module Sale {
    public func compare(s1 : Sale, s2 : Sale) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  var nextMedicineId = 1;
  var nextSupplierId = 1;
  var nextSaleId = 1;

  let medicines = Map.empty<Nat, Medicine>();
  let suppliers = Map.empty<Nat, Supplier>();
  let sales = Map.empty<Nat, Sale>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Medicines
  public query ({ caller }) func getMedicines() : async [Medicine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view medicines");
    };
    medicines.values().toArray().sort();
  };

  public shared ({ caller }) func addMedicine(
    name : Text,
    category : Text,
    dosage : Text,
    quantity : Nat,
    supplierId : Nat,
    purchasePrice : Float,
    salePrice : Float,
    expiryDate : Text,
    isNearExpiry : Bool,
  ) : async Medicine {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add medicines");
    };

    let medicine : Medicine = {
      id = nextMedicineId;
      name;
      category;
      dosage;
      quantity;
      supplierId;
      purchasePrice;
      salePrice;
      expiryDate;
      isNearExpiry;
    };
    medicines.add(nextMedicineId, medicine);
    nextMedicineId += 1;
    medicine;
  };

  public shared ({ caller }) func updateMedicine(
    id : Nat,
    name : Text,
    category : Text,
    dosage : Text,
    quantity : Nat,
    supplierId : Nat,
    purchasePrice : Float,
    salePrice : Float,
    expiryDate : Text,
    isNearExpiry : Bool,
  ) : async ?Medicine {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update medicines");
    };

    switch (medicines.get(id)) {
      case (?_) {
        let medicine : Medicine = {
          id;
          name;
          category;
          dosage;
          quantity;
          supplierId;
          purchasePrice;
          salePrice;
          expiryDate;
          isNearExpiry;
        };
        medicines.add(id, medicine);
        ?medicine;
      };
      case (null) { Runtime.trap("Medicine not found") };
    };
  };

  public shared ({ caller }) func deleteMedicine(id : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete medicines");
    };

    switch (medicines.get(id)) {
      case (?_) {
        medicines.remove(id);
        true;
      };
      case (null) { Runtime.trap("Medicine not found") };
    };
  };

  // Suppliers
  public query ({ caller }) func getSuppliers() : async [Supplier] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view suppliers");
    };
    suppliers.values().toArray().sort();
  };

  public shared ({ caller }) func addSupplier(name : Text, contact : Text) : async Supplier {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add suppliers");
    };

    let supplier : Supplier = {
      id = nextSupplierId;
      name;
      contact;
    };
    suppliers.add(nextSupplierId, supplier);
    nextSupplierId += 1;
    supplier;
  };

  public shared ({ caller }) func updateSupplier(id : Nat, name : Text, contact : Text) : async ?Supplier {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update suppliers");
    };

    switch (suppliers.get(id)) {
      case (?_) {
        let supplier : Supplier = {
          id;
          name;
          contact;
        };
        suppliers.add(id, supplier);
        ?supplier;
      };
      case (null) { Runtime.trap("Supplier not found") };
    };
  };

  public shared ({ caller }) func deleteSupplier(id : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete suppliers");
    };

    switch (suppliers.get(id)) {
      case (?_) {
        suppliers.remove(id);
        true;
      };
      case (null) { Runtime.trap("Supplier not found") };
    };
  };

  // Sales
  public query ({ caller }) func getSales() : async [Sale] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sales");
    };
    sales.values().toArray().sort();
  };

  public shared ({ caller }) func recordSale(medicineId : Nat, quantity : Nat, patientName : Text, saleDate : Text) : async ?Sale {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record sales");
    };

    switch (medicines.get(medicineId)) {
      case (?med) {
        if (med.quantity < quantity) {
          return null;
        };

        let sale : Sale = {
          id = nextSaleId;
          medicineId;
          medicineName = med.name;
          category = med.category;
          quantity;
          purchasePrice = med.purchasePrice;
          salePrice = med.salePrice;
          totalPrice = med.salePrice * quantity.toFloat();
          saleDate;
          patientName;
        };
        sales.add(nextSaleId, sale);
        nextSaleId += 1;

        let updatedMedicine : Medicine = {
          med with quantity = med.quantity - quantity
        };
        medicines.add(medicineId, updatedMedicine);

        ?sale;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getNearExpiryAlerts() : async [Medicine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view expiry alerts");
    };
    medicines.values().toArray().filter(func(m : Medicine) : Bool { m.isNearExpiry });
  };

  // Analytics
  public query ({ caller }) func getMonthlySalesTrend() : async [SalesTrend] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };

    let monthMap = Map.empty<Text, { var totalSales : Nat; var totalRevenue : Float }>();

    for (sale in sales.values()) {
      let month = sale.saleDate;
      switch (monthMap.get(month)) {
        case (?existing) {
          existing.totalSales += sale.quantity;
          existing.totalRevenue += sale.totalPrice;
        };
        case (null) {
          monthMap.add(month, { var totalSales = sale.quantity; var totalRevenue = sale.totalPrice });
        };
      };
    };

    var result : [SalesTrend] = [];
    for ((month, data) in monthMap.entries()) {
      result := result.concat([{ month; totalSales = data.totalSales; totalRevenue = data.totalRevenue }]);
    };

    result;
  };

  public query ({ caller }) func getCategoryDemand() : async [CategoryDemand] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };

    let categoryMap = Map.empty<Text, { var jan : Nat; var feb : Nat; var mar : Nat }>();

    for (sale in sales.values()) {
      switch (categoryMap.get(sale.category)) {
        case (?existing) {
          existing.jan += sale.quantity;
        };
        case (null) {
          categoryMap.add(sale.category, { var jan = sale.quantity; var feb = 0; var mar = 0 });
        };
      };
    };

    var result : [CategoryDemand] = [];
    for ((category, data) in categoryMap.entries()) {
      result := result.concat([{ category; jan = data.jan; feb = data.feb; mar = data.mar }]);
    };

    result;
  };

  public query ({ caller }) func getAnalyticsSummary() : async AnalyticsSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };

    var totalSales = 0;
    var totalRevenue = 0.0;

    for (sale in sales.values()) {
      totalSales += sale.quantity;
      totalRevenue += sale.totalPrice;
    };

    {
      totalMedicines = medicines.size();
      totalSales;
      totalRevenue;
    };
  };

  // Data Initialization
  public shared ({ caller }) func initializeData() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize the system");
    };

    // Idempotency check: only initialize if medicines map is empty
    if (medicines.size() > 0) {
      return;
    };

    // Add suppliers
    let supplierArray = Array.tabulate(
      4,
      func(i) {
        {
          id = nextSupplierId + i;
          name = "Supplier " # (nextSupplierId + i).toText();
          contact = "Contact " # (nextSupplierId + i).toText();
        };
      },
    );

    for ((i, supplier) in supplierArray.enumerate()) {
      suppliers.add(nextSupplierId + i, supplier);
    };
    nextSupplierId += 4;

    // Add medicines
    for (i in Nat.range(1, 20)) {
      let category = if (i <= 5) { "Category A" } else if (i <= 10) {
        "Category B";
      } else { "Category C" };
      let medicine = {
        id = nextMedicineId;
        name = "Medicine " # nextMedicineId.toText();
        category;
        dosage = "Dosage " # nextMedicineId.toText();
        quantity = 100;
        supplierId = supplierArray[(nextMedicineId - 1) % 4].id;
        purchasePrice = 10.0 + (nextMedicineId * 2).toFloat();
        salePrice = 15.0 + (nextMedicineId * 2).toFloat();
        expiryDate = "2024-12-31";
        isNearExpiry = false;
      };
      medicines.add(nextMedicineId, medicine);
      nextMedicineId += 1;
    };

    // Add sales
    for (i in Nat.range(1, 50)) {
      let medicineId = if (i % 20 == 0) { 20 } else { i % 20 };
      let quantity = 1 + (i % 5);

      switch (medicines.get(medicineId)) {
        case (?med) {
          let sale : Sale = {
            id = nextSaleId;
            medicineId;
            medicineName = med.name;
            category = med.category;
            quantity;
            purchasePrice = med.purchasePrice;
            salePrice = med.salePrice;
            totalPrice = med.salePrice * quantity.toFloat();
            saleDate = "2024-06-01";
            patientName = "Patient " # nextSaleId.toText();
          };
          sales.add(nextSaleId, sale);
          nextSaleId += 1;
        };
        case (null) {};
      };
    };
  };
};
