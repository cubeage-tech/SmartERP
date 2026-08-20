import { Outlet } from 'react-router-dom'
import HeropageNavbar from '../components/Public/HeropageNavbar'
import Footer from '../components/Public/Footer'

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeropageNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
