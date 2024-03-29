import { useState, useEffect, useCallback } from "react";
// import { backendUrl } from "./../helper";
import { Navigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import "./userDetail.css";
import { backendUrl } from "../helper";
import { useSelector } from "react-redux";

const UserDetail = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [username, setUsername] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [files, setFiles] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(Boolean);
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();

  const fetchdata = useCallback(() => {
    const fethcHandler = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/userDetails/${user?.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setUsername(data.username);
        setDesc(data.desc);
        setLink(data.link);
        if (response.ok) setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fethcHandler();
  }, [user.id]);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  const userNameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const descChangeHandler = (event) => {
    setDesc(event.target.value);
  };
  const linkChangeHandler = (event) => {
    setLink(event.target.value);
  };
  const filesChangeHandler = (event) => {
    setFiles(event.target.files);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("username", username);
    data.append("desc", desc);
    data.append("link", link);
    data.append("file", files[0]);
    data.append("id", id);

    const response = await fetch(`${backendUrl}/userDetailsEdit/${id}`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setSubmitting(false);
      setRedirect(true);
    }
  };
  if (redirect) return <Navigate to={`/user-profile/${user?.id}`} />;
  return (
    <>
      {loading ? (
        <div className="spinner-div">
          <ClipLoader className="spinner" color="white" />
        </div>
      ) : (
        <div className="user-detail flex-row">
          <h3>Edit your profile</h3>
          <form onSubmit={submitHandler}>
            <div className="form-controller flex-row">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={userNameChangeHandler}
              />
            </div>
            <div className="form-controller flex-row">
              <label htmlFor="desc">Write about you</label>
              <input
                type="text"
                placeholder="something about you"
                id="desc"
                value={desc}
                onChange={descChangeHandler}
              />
            </div>
            <div className="form-controller flex-row">
              <label htmlFor="link">Your social link</label>
              <input
                type="text"
                placeholder="add a valuable social link"
                id="link"
                value={link}
                onChange={linkChangeHandler}
              />
            </div>
            <div className="form-controller flex-row  avatar">
              <label htmlFor="avatar">Avatar</label>
              <input type="file" id="avatar" onChange={filesChangeHandler} />
            </div>

            <button className="btn opacity-hover">
              {submitting ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default UserDetail;
