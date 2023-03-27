import React, { useEffect, useState } from "react";
import CommentsContext from "../context/CommentsContext";
import { CommentEntry } from "../types";

function CommentsContextProvider({ children }: { children: any }) {
  const [comments, setComments] = useState<CommentEntry[]>([]);

  const addComment = (comment: CommentEntry) => {
    setComments([...comments, comment]);
  };

  const removeComment = (comment: CommentEntry) => {
    setComments((comments) =>
      comments.filter((item) => item.id !== comment.id)
    );
  };

  return (
    <CommentsContext.Provider
      value={{
        comments,
        setComments,
        addComment,
        removeComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

export default CommentsContextProvider;
