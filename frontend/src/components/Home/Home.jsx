import { useRef } from 'react'
import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'
import RotatingText from '../HomePageText/HomePageText'
import TiltedCard from '../FeatureCards/FeatureCards'
import DecryptedText from '../HomePageText/SideTextHome'

const Home = () => {

    const containerRef = useRef(null);

    return(
        <>
        <NavBar></NavBar>
            <div className='h-[160vh] mt-10'>
                <div className='flex flex-col w-screen justify-center items-center h-[90vh]'>
                    <div className='flex'>
                    <h1 className='text-8xl mr-3'>Finara</h1>
                    <RotatingText
                    texts={['Secure', 'Mordern', 'Seamless', 'Intelligent']}
                    mainClassName="px-2 text-8xl sm:px-2 md:px-3 bg-green-500 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                    />
                    </div>
                        <div className='ml-10 text-5xl'>
                        <DecryptedText
                        text="Where resilience meets innovation"
                        speed={100}
                        maxIterations={20}
                        characters="ABCD1234!?"
                        className="revealed"
                        parentClassName="all-letters"
                        encryptedClassName="encrypted"
                        />
                        </div>
                </div>
                <h1 className='ml-10 mt-10 text-4xl mb-8'>Features of Finara</h1>
                    <div className='flex justify-evenly px-10'>
                        <TiltedCard
                        captionText="Invetimate"
                        containerHeight="220px"
                        containerWidth="220px"
                        rotateAmplitude={12}
                        scaleOnHover={1.1}
                        showMobileWarning={false}
                        showTooltip={true}
                        displayOverlayContent={true}
                        overlayContent={
                            <p className="tilted-card-demo-text text-3xl ml-3 mt-3">
                            Investimate
                            </p>
                        }
                        />

                        <TiltedCard
                        captionText="Invetimate"
                        containerHeight="220px"
                        containerWidth="220px"
                        rotateAmplitude={12}
                        scaleOnHover={1.1}
                        showMobileWarning={false}
                        showTooltip={true}
                        displayOverlayContent={true}
                        overlayContent={
                            <p className="tilted-card-demo-text text-3xl ml-3 mt-3">
                            Latest News
                            </p>
                        }
                        />

                        <TiltedCard
                        captionText="Invetimate"
                        containerHeight="220px"
                        containerWidth="220px"
                        rotateAmplitude={12}
                        scaleOnHover={1.1}
                        showMobileWarning={false}
                        showTooltip={true}
                        displayOverlayContent={true}
                        overlayContent={
                            <p className="tilted-card-demo-text text-3xl ml-3 mt-3">
                            Something
                            </p>
                        }
                        />

                        <TiltedCard
                        captionText="Kendrick Lamar - GNX"
                        containerHeight="220px"
                        containerWidth="220px"
                        rotateAmplitude={12}
                        scaleOnHover={1.1}
                        showMobileWarning={false}
                        showTooltip={true}
                        displayOverlayContent={true}
                        overlayContent={
                            <p className="tilted-card-demo-text text-3xl ml-3 mt-3">
                                Spendly
                            </p>
                        }
                        />
                    </div>
            </div>
        <Footer></Footer>
        </>
    )
}

export default Home;