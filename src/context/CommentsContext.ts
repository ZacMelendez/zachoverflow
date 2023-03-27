import { createContext, Dispatch, SetStateAction } from "react";
import { CommentEntry } from "../types";

declare global {
    interface CommentsContextProps {
        comments: CommentEntry[];
        setComments: Dispatch<SetStateAction<CommentEntry[]>>;
        addComment: (comment: CommentEntry) => void;
        removeComment: (comment: CommentEntry) => void;
    }
}

const CommentsContext = createContext<CommentsContextProps>({
    comments: [],
    setComments: () => {},
    addComment: () => {},
    removeComment: () => {},
});

export default CommentsContext;
