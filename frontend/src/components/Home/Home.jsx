import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'
import { MainText } from '../HeroText/HeroTextMain'
import { AuroraBackground } from '../AnimatetBG/AnimatedBG'

const Home = () => {
    return(
        <>
        {/* <AuroraBackground> */}
        <NavBar></NavBar>
            <div className='h-screen'>
                <MainText></MainText>
            </div>
        <Footer></Footer>
        {/* </AuroraBackground> */}
        </>
    )
}

export default Home;