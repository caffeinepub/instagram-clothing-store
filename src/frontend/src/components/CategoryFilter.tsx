const CATEGORIES = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Accessories",
  "Shoes",
];

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-2"
      data-ocid="category.tab"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={
            selected === cat
              ? "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ig-gradient text-white shadow-sm"
              : "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 bg-secondary text-muted-foreground hover:bg-border hover:text-foreground"
          }
          data-ocid="category.tab"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
