import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useCallback } from "react";
import { loadCurrentUser } from "./Ui";
import { currentUserSelector } from './selectors/currentuser';


export default function useRights(OR: boolean = false): (rights: string[]) => boolean | null {
    const dispatch = useDispatch();
    const currentUser = useSelector(currentUserSelector);

    useEffect(() => {
        dispatch(loadCurrentUser());
    }, []);

    const allRights = useMemo(() => {
        if(currentUser) {
            return [...(new Set(currentUser.roles.reduce<string[]>((acc, role) => {
                if(role.rights) {
                    acc.push(...role.rights.map(({ident}) => ident));
                }
                return acc;
            }, []))).values()];
        }
        return [];
    }, [currentUser]);

    return useCallback((rights: []) => {
        if(!currentUser) {
            return null;
        }

        if(OR) {
            return !! rights.find((right) => allRights.includes(right));
        }
        
        const unmatching = rights.some((right) => !allRights.includes(right));
        return !unmatching;
    },
    [allRights, currentUser]);
}