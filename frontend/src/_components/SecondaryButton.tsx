import clsx from "clsx"
import { IButtonClick } from "./PrimaryButton"

export function SecondaryButton({
    children,
    onClick,
    className,
    type = "button",
}: {
    children: React.ReactNode,
    onClick?: IButtonClick,
    className?: string | undefined,
    type?: "submit" | "button" | "reset"
}) {
    return (
        <button type={type} onClick={onClick ? (e) => onClick(e) : undefined} className={clsx(className, "rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50")}>
            {children}
        </button>
    )
}

export default SecondaryButton