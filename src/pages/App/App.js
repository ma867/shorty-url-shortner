import { useState, useEffect } from "react";
import AuthPage from "../AuthPage/AuthPage";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  BrowserRouter,
  BrowserRouter as Router,
} from "react-router-dom";

import { getUser } from "../../utilities/users-service";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import UserDashboard from "../UserDashboard/UserDashboard";
import HomePage from "../HomePage/HomePage";
import LinkTree from "../LinkTree/LinkTree";

function App() {
  const [user, setUser] = useState(getUser());
  const [domainName, setDomainName] = useState("shorty-url-ga.herokuapp.com");
  const [globalLink, setGlobalLink] = useState({});
  const [newGlobalLink, setNewGlobalLink] = useState({
    url: "",
    linkTree: false,
  });

  const [showShortenedUrl, setShowShortenedUrl] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const [showNewShortyForm, setShowNewShortyForm] = useState(false);
  const [linkTreeToggled, setLinkTreeToggled] = useState(false);

  const createGlobalLink = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newGlobalLink }),
      });
      const data = await response.json();
      setGlobalLink(data);
      setShowShortenedUrl(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (evt) => {
    setNewGlobalLink({ ...newGlobalLink, [evt.target.name]: evt.target.value });
  };

  const navigate = useNavigate();

  const [userLink, setUserLink] = useState("");
  const [newUserLink, setNewUserLink] = useState({
    url: "",
    linkTree: false,
    title: "",
  });

  const createUserLink = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/links/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newUserLink,
        }),
      });
      const data = await response.json();
      setUserLink(data);
      setShowShortenedUrl(true);

      setShowNewShortyForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserLinkChange = (evt) => {
    setNewUserLink({
      ...newUserLink,
      [evt.target.name]: evt.target.value,
    });
  };

  useEffect(() => {}, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              domainName={domainName}
              setUser={setUser}
              globalLink={globalLink}
              createGlobalLink={createGlobalLink}
              newGlobalLink={newGlobalLink}
              handleChange={handleChange}
              signUpModal={signUpModal}
              setSignUpModal={setSignUpModal}
              showShortenedUrl={showShortenedUrl}
              setShowShortenedUrl={setShowShortenedUrl}
              createUserLink={createUserLink}
              userLink={userLink}
              setUserLink={setUserLink}
              newUserLink={newUserLink}
              setNewUserLink={setNewUserLink}
              handleUserLinkChange={handleUserLinkChange}
              setNewGlobalLink={setNewGlobalLink}
            />
          }
        />
        <Route path="/u/:name" element={<LinkTree />} />

        {user ? (
          <Route
            path="/u/dashboard"
            element={
              <UserDashboard
                user={user}
                domainName={domainName}
                setUser={setUser}
                showShortenedUrl={showShortenedUrl}
                setShowShortenedUrl={setShowShortenedUrl}
                userLink={userLink}
                setUserLink={setUserLink}
                newUserLink={newUserLink}
                setNewUserLink={setNewUserLink}
                createUserLink={createUserLink}
                handleUserLinkChange={handleUserLinkChange}
                setNewGlobalLink={setNewGlobalLink}
                showNewShortyForm={showNewShortyForm}
                setShowNewShortyForm={setShowNewShortyForm}
                linkTreeToggled={linkTreeToggled}
                setLinkTreeToggled={setLinkTreeToggled}
              />
            }
          />
        ) : (
          <Route path="/u/dashboard" element={<Navigate to="/" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
