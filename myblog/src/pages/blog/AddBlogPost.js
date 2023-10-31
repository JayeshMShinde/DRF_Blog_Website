import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  CssBaseline,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";
import { baseUrl } from "../../utils/useAxios";
import { useNavigate, useParams } from "react-router-dom";

// Import React-Quill and its styles
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TopNavBar from "../TopNavBar";
import AuthContext from "../../services/AuthContext";
import { PageNotFound } from "../PageNotFound";

export const AddBlogPost = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);
  const { slug: postSlug } = useParams();
  const isEditMode = Boolean(postSlug);
  const navigate = useNavigate();


  useEffect(() => {
    if (isEditMode) {
      axiosInstance.get(baseUrl + `/api/post/${postSlug}/`).then((response) => {
        const postData = response.data;
        setTitle(postData.title);
        setSlug(postData.slug);
        setContent(postData.content);
      });
    }
  }, [isEditMode, postSlug]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];

  const slugify = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const handleSave = async () => {
    try {
      const postData = {
        title: title,
        slug: slugify(title),
        author:user.user_id,
        content: content,
      };

      if (isEditMode) {
        const response = await axiosInstance.put(baseUrl + `/api/post/${postSlug}/`, postData);

        if (response.status === 200) {
          alert("Blog post updated successfully.");
          navigate('/blog')
        } else {
          console.error("Failed to update the blog post.");
        }
      } else {
        const response = await axiosInstance.post(baseUrl + "/api/post/", postData);

        if (response.status === 201) {
          alert("Blog post created successfully.");
          navigate("/blog")
        } else {
          console.error("Failed to create a new blog post.");
        }
      }
    } catch (error) {
      console.error("An error occurred while saving the blog post:", error);
    }
  };

  return (
    <>
      <TopNavBar />
      <div
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#EEEEEE",
          minHeight: "200vh",
        }}
      >
        {user ? (
          <Container
            component="main"
            maxWidth="md"
            style={{ marginTop: "3px" }}
          >
            <CssBaseline />
            <Paper style={{ padding: "20px" }}>
              <Typography variant="h4" style={{ textAlign: "center", paddingBottom: "30px" }}>
                {isEditMode ? "Edit Blog" : "Add Blog"}
              </Typography>
              <TextField
                fullWidth
                label="Title"
                variant="filled"
                style={{ marginBottom: "16px" }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                fullWidth
                label="Slug"
                variant="filled"
                disabled
                style={{ marginBottom: "16px" }}
                value={slugify(title)}
              />
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                modules={modules}
                formats={formats}
                style={{ height: "300px", marginBottom: "75px" }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginBottom: "26px" }}
                onClick={handleSave}
              >
                {isEditMode ? "Update" : "Publish"}
              </Button>
            </Paper>
          </Container>
        ) : (
          <>
            <PageNotFound />
          </>
        )}
      </div>
    </>
  );
};

