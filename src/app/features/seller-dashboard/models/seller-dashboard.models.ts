// ── Dashboard Stats ──────────────────────────────────────────────────────

export interface SellerDashboardDto {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;

    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    totalRevenue: number;

    averageRating: number;
    totalReviews: number;
}

// ── Seller's product list ─────────────────────────────────────────────────

export interface SellerProductSummaryDto {
    id: number;
    name: string;
    price: number;
    discountedPrice?: number;
    stock: number;
    isActive: boolean;
    categoryName: string;
    categoryId?: number;
    averageRating: number;
    reviewCount: number;
    totalUnitsSold: number;
    createdAt: string;
    imageUrls: string[];
    description?: string;
}

// ── Seller's order list ───────────────────────────────────────────────────

export interface SellerOrderSummaryDto {
    orderId: number;
    orderNumber: string;
    customerEmail: string;
    status: string;
    sellerItemsTotal: number;
    sellerItemCount: number;
    createdAt: string;
}

// ── Paginated Response ────────────────────────────────────────────────────

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

// ── Product Filter ────────────────────────────────────────────────────────

export class SellerProductFilterDto {
    search?: string;
    categoryId?: number;
    isActive?: boolean;
    inStock?: boolean;
    sortBy: string = 'createdAt';
    descending: boolean = true;
    page: number = 1;
    pageSize: number = 20;
}

// ── Order Filter ──────────────────────────────────────────────────────────

export class SellerOrderFilterDto {
    status?: string;
    page: number = 1;
    pageSize: number = 20;
}
// ── Create Product ────────────────────────────────────────────────────────

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    stock: number;
    categoryId: number;
    images?: File[];
}

// ── Update Product ────────────────────────────────────────────────────────

export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    discountedPrice?: number;
    stock?: number;
    categoryId?: number;
    isActive?: boolean;
    newImages?: File[];
    removeImageIds?: number[];
}
