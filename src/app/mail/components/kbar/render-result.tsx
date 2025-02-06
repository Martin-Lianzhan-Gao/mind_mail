import { KBarResults, useMatches } from "kbar"
import ResultItem from "./result-item"


const RenderResults = () => {

    // get a list of results based on current search query and action id represents action group
    const { results, rootActionId } = useMatches();

    // console.log("Results:", results)

    return (
        // onRender function will render each item 1 by 1
        // use internal active variable to determine if an item is selected
        <KBarResults items={results} onRender={({ item, active }) => {
            if (typeof item === 'string') { // returns category
                return <div className="px-4 py-4 text-sm uppercase opacity-50 text-gray-600 dark:text-gray-400">{ item }</div>
            }
            // render returned action
            return <ResultItem
                action={item}
                active={active}
                currentRootActionId={rootActionId ?? ""}
            />
        }} />
    )
}

export default RenderResults