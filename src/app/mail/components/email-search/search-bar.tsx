'use client'

import { Loader2, Search, X } from "lucide-react";
import React from "react";
import { Input } from "~/components/ui/input";
import { atom, useAtom } from "jotai";
import useThreads from "~/hooks/use-threads";
import { motion } from "framer-motion";

export const searchValueAtom = atom('');
export const isSearchingAtom = atom(false);

const SearchBar = () => {

    const [searchValue, setSearchValue] = useAtom(searchValueAtom);
    const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
    const { isFetching } = useThreads();

    const handleBlur = () => { 
        if (searchValue === '') {
            setIsSearching(false);
        }
    }
    
    return (
        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <motion.div className="relative" layoutId="search-bar">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search emails..."
                    className="pl-8"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setIsSearching(true)}
                    onBlur={() => handleBlur()}
                />
                <div className="absolute right-2 top-2.5 flex items-center gap-2">
                    {isFetching && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                    <button
                        className="rounded-sm hover:bg-gray-800"
                        onClick={() => {
                            setSearchValue('')
                            setIsSearching(false)
                        }}
                    >
                        <X className="size-4 text-gray-400" />
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default SearchBar;