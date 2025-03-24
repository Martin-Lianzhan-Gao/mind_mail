
import Avatar from "react-avatar"
import Select from "react-select"
import useThreads from "~/hooks/use-threads"
import { api } from "~/trpc/react"
import classNames from "classnames"
import React from "react"

type Props = {
    placeholder: string,
    label: string,
    //  The callback function that is called when the values are changed.
    onChange: (values: { label: string, value: string }[]) => void
    value: { label: string, value: string }[]
}

const TagInput = ({ placeholder, label, onChange, value }: Props) => {
    
    const { accountId } = useThreads();
    // email suggestions
    const { data: suggestions } = api.account.getEmailAddressSuggesstions.useQuery({ accountId });
    // input value state
    const [inputValue, setInputValue] = React.useState('')

    // react-select options, originally are all email addresses related to current emails
    const options = suggestions?.map((suggestion) => {
        return {
            label: (
                <span className="flex items-center gap-2">
                    <Avatar
                        name={suggestion.address}
                        size="25"
                        textSizeRatio={2}
                        round={true}
                    />
                    {suggestion.address}
                </span>
            ),
            value: suggestion.address
        }
    })

    return (
        <div className="border rounded-md flex items-center">
            <span className="ml-3 text-sm text-grey-500">
                {label}
            </span>
            <Select
                onInputChange={setInputValue}
                value={value}
                // @ts-expect-error: type mismatch between the onChange prop in Select component and the onChange function I'm passing to it.
                onChange={onChange}
                placeholder={placeholder}
                isMulti // multiple options
                // style
                className="w-full flex-1"
                // options of the select drop down
                // @ts-expect-error: same as above, type mismatch
                options={
                    // @ts-expect-error: same as above, type mismatch
                    inputValue ? options?.concat({ label: inputValue, value: inputValue }) : options
                }
                // detailed style settings
                classNames={{
                    control: () => { return '!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent' },
                    // selected value container
                    multiValue: () => { return 'dark:!bg-gray-700' },
                    // selected value content area
                    multiValueLabel: () => { return 'dark:bg-gray-700 dark:text-white rounded-md' },
                    // drop-down menu
                    menu: () => { return 'dark:bg-gray-700' },
                    // drop-down options
                    option: () => { return 'dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600' },
                    // input style
                    input: () => { return 'dark:text-gray-300' }
                }}
                classNamePrefix="react-select"
            />
        </div>
    )
}

export default TagInput;