// ResultItem.tsx
import { motion } from 'framer-motion'
import * as React from "react";
import type { ActionImpl, ActionId } from "kbar";

const ResultItem = React.forwardRef(
    (
        {
            action,
            active,
            currentRootActionId,
        }: {
            action: ActionImpl;
            active: boolean;
            currentRootActionId: ActionId;
        },
        ref: React.Ref<HTMLDivElement>
    ) => {
        // calculate ancestors of current item
        const ancestors = React.useMemo(() => {
            console.log(currentRootActionId);
            // if no current root action id, means not enters sub-action, return all ancestors one the top level
            if (!currentRootActionId) return action.ancestors;
            // find ancestor based on current root action id (represents its position / level in action tree)
            const index = action.ancestors.findIndex(
                (ancestor) => ancestor.id === currentRootActionId
            );

            const newAncestor = action.ancestors.slice(index + 1);

            console.log("new", newAncestor)

            return newAncestor;
        }, [action.ancestors, currentRootActionId]);

        return (
            <div
                ref={ref}
                className={`px-4 py-3 flex items-center justify-between cursor-pointer relative z-10`}
            >
                {active && (
                    <motion.div layoutId='kbar-result-item' className='bg-gray-200 dark:bg-gray-700 border-l-4 border-black dark:border-white absolute inset-0 !z-[-1]' transition={{
                        duration: 0.14,
                        type: 'spring',
                        ease: 'easeInOut',
                    }}>

                    </motion.div>
                )}
                <div className="flex gap-2 items-center relative z-10">
                    {action.icon && action.icon}
                    <div className="flex flex-col">
                        <div>
                            {ancestors.length > 0 &&
                                ancestors.map((ancestor) => (
                                    <React.Fragment key={ancestor.id}>
                                        <span className="opacity-50 mr-2">{ancestor.name}</span>
                                        <span className="mr-2">&rsaquo;</span>
                                    </React.Fragment>
                                ))}
                            <span>{action.name}</span>
                        </div>
                        {action.subtitle && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">{action.subtitle}</span>
                        )}
                    </div>
                </div>
                { /* Display shortcut keys of action */ }
                {action.shortcut?.length ? (
                    <div className="grid grid-flow-col gap-1 relative z-10">
                        {action.shortcut.map((sc) => (
                            <kbd
                                key={sc}
                                className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-1 border border-gray-200 dark:border-gray-700 shadow font-medium rounded-md text-xs flex items-center gap-1"
                            >
                                {sc}
                            </kbd>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
);

export default ResultItem;