import { Route, Routes } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout.tsx'
import { LandingPage } from './pages/LandingPage.tsx'
import { RestaurantDetailPage } from './pages/RestaurantDetailPage.tsx'
import { SignInPage } from './pages/SignInPage.tsx'
import { SignUpPage } from './pages/SignUpPage.tsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="r/:restaurantId" element={<RestaurantDetailPage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
      </Route>
    </Routes>
  )
}

export default App
