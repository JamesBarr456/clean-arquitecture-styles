

export class ProductEntity {
    constructor(
        public sku: string,
        public brand: string,
        public name: string,
        public size: string[], // Ej: ['M', 'L']
        public genre: ('unisex' | 'male' | 'female' | 'kids')[],
        public cost_price: number,
        public sale_price: number,
        public stock?: number,
        public has_discount?: boolean,
        public discount_percentage?: number,
        public id?: string,
        public description?: string | null,
        public created_at?: Date,
        public updated_at?: Date,
        public image?: string[], // Ej: ['image1.jpg', 'image2.jpg']
        public is_active?: boolean,
        public category?: string[] // Ej: ['electronics', 'clothing']
    ) {}
}
