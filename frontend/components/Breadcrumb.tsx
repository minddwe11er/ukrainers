interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            item.label
          )}
          {index < items.length - 1 && <span> › </span>}
        </span>
      ))}
    </div>
  );
}
