export function FormLabel({
    htmlFor,
    name,
    label,
    children,
    required,
}:{
    htmlFor?: string,
    name?: string,
    label?: string,
    children?: React.ReactNode,
    required?: boolean
}){
    return (
        <label htmlFor={htmlFor || name} className="block text-sm/6 font-medium text-gray-900">
            {label || children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    )
}

export default FormLabel