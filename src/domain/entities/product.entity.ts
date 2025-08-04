

export class ProductEntity {
    constructor(
        public sku: string,
        public brand: string,
        public name: string,
        public size: string[], // Ej: ['M', 'L']
        public genre: string[], // Ej: ['unisex', 'male']
        public cost_price: number,
        public sale_price: number,
        public has_discount: boolean = false,
        public discount_percentage: number = 0,
        public stock: number = 0,
        public id?: string,
        public description?: string | null,
        public created_at?: Date,
        public updated_at?: Date,
        public image?: string[], // Ej: ['image1.jpg', 'image2.jpg']
        public is_active: boolean = true,
        public category?: string[] // Ej: ['electronics', 'clothing']
    ) {}
}
