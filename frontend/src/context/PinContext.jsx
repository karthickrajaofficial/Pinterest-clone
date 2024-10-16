import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState([]);

  // Helper function for API calls
  const apiCall = async (method, url, data = {}, headers = {}) => {
    try {
      const response = await axios({ method, url, data, headers });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      throw error;
    }
  };

 
  const fetchPins = async () => {
    setLoading(true);
    try {
      const data = await apiCall("get", "/api/pin/all");
      setPins(data);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single pin by ID
  const fetchPin = async (id) => {
    setLoading(true);
    try {
      const data = await apiCall("get", `/api/pin/${id}`);
      setPin(data);
    } finally {
      setLoading(false);
    }
  };

  // Update a pin
  const updatePin = async (id, title, pinContent, setEdit) => {
    try {
      const data = await apiCall("put", `/api/pin/${id}`, { title, pin: pinContent });
      toast.success(data.message);
      fetchPin(id);
      setEdit(false);
    } catch (error) {
      // Handle error already done in apiCall
    }
  };

  // Add a comment to a pin
  const addComment = async (id, comment, setComment) => {
    try {
      const data = await apiCall("post", `/api/pin/comment/${id}`, { comment });
      toast.success(data.message);
      fetchPin(id);
      setComment("");
    } catch (error) {
      // Handle error already done in apiCall
    }
  };

 
  
  async function deleteComment(id, commentId) {
    try {
      const { data } = await axios.delete(
        `/api/pin/comment/${id}?commentId=${commentId}`
      );
      toast.success(data.message);
      fetchPin(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  

  // Delete a pin
  const deletePin = async (id, navigate) => {
    setLoading(true);
    try {
      const data = await apiCall("delete", `/api/pin/${id}`);
      toast.success(data.message);
      navigate("/");
      fetchPins();
    } finally {
      setLoading(false);
    }
  };

  // Add a new pin
  const addPin = async (formData, setFilePrev, setFile, setTitle, setPin, navigate) => {
    try {
      const data = await apiCall("post", "/api/pin/new", formData);
      toast.success(data.message);
      setFile([]);
      setFilePrev("");
      setPin("");
      setTitle("");
      fetchPins();
      navigate("/");
    } catch (error) {
      // Handle error already done in apiCall
    }
  };

  // Like a pin
  const likePin = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiCall("post", `/api/pin/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      fetchPin(id); // Refresh the pin data after liking
    } catch (error) {
      // Handle error already done in apiCall
      toast.error("Failed to like the pin.");
    }
  };
  
  const unlikePin = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiCall("post", `/api/pin/unlike/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      fetchPin(id); // Refresh the pin data after unliking
    } catch (error) {
      // Handle error already done in apiCall
      toast.error("Failed to unlike the pin.");
      console.error(error);
    }
  };
  


  useEffect(() => {
    fetchPins();
  }, []);

  return (
    <PinContext.Provider value={{ pins, loading, fetchPin, pin, updatePin, addComment, deleteComment, deletePin, addPin, fetchPins, likePin ,unlikePin }}>
      {children}
    </PinContext.Provider>
  );
};

export const PinData = () => useContext(PinContext);
