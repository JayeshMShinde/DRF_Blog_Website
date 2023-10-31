import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import AuthContext, { AuthProvider } from './services/AuthContext';
import { PageNotFound } from './pages/PageNotFound';
import { UserProfile } from './pages/ProfilePage';
import { ProfileSetting } from './pages/profile/ProfileSetting';
import { BlogPage } from './pages/blog/BlogPage';
import LoginPage from './pages/Login/LoginPage';
import { BlogDetails } from './pages/blog/PostDetails';
import { MyBlogPage } from './pages/blog/MyBlogPage';
import { MyPost } from './pages/blog/MyPost';
import { AddBlogPost } from './pages/blog/AddBlogPost';
import { MyProfile } from './pages/profile/MyProfile';
import { Footer } from './pages/Footer';
import { UpdateProfile } from './pages/profile/UpdateProfile';
import { ViewProfile } from './pages/profile/ViewProfile';
import BlogState from './services/blog/BlogState';
// import { BlogState } from './services/blog/BlogState';

function App() {
  return (
    <>
      <div className="App" style={{ minHeight: '100vh' }}>
        <Router>
          <AuthProvider>
            <BlogState>
              <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/' element={<HomePage />} />
                <Route path='/blog' element={<BlogPage />} />
                <Route path='/blog/:slug' element={<BlogDetails />} /> {/* Removed params */}
                <Route path='/my-blog' element={<MyBlogPage />} >
                  <Route path='my-post' element={<MyPost />} />
                </Route>
                <Route path='/add-blog' element={<AddBlogPost />} />
                <Route path='/edit-blog/:slug' element={<AddBlogPost />} />
                <Route path='/profile' element={<UserProfile />} >
                  <Route path='my-profile' element={<MyProfile />} />
                  <Route path='setting' element={<ProfileSetting />} />
                  <Route path='update-profile' element={<UpdateProfile />} />
                  <Route path='view-profile' element={<ViewProfile />} />
                </Route>
                <Route path='/not-found' element={<PageNotFound />} />
              </Routes>
            </BlogState>
          </AuthProvider>
        </Router>
      </div>
      <Footer />
    </>
  );
}

export default App;
