interface StockBadgeProps {
    stock: number;
    lowThreshold?: number;
}

export const StockBadge = ({ stock, lowThreshold = 5 }: StockBadgeProps) => {
    if (stock === 0) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                bg-red-50 text-red-700 ring-1 ring-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Sin stock
            </span>
        );
    }

    if (stock <= lowThreshold) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Stock bajo ({stock})
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
            bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {stock} en stock
        </span>
    );
};