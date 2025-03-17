import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  TextField,
  Card,
  CardContent,
  Avatar,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [commentData, setCommentData] = useState({});
  const [loading, setLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [expandedComments, setExpandedComments] = useState({});
  const blogsPerPage = 6;
  const truncateLength = 250;
  const initialCommentsToShow = 2;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/blog/getBlog?page=${currentPage}&limit=${blogsPerPage}`
      );
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalBlogs(data.total); 
    } catch (err) {
      console.error("Error fetching blogs", err);
      toast.error("Error fetching blogs");
    }
  };

  const handleCommentSubmit = async (blogId) => {
    const commentText = commentData[blogId];
    if (!commentText) {
      toast.error("Please enter a comment");
      return;
    }

    setLoading((prev) => ({ ...prev, [blogId]: true }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/blog/${blogId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ commentText }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setCommentData((prevData) => ({
          ...prevData,
          [blogId]: "",
        }));
        fetchBlogs();
      } else {
        toast.error("Please login first.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  const handleCommentChange = (blogId, event) => {
    setCommentData((prevData) => ({
      ...prevData,
      [blogId]: event.target.value,
    }));
  };

  const handleNextPage = () => {
    if (currentPage * blogsPerPage < totalBlogs) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleToggleContent = (blogId) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId
          ? { ...blog, showFullContent: !blog.showFullContent }
          : blog
      )
    );
  };

  const toggleComments = (blogId) => {
    setExpandedComments(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  return (
    <div>
      <NavBar />
      <div className="blog-page">
        <div className="blogs-container">
          {blogs.map((blog) => (
            <Card key={blog._id} className="blog-card">
              <CardContent sx={{ p: 0 }}>
                <div className="blog-header">
                  <Avatar
                    alt={blog.userId?.name || "Unknown Writer"}
                    src={blog.userId?.profileImage || "default-avatar.jpg"}
                    className="writer-avatar"
                  />
                  <div className="writer-info">
                    <Typography variant="h6">
                      {blog.userId?.name || "Unknown Writer"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
                <Box sx={{ px: 2 }}>
                  <Typography variant="h5" className="blog-title">
                    {blog.title}
                  </Typography>
                  <Chip 
                    label={blog.category} 
                    className="blog-category"
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      }
                    }}
                  />
                </Box>
                <Typography 
                  variant="body1" 
                  className="blog-content"
                  component="div"
                  sx={{
                    '& p': { marginBottom: '1em' },
                    '& p:last-child': { marginBottom: 0 },
                    '& ul, & ol': { 
                      paddingLeft: '1.5em',
                      marginBottom: '1em'
                    },
                    '& li': { marginBottom: '0.5em' },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      marginTop: '1.5em',
                      marginBottom: '0.5em',
                      fontWeight: 600
                    }
                  }}
                >
                  {blog.showFullContent
                    ? blog.content
                    : `${blog.content.slice(0, truncateLength)}...`}
                </Typography>
                <Box sx={{ px: 2, mb: 1 }}>
                  <Button
                    onClick={() => handleToggleContent(blog._id)}
                    variant="text"
                    sx={{
                      color: '#65676b',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#f0f2f5',
                      },
                    }}
                  >
                    {blog.showFullContent ? "See less" : "See more"}
                  </Button>
                </Box>

                <Divider sx={{ my: 1 }} />

                <div className="comments-section">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ChatBubbleOutlineIcon sx={{ mr: 1, color: '#65676b', fontSize: '1.25rem' }} />
                    <Typography variant="body2" className="comments-title">
                      Comments
                    </Typography>
                  </Box>
                  {blog.comments.length ? (
                    <>
                      <div className="comments-container">
                        {blog.comments.slice(0, expandedComments[blog._id] ? undefined : initialCommentsToShow).map((comment) => (
                          <div key={comment._id} className="comment-item">
                            <Avatar
                              alt={comment.userId?.name || "Anonymous"}
                              src={comment.userId?.profileImage || "default-avatar.jpg"}
                              className="comment-avatar"
                            />
                            <div className="comment-info">
                              <Typography variant="body2" className="commenter-name">
                                {comment.userId?.name || "Anonymous"}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" className="comment-time">
                                {new Date(comment.createdAt).toLocaleString()}
                              </Typography>
                              <Typography variant="body1" className="comment-text">
                                {comment.commentText || "No Comment Provided"}
                              </Typography>
                            </div>
                          </div>
                        ))}
                      </div>
                      {blog.comments.length > initialCommentsToShow && (
                        <Button
                          onClick={() => toggleComments(blog._id)}
                          variant="text"
                          className="show-more-comments"
                          endIcon={expandedComments[blog._id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        >
                          {expandedComments[blog._id] 
                            ? "Hide comments" 
                            : `View ${blog.comments.length - initialCommentsToShow} more comments`}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 1 }}>
                      No comments yet. Be the first to comment!
                    </Typography>
                  )}

                  <FormControl className="comment-form">
                    <TextField
                      placeholder="Write a comment..."
                      multiline
                      rows={1}
                      variant="outlined"
                      fullWidth
                      value={commentData[blog._id] || ""}
                      onChange={(e) => handleCommentChange(blog._id, e)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#1877f2',
                          },
                        },
                      }}
                    />
                    <Button
                      onClick={() => handleCommentSubmit(blog._id)}
                      variant="contained"
                      disabled={loading[blog._id]}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {loading[blog._id] ? (
                        <CircularProgress size={24} color="white" />
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </FormControl>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pagination-buttons">
          <Button
            onClick={handlePreviousPage}
            variant="contained"
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            variant="contained"
            disabled={currentPage * blogsPerPage >= totalBlogs}
          >
            Next
          </Button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Blog;
