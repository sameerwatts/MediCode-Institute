import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'styles/theme';
import GlobalStyle from 'styles/GlobalStyle';
import Navbar from 'components/layout/Navbar';
import Footer from 'components/layout/Footer';
import Loader from 'components/common/Loader';

const Home = lazy(() => import('pages/Home'));
const Courses = lazy(() => import('pages/Courses'));
const About = lazy(() => import('pages/About'));
const Quiz = lazy(() => import('pages/Quiz'));
const Blog = lazy(() => import('pages/Blog'));
const NotFound = lazy(() => import('pages/NotFound'));

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
