import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: ReactNode;
}

const variantClasses = {
    primary:
        "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400 shadow-sm hover:shadow-md",
    secondary:
        "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 focus:ring-stone-300 shadow-sm",
    danger:
        "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-sm hover:shadow-md",
    ghost:
        "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-800 focus:ring-stone-300",
    success:
        "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400 shadow-sm hover:shadow-md",
};

const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
};

export const Button = ({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    className = "",
    disabled,
    ...rest
}: ButtonProps) => {
    const isDisabled = disabled || loading;

    return (
        <button
            disabled={isDisabled}
            className={`
                inline-flex items-center justify-center font-medium rounded-lg
                transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${className}
            `}
            {...rest}
        >
            {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : icon}
            {children}
        </button>
    );
};

// --- Icono reutilizable ---
const EditIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);
const TrashIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const EyeIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

// Shortcut buttons for table actions
export const EditButton = (props: Omit<ButtonProps, "variant" | "icon" | "children">) => (
    <Button variant="ghost" size="sm" icon={<EditIcon />} {...props}>Editar</Button>
);

export const DeleteButton = (props: Omit<ButtonProps, "variant" | "icon" | "children">) => (
    <Button variant="ghost" size="sm" icon={<TrashIcon />}
        className="text-red-500 hover:bg-red-50 hover:text-red-700" {...props}>
        Eliminar
    </Button>
);

export const DetailsButton = (props: Omit<ButtonProps, "variant" | "icon" | "children">) => (
    <Button variant="ghost" size="sm" icon={<EyeIcon />} {...props}>Detalle</Button>
);

export const CreateButton = ({ children = "Crear", ...props }: Omit<ButtonProps, "variant" | "icon">) => (
    <Button variant="primary" size="md" icon={<PlusIcon />} {...props}>{children}</Button>
);