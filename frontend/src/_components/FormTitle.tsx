import { SecondaryText } from "./SecondaryText"

export function FormTitle({
    title,
    description,
    children
}: {
    children?: React.ReactNode,
    title?:string,
    description?:string | undefined
}) {
    if (title) {
        return (
            <>
                <h3 className="text-base/7 font-semibold text-gray-900">{title} 
                </h3>
                {description&&<SecondaryText>{description}</SecondaryText>}
                {children} 
            </>
        )
    }
    
    // Support usage as <FormTitle>Title Text</FormTitle>
    return (
        <h3 className="text-base/7 font-semibold text-gray-900">{children}</h3>
    )
}

export default FormTitle

