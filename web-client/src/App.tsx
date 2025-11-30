import './index.css'
import { useRoutes } from 'react-router-dom';
import { appRoutes } from '@/router/index.tsx';

function App() {

  const element = useRoutes(appRoutes);

  return (
    <>
      <div className='App'>
        {element}
      </div>
    </>
  )
}

export default App
