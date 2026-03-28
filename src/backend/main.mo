import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // Product type
  type ProductId = Nat;

  public type Product = {
    id : ProductId;
    name : Text;
    price : Float;
    description : Text;
    category : Text;
    imageUrl : Text;
    createdAt : Int;
  };

  var nextProductId = 1;
  let products = Map.empty<ProductId, Product>();

  public shared ({ caller }) func addProduct(
    name : Text,
    price : Float,
    description : Text,
    category : Text,
    imageUrl : Text
  ) : async ProductId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let productId = nextProductId;
    products.add(
      productId,
      {
        id = productId;
        name = name;
        price = price;
        description = description;
        category = category;
        imageUrl = imageUrl;
        createdAt = Time.now();
      },
    );
    nextProductId += 1;
    productId;
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    price : Float,
    description : Text,
    category : Text,
    imageUrl : Text
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        products.add(
          id,
          {
            id = id;
            name = name;
            price = price;
            description = description;
            category = category;
            imageUrl = imageUrl;
            createdAt = existingProduct.createdAt;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(p : Product) : Bool {
        p.category == category;
      }
    );
  };

  // Seed sample products - done in system init without caller context
  // We directly add to the map without going through addProduct
  ignore do {
    let sampleProducts : [Product] = [
      {
        id = 1;
        name = "Classic White T-Shirt";
        price = 19.99;
        description = "A timeless cotton tee for everyday wear";
        category = "tops";
        imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab";
        createdAt = Time.now();
      },
      {
        id = 2;
        name = "Blue Denim Jacket";
        price = 59.99;
        description = "Versatile denim jacket for layering";
        category = "tops";
        imageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5";
        createdAt = Time.now();
      },
      {
        id = 3;
        name = "Black Skinny Jeans";
        price = 39.99;
        description = "Slim fit jeans with stretch fabric";
        category = "bottoms";
        imageUrl = "https://images.unsplash.com/photo-1542272604-787c3835535d";
        createdAt = Time.now();
      },
      {
        id = 4;
        name = "Plaid Flannel Shirt";
        price = 29.99;
        description = "Warm and stylish flannel button-up";
        category = "tops";
        imageUrl = "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf";
        createdAt = Time.now();
      },
      {
        id = 5;
        name = "Summer Floral Dress";
        price = 49.99;
        description = "Lightweight dress with floral print";
        category = "dresses";
        imageUrl = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1";
        createdAt = Time.now();
      },
      {
        id = 6;
        name = "Leather Belt";
        price = 24.99;
        description = "Genuine leather belt with metal buckle";
        category = "accessories";
        imageUrl = "https://images.unsplash.com/photo-1624222247344-550fb60583c2";
        createdAt = Time.now();
      },
      {
        id = 7;
        name = "Oversized Hoodie";
        price = 34.99;
        description = "Comfortable fleece hoodie for lounging";
        category = "tops";
        imageUrl = "https://images.unsplash.com/photo-1556821840-3a63f95609a7";
        createdAt = Time.now();
      },
      {
        id = 8;
        name = "Chino Shorts";
        price = 27.99;
        description = "Casual shorts in cotton fabric";
        category = "bottoms";
        imageUrl = "https://images.unsplash.com/photo-1591195853828-11db59a44f6b";
        createdAt = Time.now();
      },
    ];

    for (product in sampleProducts.vals()) {
      products.add(product.id, product);
    };
    nextProductId := 9;
  };
};
