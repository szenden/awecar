import clsx from "clsx"

export interface IButtonClick {
    (event: React.MouseEvent): void
}


export function PrimaryButton({
    id,
    children,
    onClick,
    className,
    disabled,
    type = "submit",
}: {
    id?:string|undefined,
    children: React.ReactNode,
    onClick?: IButtonClick,
    className?: string | undefined,
    disabled?: boolean | undefined,
    type?: "submit" | "button" | "reset"
}) {
    return (
        <button
            id={id}
            disabled={disabled}
            type={type}
            onClick={onClick}
            className={clsx(className, "rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600")}
        >
            {children}
        </button>
    )
}

export default PrimaryButton