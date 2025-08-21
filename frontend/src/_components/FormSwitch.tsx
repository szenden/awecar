import { Switch } from "@headlessui/react";

interface ISwitchChanged {
    (value: boolean): void
}

export function FormSwitch({
    checked,
    defaultChecked,
    value,
    name,
    onChange,
    onClick,
    small,
    label,
    description,
}: {
    checked?: boolean | undefined,
    defaultChecked?: boolean | undefined,
    value?: string | undefined,
    name?: string | undefined,
    small?: boolean | undefined,
    onChange?: ISwitchChanged,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    label?: string,
    description?: string,
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
                {description && <span className="text-sm text-gray-500">{description}</span>}
            </div>
            {small ? (
                <Switch
                    checked={checked}
                    value={value}
                    defaultChecked={defaultChecked}
                    onClick={onClick}
                    name={name}
                    onChange={onChange}
                    className="group relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-3 transform rounded-full bg-white ring-0 shadow-sm transition duration-200 ease-in-out group-data-checked:translate-x-3"
                    />
                </Switch>
            ) : (
                <Switch
                    checked={checked}
                    defaultChecked={defaultChecked}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onClick={onClick}
                    className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-5 transform rounded-full bg-white ring-0 shadow-sm transition duration-200 ease-in-out group-data-checked:translate-x-5"
                    />
                </Switch>
            )}
        </div>
    )
}

export default FormSwitch