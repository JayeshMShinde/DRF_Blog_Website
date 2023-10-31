import React, { useState } from "react";
import BlogContext from "./BlogContext";

const BlogState = ({children}) =>{
    const [blog, setBlog] = useState([]);
    return(
        <div>
            <BlogContext.Provider value={{blog, setBlog}}>
                {children}
            </BlogContext.Provider>
        </div>
    )
}

export default BlogState;