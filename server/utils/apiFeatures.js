// utils/apiFeatures.js
// API features for filtering, sorting, pagination, and search

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    Object.keys(queryObj).forEach(
      (key) =>
        (queryObj[key] === "" || queryObj[key] == null) && delete queryObj[key]
    );

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "keyword",
      "search",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering for gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    const allowedFields = [
      "price",
      "name",
      "createdAt",
      "averageRating",
      "stock",
    ];
    const allowedOrders = ["asc", "desc"];

    const sortBy = allowedFields.includes(this.queryString.sortBy)
      ? this.queryString.sortBy
      : "createdAt";

    const sortOrder = allowedOrders.includes(this.queryString.sortOrder)
      ? this.queryString.sortOrder
      : "desc";

    this.query = this.query
      .collation({ locale: "en", strength: 2 }) // 👈 Enables proper name sorting
      .sort({ [sortBy]: sortOrder });

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  search() {
    const searchTerm = this.queryString.keyword || this.queryString.search;
    if (searchTerm && searchTerm.trim() !== "") {
      const searchCondition = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { "specifications.brand": { $regex: searchTerm, $options: "i" } },
          { "specifications.model": { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
        ],
      };

      // Add $and if previous conditions exist
      this.query = this.query.find({ $and: [searchCondition] });
    }
    return this;
  }

  // Additional method for price range filtering
  priceRange() {
    if (this.queryString.minPrice || this.queryString.maxPrice) {
      const priceFilter = {};

      if (this.queryString.minPrice) {
        priceFilter.$gte = parseFloat(this.queryString.minPrice);
      }

      if (this.queryString.maxPrice) {
        priceFilter.$lte = parseFloat(this.queryString.maxPrice);
      }

      this.query = this.query.find({ price: priceFilter });
    }
    return this;
  }

  // Method for rating filtering
  ratingFilter() {
    if (this.queryString.minRating) {
      this.query = this.query.find({
        averageRating: { $gte: parseFloat(this.queryString.minRating) },
      });
    }
    return this;
  }

  // Method for stock filtering
  stockFilter() {
    if (this.queryString.inStock === "true") {
      this.query = this.query.find({ stock: { $gt: 0 } });
    } else if (this.queryString.inStock === "false") {
      this.query = this.query.find({ stock: { $lte: 0 } });
    }
    return this;
  }

  // Method for brand filtering
  brandFilter() {
    if (this.queryString.brand) {
      const brands = Array.isArray(this.queryString.brand)
        ? this.queryString.brand
        : [this.queryString.brand];

      this.query = this.query.find({
        "specifications.brand": { $in: brands },
      });
    }
    return this;
  }

  // Method for category filtering
  categoryFilter() {
    if (this.queryString.category) {
      const categories = Array.isArray(this.queryString.category)
        ? this.queryString.category
        : [this.queryString.category];

      this.query = this.query.find({
        category: { $in: categories },
      });
    }
    return this;
  }

  // Combined filter method that applies all filters
  applyAllFilters() {
    return this.filter()
      .search()
      .priceRange()
      .ratingFilter()
      .stockFilter()
      .brandFilter()
      .categoryFilter()
      .sort()
      .limitFields()
      .paginate();
  }
}

module.exports = APIFeatures;
